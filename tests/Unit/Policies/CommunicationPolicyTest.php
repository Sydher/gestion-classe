<?php

use App\Models\Classe;
use App\Models\Communication;
use App\Models\Student;
use App\Models\User;
use App\Policies\CommunicationPolicy;

test('create allows the owner of the student classe', function () {
    // Given a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new CommunicationPolicy;

    // When the owner checks create for that student
    $result = $policy->create($owner, $student);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('create denies a user who does not own the student classe', function () {
    // Given a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $policy = new CommunicationPolicy;

    // When the stranger checks create for that student
    $result = $policy->create($stranger, $student);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('update allows the owner of the communication student classe', function () {
    // Given a communication on a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();
    $policy = new CommunicationPolicy;

    // When the owner checks update
    $result = $policy->update($owner, $communication);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('update denies a user who does not own the communication student classe', function () {
    // Given a communication on a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();
    $policy = new CommunicationPolicy;

    // When the stranger checks update
    $result = $policy->update($stranger, $communication);

    // Then it is denied
    expect($result)->toBeFalse();
});

test('delete allows the owner of the communication student classe', function () {
    // Given a communication on a student belonging to a classe owned by a user
    $owner = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();
    $policy = new CommunicationPolicy;

    // When the owner checks delete
    $result = $policy->delete($owner, $communication);

    // Then it is allowed
    expect($result)->toBeTrue();
});

test('delete denies a user who does not own the communication student classe', function () {
    // Given a communication on a student belonging to a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();
    $policy = new CommunicationPolicy;

    // When the stranger checks delete
    $result = $policy->delete($stranger, $communication);

    // Then it is denied
    expect($result)->toBeFalse();
});
