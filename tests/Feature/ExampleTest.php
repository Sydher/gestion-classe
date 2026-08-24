<?php

use App\Models\User;

it('redirects a guest to the login page', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

it('redirects an authenticated user to the classes index', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect(route('classes.index'));
});
