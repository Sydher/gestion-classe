<?php

use App\Models\Classe;
use App\Models\Student;
use Laravel\Dusk\Browser;

test('un utilisateur peut ajouter un élève à sa classe', function () {
    // Given une classe existante
    $classe = Classe::factory()->create();

    $this->browse(function (Browser $browser) use ($classe) {
        // When il remplit et soumet le formulaire d'ajout d'élève
        $browser->loginAs($classe->user)
            ->visit("/classes/{$classe->id}/students/create")
            ->waitFor('#prenom')
            ->type('#prenom', 'Léa')
            ->type('#nom', 'Martin')
            ->type('#date_naissance', '2016-05-12')
            ->press("Ajouter l'élève")
            ->waitForText('Léa Martin')
            // Then l'élève apparaît sur la fiche de la classe
            ->assertSee('Léa Martin');
    });

    expect(Student::where('class_id', $classe->id)
        ->where('prenom', 'Léa')
        ->where('nom', 'Martin')
        ->exists())->toBeTrue();
});

test('un utilisateur peut modifier un élève', function () {
    // Given un élève existant
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create([
        'prenom' => 'Léa',
        'nom' => 'Martin',
    ]);

    $this->browse(function (Browser $browser) use ($student) {
        // When il modifie le prénom de l'élève
        $browser->loginAs($student->classe->user)
            ->visit("/students/{$student->id}/edit")
            ->waitFor('#prenom')
            ->clear('#prenom')
            ->type('#prenom', 'Léna')
            ->press('Enregistrer')
            ->waitForText('Léna Martin')
            // Then les changements sont enregistrés
            ->assertSee('Léna Martin');
    });

    expect($student->fresh()->prenom)->toBe('Léna');
});

test('un utilisateur peut supprimer un élève', function () {
    // Given un élève existant
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create([
        'prenom' => 'Léa',
        'nom' => 'Martin',
    ]);

    $this->browse(function (Browser $browser) use ($student) {
        // When il confirme la suppression depuis la boîte de dialogue native
        $browser->loginAs($student->classe->user)
            ->visit("/students/{$student->id}/edit")
            ->waitFor('#prenom')
            // DangerButton renders its label uppercase via CSS, which Dusk's button-text match respects
            ->press('SUPPRIMER')
            ->waitForDialog()
            ->acceptDialog()
            ->waitUntilMissingText('Léa Martin')
            // Then l'élève n'apparaît plus dans la classe
            ->assertDontSee('Léa Martin');
    });

    expect(Student::find($student->id))->toBeNull();
});
