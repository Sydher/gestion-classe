<?php

use App\Models\Classe;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('index lists only the authenticated user classes', function () {
    // Given classes owned by the current user and by another user
    $user = User::factory()->create();
    $mine = Classe::factory()->for($user)->create();
    $other = Classe::factory()->create();

    // When visiting the classes index
    $response = $this->actingAs($user)->get(route('classes.index'));

    // Then only my classe is returned as props
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('classes', 1)
        ->where('classes.0.id', $mine->id)
    );
    expect($mine->id)->not->toBe($other->id);
});

test('store creates a classe for the authenticated user', function () {
    // Given an authenticated user and valid classe data
    $user = User::factory()->create();
    $data = [
        'nom' => 'CE2 A',
        'couleur_primaire' => '#112233',
        'couleur_secondaire' => '#445566',
        'couleur_tertiaire' => '#778899',
        'couleur_texte' => '#000000',
    ];

    // When submitting the store request
    $response = $this->actingAs($user)->post(route('classes.store'), $data);

    // Then the classe is persisted for that user and the response redirects
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('classes', [
        'user_id' => $user->id,
        'nom' => 'CE2 A',
    ]);
});

test('store validation rejects an invalid colour and missing name', function () {
    // Given an authenticated user and invalid classe data
    $user = User::factory()->create();

    // When submitting the store request with a bad colour and no name
    $response = $this->actingAs($user)->post(route('classes.store'), [
        'nom' => '',
        'couleur_primaire' => 'not-a-colour',
        'couleur_secondaire' => '#445566',
        'couleur_tertiaire' => '#778899',
        'couleur_texte' => '#000000',
    ]);

    // Then validation errors are raised for both fields
    $response->assertSessionHasErrors(['nom', 'couleur_primaire']);
});

test('store attaches an uploaded logo to the classe', function () {
    // Given an authenticated user uploading a logo file
    Storage::fake('public');
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('logo.png');

    // When submitting the store request with the logo
    $response = $this->actingAs($user)->post(route('classes.store'), [
        'nom' => 'CE2 A',
        'couleur_primaire' => '#112233',
        'couleur_secondaire' => '#445566',
        'couleur_tertiaire' => '#778899',
        'couleur_texte' => '#000000',
        'logo' => $file,
    ]);

    // Then the file is stored on the public disk and referenced on the classe
    $response->assertSessionHasNoErrors();
    $classe = Classe::where('user_id', $user->id)->firstOrFail();
    expect($classe->logo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($classe->logo_path);
});

test('show is allowed for the owner of the classe', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();

    // When the owner visits the show page
    $response = $this->actingAs($user)->get(route('classes.show', $classe));

    // Then access is granted
    $response->assertOk();
});

test('show is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();

    // When the stranger visits the show page
    $response = $this->actingAs($stranger)->get(route('classes.show', $classe));

    // Then access is forbidden
    $response->assertForbidden();
});

test('edit is allowed for the owner of the classe', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();

    // When the owner visits the edit page
    $response = $this->actingAs($user)->get(route('classes.edit', $classe));

    // Then access is granted
    $response->assertOk();
});

test('edit is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();

    // When the stranger visits the edit page
    $response = $this->actingAs($stranger)->get(route('classes.edit', $classe));

    // Then access is forbidden
    $response->assertForbidden();
});

test('update is allowed for the owner of the classe and persists changes', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create(['nom' => 'Old name']);

    // When the owner submits an update
    $response = $this->actingAs($user)->put(route('classes.update', $classe), [
        'nom' => 'New name',
        'couleur_primaire' => '#112233',
        'couleur_secondaire' => '#445566',
        'couleur_tertiaire' => '#778899',
        'couleur_texte' => '#000000',
    ]);

    // Then the classe is updated
    $response->assertSessionHasNoErrors();
    expect($classe->refresh()->nom)->toBe('New name');
});

