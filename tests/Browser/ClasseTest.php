<?php

use App\Models\Classe;
use App\Models\User;
use Laravel\Dusk\Browser;

test('un utilisateur peut créer une classe', function () {
    // Given un utilisateur connecté
    $user = User::factory()->create();

    $this->browse(function (Browser $browser) use ($user) {
        // When il remplit et soumet le formulaire de création de classe
        $browser->loginAs($user)
            ->visit('/classes/create')
            ->waitFor('#nom')
            ->type('#nom', 'CE2 A')
            // PrimaryButton renders its label uppercase via CSS, which Dusk's button-text match respects
            ->press('CRÉER LA CLASSE')
            ->waitForText('CE2 A')
            // Then la classe est créée et affichée
            ->assertSee('CE2 A');
    });

    expect(Classe::where('user_id', $user->id)->where('nom', 'CE2 A')->exists())->toBeTrue();
});

test('un utilisateur peut modifier une classe', function () {
    // Given une classe existante
    $classe = Classe::factory()->create(['nom' => 'CE2 A']);

    $this->browse(function (Browser $browser) use ($classe) {
        // When il modifie le nom et le thème de couleurs de la classe
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}/edit")
            ->waitFor('#nom')
            ->clear('#nom')
            ->type('#nom', 'CE2 B')
            ->press('Forêt')
            ->press('Enregistrer')
            ->waitForText('CE2 B')
            // Then les changements sont enregistrés
            ->assertSee('CE2 B');
    });

    $classe->refresh();
    expect($classe->nom)->toBe('CE2 B');
    expect($classe->couleur_primaire)->toBe('#16A34A');
});

test('un utilisateur peut supprimer une classe', function () {
    // Given une classe existante
    $classe = Classe::factory()->create(['nom' => 'CE2 A']);

    $this->browse(function (Browser $browser) use ($classe) {
        // When il confirme la suppression depuis la modal de confirmation
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}/edit")
            ->waitFor('#nom')
            // DangerButton renders its label uppercase via CSS, which Dusk's button-text match respects
            ->press('SUPPRIMER')
            ->waitForText('SUPPRIMER DÉFINITIVEMENT')
            ->press('SUPPRIMER DÉFINITIVEMENT')
            ->waitForLocation('/classes')
            // Then la classe n'apparaît plus dans la liste
            ->assertPathIs('/classes')
            ->assertDontSee('CE2 A');
    });

    expect(Classe::find($classe->id))->toBeNull();
});
