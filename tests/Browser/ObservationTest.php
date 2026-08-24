<?php

use App\Models\Classe;
use App\Models\Observation;
use App\Models\Student;
use Laravel\Dusk\Browser;

test('un utilisateur peut ajouter une observation à un élève', function () {
    // Given un élève sans observation
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    $this->browse(function (Browser $browser) use ($classe, $student) {
        // When il ajoute une observation datée depuis la fiche élève
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Ajouter une observation')
            ->waitFor('#obs-commentaire')
            ->type('#obs-commentaire', 'Bonne participation en classe.')
            ->press('Enregistrer')
            ->waitForText('Bonne participation en classe.')
            // Then l'observation apparaît sur la fiche
            ->assertSee('Bonne participation en classe.');
    });

    expect(Observation::where('student_id', $student->id)
        ->where('commentaire', 'Bonne participation en classe.')
        ->exists())->toBeTrue();
});

test('un utilisateur peut modifier une observation', function () {
    // Given une observation existante
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create([
        'commentaire' => 'Premier jet.',
    ]);

    $this->browse(function (Browser $browser) use ($classe, $student, $observation) {
        // When il modifie le commentaire de l'observation
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Modifier')
            ->waitFor("#obs-commentaire-{$observation->id}")
            ->clear("#obs-commentaire-{$observation->id}")
            ->type("#obs-commentaire-{$observation->id}", 'Version corrigée.')
            ->press('Enregistrer')
            ->waitForText('Version corrigée.')
            // Then le commentaire est mis à jour
            ->assertSee('Version corrigée.');
    });

    expect($observation->fresh()->commentaire)->toBe('Version corrigée.');
});

test('un utilisateur peut supprimer une observation', function () {
    // Given une observation existante
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $observation = Observation::factory()->for($student)->create([
        'commentaire' => 'À supprimer.',
    ]);

    $this->browse(function (Browser $browser) use ($classe, $student) {
        // When il confirme la suppression depuis la boîte de dialogue native
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Supprimer')
            ->waitForDialog()
            ->acceptDialog()
            ->waitUntilMissingText('À supprimer.')
            // Then l'observation n'apparaît plus sur la fiche
            ->assertDontSee('À supprimer.');
    });

    expect(Observation::find($observation->id))->toBeNull();
});
