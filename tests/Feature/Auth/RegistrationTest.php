<?php

use App\Models\AppSetting;
use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration screen returns 404 when registration is disabled', function () {
    // Given registration has been manually disabled in DB
    AppSetting::query()->update(['registration_enabled' => false]);

    // When visiting the registration screen
    $response = $this->get('/register');

    // Then it is not found
    $response->assertStatus(404);
});

test('registering is blocked when registration is disabled', function () {
    // Given registration has been manually disabled in DB
    AppSetting::query()->update(['registration_enabled' => false]);

    // When attempting to register
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // Then it is not found, no user is created, and no one is authenticated
    $response->assertStatus(404);
    $this->assertGuest();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});