test('update is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create(['nom' => 'Old name']);

    // When the stranger submits an update
    $response = $this->actingAs($stranger)->put(route('classes.update', $classe), [
        'nom' => 'New name',
        'couleur_primaire' => '#112233',
        'couleur_secondaire' => '#445566',
        'couleur_tertiaire' => '#778899',
        'couleur_texte' => '#000000',
    ]);

    // Then access is forbidden and the classe is unchanged
    $response->assertForbidden();
    expect($classe->refresh()->nom)->toBe('Old name');
});

test('update replaces an existing logo and deletes the previous file', function () {
    // Given a classe with an existing logo
    Storage::fake('public');
    $user = User::factory()->create();
    $oldPath = UploadedFile::fake()->image('old.png')->store('logos', 'public');
    $classe = Classe::factory()->for($user)->create(['logo_path' => $oldPath]);

    // When the owner uploads a new logo
    $response = $this->actingAs($user)->put(route('classes.update', $classe), [
        'nom' => $classe->nom,
        'couleur_primaire' => $classe->couleur_primaire,
        'couleur_secondaire' => $classe->couleur_secondaire,
        'couleur_tertiaire' => $classe->couleur_tertiaire,
        'couleur_texte' => $classe->couleur_texte,
        'logo' => UploadedFile::fake()->image('new.png'),
    ]);

    // Then the old file is deleted and a new one is stored
    $response->assertSessionHasNoErrors();
    Storage::disk('public')->assertMissing($oldPath);
    expect($classe->refresh()->logo_path)->not->toBe($oldPath);
    Storage::disk('public')->assertExists($classe->logo_path);
});

test('update without a new logo keeps the existing logo untouched', function () {
    // Given a classe with an existing logo
    Storage::fake('public');
    $user = User::factory()->create();
    $path = UploadedFile::fake()->image('old.png')->store('logos', 'public');
    $classe = Classe::factory()->for($user)->create(['logo_path' => $path]);

    // When the owner updates other fields without sending a logo file
    $response = $this->actingAs($user)->put(route('classes.update', $classe), [
        'nom' => 'Renamed',
        'couleur_primaire' => $classe->couleur_primaire,
        'couleur_secondaire' => $classe->couleur_secondaire,
        'couleur_tertiaire' => $classe->couleur_tertiaire,
        'couleur_texte' => $classe->couleur_texte,
    ]);

    // Then the logo path is unchanged and the file still exists
    $response->assertSessionHasNoErrors();
    expect($classe->refresh()->logo_path)->toBe($path);
    Storage::disk('public')->assertExists($path);
});

test('destroy is allowed for the owner of the classe and removes its logo', function () {
    // Given a classe owned by the current user with a logo
    Storage::fake('public');
    $user = User::factory()->create();
    $path = UploadedFile::fake()->image('logo.png')->store('logos', 'public');
    $classe = Classe::factory()->for($user)->create(['logo_path' => $path]);

    // When the owner deletes the classe
    $response = $this->actingAs($user)->delete(route('classes.destroy', $classe));

    // Then the classe and its logo file are removed
    $response->assertRedirect(route('classes.index'));
    $this->assertDatabaseMissing('classes', ['id' => $classe->id]);
    Storage::disk('public')->assertMissing($path);
});

test('destroy without a logo does not attempt to delete a file', function () {
    // Given a classe owned by the current user with no logo
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create(['logo_path' => null]);

    // When the owner deletes the classe
    $response = $this->actingAs($user)->delete(route('classes.destroy', $classe));

    // Then the classe is removed without error
    $response->assertRedirect(route('classes.index'));
    $this->assertDatabaseMissing('classes', ['id' => $classe->id]);
});

test('destroy is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();

    // When the stranger attempts to delete the classe
    $response = $this->actingAs($stranger)->delete(route('classes.destroy', $classe));

    // Then access is forbidden and the classe still exists
    $response->assertForbidden();
    $this->assertDatabaseHas('classes', ['id' => $classe->id]);
});
