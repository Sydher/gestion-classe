<?php

use App\Models\Classe;
use App\Models\Student;
use App\Models\User;
use App\Policies\StudentPolicy;

test('view allows the owner of the student classe', function () {
    // Given a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the owner checks view
    $result = $policy->view($owner, $student);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('view denies a user who does not own the student classe', function () {
    // Given a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the stranger checks view
    $result = $policy->view($stranger, $student);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('create allows the owner of the classe', function () {
    // Given a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new StudentPolicy;

    // When the owner checks create for that classe
    $result = $policy->create($owner, $classe);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('create denies a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $policy = new StudentPolicy;

    // When the stranger checks create for that classe
    $result = $policy->create($stranger, $classe);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('update allows the owner of the student classe', function () {
    // Given a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the owner checks update
    $result = $policy->update($owner, $student);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('update denies a user who does not own the student classe', function () {
    // Given a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the stranger checks update
    $result = $policy->update($stranger, $student);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('delete allows the owner of the student classe', function () {
    // Given a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the owner checks delete
    $result = $policy->delete($owner, $student);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('delete denies a user who does not own the student classe', function () {
    // Given a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new StudentPolicy;

    // When the stranger checks delete
    $result = $policy->delete($stranger, $student);

    // Then it is denied
    expect($result)->toBeFalse();
});
