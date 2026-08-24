<?php

use App\Models\User;
use Laravel\Dusk\Browser;

test('un visiteur peut créer un compte et accéder à ses classes', function () {
    // Given aucun utilisateur existant avec cet email

    // When il s'inscrit depuis le formulaire d'inscription
    $this->browse(function (Browser $browser) {
        $browser->visit('/register')
            ->waitFor('#name')
            ->type('name', 'Alice Dupont')
            ->type('email', 'alice@example.com')
            ->type('password', 'password')
            ->type('password_confirmation', 'password')
            // PrimaryButton renders its label uppercase via CSS, which Dusk's button-text match respects
            ->press('REGISTER')
            ->waitForLocation('/classes')
            // Then il est inscrit, connecté et redirigé vers ses classes
            ->assertPathIs('/classes')
            ->assertSee('Mes classes')
            ->assertAuthenticated();
    });

    expect(User::where('email', 'alice@example.com')->exists())->toBeTrue();
});

test('un visiteur peut accéder à l\'inscription depuis la page de connexion', function () {
    // Given la page de connexion

    // When il clique sur le lien vers l'inscription
    $this->browse(function (Browser $browser) {
        $browser->visit('/login')
            ->waitForText('Créer un compte')
            ->clickLink('Créer un compte')
            ->waitForLocation('/register')
            // Then il est redirigé vers le formulaire d'inscription
            ->assertPathIs('/register');
    });
});

test('un utilisateur peut se connecter avec ses identifiants', function () {
    // Given un utilisateur existant
    $user = User::factory()->create();

    // When il se connecte depuis le formulaire de connexion
    $this->browse(function (Browser $browser) use ($user) {
        $browser->visit('/login')
            ->waitFor('#email')
            ->type('email', $user->email)
            ->type('password', 'password')
            // PrimaryButton renders its label uppercase via CSS, which Dusk's button-text match respects
            ->press('LOG IN')
            ->waitForLocation('/classes')
            // Then il accède à ses classes
            ->assertPathIs('/classes')
            ->assertSee('Mes classes')
            ->assertAuthenticatedAs($user);
    });
});

test('un utilisateur connecté peut se déconnecter', function () {
    // Given un utilisateur connecté sur la page de ses classes
    $user = User::factory()->create();

    $this->browse(function (Browser $browser) use ($user) {
        $browser->loginAs($user)
            ->visit('/classes')
            ->waitForText('Mes classes')
            // When il se déconnecte depuis le menu utilisateur
            ->press($user->name)
            ->waitForText('Déconnexion')
            ->press('Déconnexion')
            ->waitForLocation('/login')
            // Then il est déconnecté et redirigé vers la connexion
            ->assertPathIs('/login')
            ->assertGuest();
    });
});
