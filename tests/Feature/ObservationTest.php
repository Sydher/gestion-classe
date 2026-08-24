<?php

use App\Models\Classe;
use App\Models\Observation;
use App\Models\Student;
use App\Models\User;

test('store creates an observation for the owner of the student classe', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the owner submits a valid observation
    $response = $this->actingAs($user)->post(route('observations.store', $student), [
        'date' => '2026-02-01',
        'commentaire' => 'Bon travail en classe.',
    ]);

    // Then the observation is persisted for the student
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('observations', [
        'student_id' => $student->id,
        'commentaire' => 'Bon travail en classe.',
    ]);
});

test('store is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the stranger attempts to add an observation
    $response = $this->actingAs($stranger)->post(route('observations.store', $student), [
        'date' => '2026-02-01',
        'commentaire' => 'Bon travail en classe.',
    ]);

    // Then access is forbidden and no observation is created
    $response->assertForbidden();
    $this->assertDatabaseMissing('observations', ['student_id' => $student->id]);
});

test('store validation requires a date and a commentaire', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When submitting the form without date or commentaire
    $response = $this->actingAs($user)->post(route('observations.store', $student), [
        'date' => '',
        'commentaire' => '',
    ]);

    // Then validation errors are raised for both fields
    $response->assertSessionHasErrors(['date', 'commentaire']);
});

test('update is allowed for the owner and persists changes', function () {
    // Given an observation on a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create(['commentaire' => 'Old']);

    // When the owner updates the observation
    $response = $this->actingAs($user)->put(route('observations.update', $observation), [
        'date' => '2026-03-01',
        'commentaire' => 'New',
    ]);

    // Then the observation is updated
    $response->assertSessionHasNoErrors();
    expect($observation->refresh()->commentaire)->toBe('New');
});

test('update is forbidden for a user who does not own the observation student classe', function () {
    // Given an observation on a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create(['commentaire' => 'Old']);

    // When the stranger attempts to update the observation
    $response = $this->actingAs($stranger)->put(route('observations.update', $observation), [
        'date' => '2026-03-01',
        'commentaire' => 'New',
    ]);

    // Then access is forbidden and the observation is unchanged
    $response->assertForbidden();
    expect($observation->refresh()->commentaire)->toBe('Old');
});

test('destroy is allowed for the owner of the observation student classe', function () {
    // Given an observation on a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create();

    // When the owner deletes the observation
    $response = $this->actingAs($user)->delete(route('observations.destroy', $observation));

    // Then the observation is removed
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('observations', ['id' => $observation->id]);
});

test('destroy is forbidden for a user who does not own the observation student classe', function () {
    // Given an observation on a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create();

    // When the stranger attempts to delete the observation
    $response = $this->actingAs($stranger)->delete(route('observations.destroy', $observation));

    // Then access is forbidden and the observation still exists
    $response->assertForbidden();
    $this->assertDatabaseHas('observations', ['id' => $observation->id]);
});
