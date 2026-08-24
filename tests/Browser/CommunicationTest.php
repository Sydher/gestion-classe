<?php

use App\Models\Classe;
use App\Models\Communication;
use App\Models\Student;
use Laravel\Dusk\Browser;

test('un utilisateur peut ajouter une communication à un élève', function () {
    // Given un élève sans communication
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    $this->browse(function (Browser $browser) use ($classe, $student) {
        // When il ajoute une communication depuis l'onglet Communications de la fiche élève
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Communications')
            ->waitForText('Ajouter une communication')
            ->press('Ajouter une communication')
            ->waitFor('#com-resume')
            ->type('#com-resume', 'Appel avec la famille au sujet des devoirs.')
            ->press('Enregistrer')
            ->waitForText('Appel avec la famille au sujet des devoirs.')
            // Then la communication apparaît sur la fiche
            ->assertSee('Appel avec la famille au sujet des devoirs.');
    });

    expect(Communication::where('student_id', $student->id)
        ->where('resume', 'Appel avec la famille au sujet des devoirs.')
        ->exists())->toBeTrue();
});

test('un utilisateur peut modifier une communication', function () {
    // Given une communication existante
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create([
        'type' => 'telephone',
        'resume' => 'Premier échange.',
    ]);

    $this->browse(function (Browser $browser) use ($classe, $student, $communication) {
        // When il modifie le type et le résumé de la communication
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Communications')
            ->waitForText('Ajouter une communication')
            ->press('Modifier')
            ->waitFor("#com-resume-{$communication->id}")
            ->select("#com-type-{$communication->id}", 'email')
            ->clear("#com-resume-{$communication->id}")
            ->type("#com-resume-{$communication->id}", 'Échange par email.')
            ->press('Enregistrer')
            ->waitForText('Échange par email.')
            // Then les changements sont enregistrés
            ->assertSee('Échange par email.');
    });

    $communication->refresh();
    expect($communication->resume)->toBe('Échange par email.');
    expect($communication->type)->toBe('email');
});

test('un utilisateur peut supprimer une communication', function () {
    // Given une communication existante
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create([
        'resume' => 'À supprimer.',
    ]);

    $this->browse(function (Browser $browser) use ($classe, $student) {
        // When il confirme la suppression depuis la boîte de dialogue native
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}?student={$student->id}")
            ->waitForText($student->prenom)
            ->press('Communications')
            ->waitForText('Ajouter une communication')
            ->press('Supprimer')
            ->waitForDialog()
            ->acceptDialog()
            ->waitUntilMissingText('À supprimer.')
            // Then la communication n'apparaît plus sur la fiche
            ->assertDontSee('À supprimer.');
    });

    expect(Communication::find($communication->id))->toBeNull();
});
