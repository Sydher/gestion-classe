<?php

use App\Models\Classe;
use App\Models\User;
use App\Policies\ClassePolicy;

test('viewAny always allows any authenticated user', function () {
    // Given any authenticated user
    $user = User::factory()->create();
    $policy = new ClassePolicy;

    // When checking viewAny
    $result = $policy->viewAny($user);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('create always allows any authenticated user', function () {
    // Given any authenticated user
    $user = User::factory()->create();
    $policy = new ClassePolicy;

    // When checking create
    $result = $policy->create($user);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('view allows the owner of the classe', function () {
    // Given a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the owner checks view
    $result = $policy->view($owner, $classe);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('view denies a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the stranger checks view
    $result = $policy->view($stranger, $classe);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('update allows the owner of the classe', function () {
    // Given a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the owner checks update
    $result = $policy->update($owner, $classe);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('update denies a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the stranger checks update
    $result = $policy->update($stranger, $classe);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('delete allows the owner of the classe', function () {
    // Given a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the owner checks delete
    $result = $policy->delete($owner, $classe);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('delete denies a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new ClassePolicy;

    // When the stranger checks delete
    $result = $policy->delete($stranger, $classe);

    // Then it is denied
    expect($result)->toBeFalse();
});
