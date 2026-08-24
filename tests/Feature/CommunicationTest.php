<?php

use App\Models\Classe;
use App\Models\Communication;
use App\Models\Student;
use App\Models\User;

test('store creates a communication for the owner of the student classe', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the owner submits a valid communication
    $response = $this->actingAs($user)->post(route('communications.store', $student), [
        'date' => '2026-02-01',
        'type' => 'telephone',
        'resume' => 'Appel avec la famille.',
    ]);

    // Then the communication is persisted for the student
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('communications', [
        'student_id' => $student->id,
        'type' => 'telephone',
        'resume' => 'Appel avec la famille.',
    ]);
});

test('store is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the stranger attempts to add a communication
    $response = $this->actingAs($stranger)->post(route('communications.store', $student), [
        'date' => '2026-02-01',
        'type' => 'telephone',
        'resume' => 'Appel avec la famille.',
    ]);

    // Then access is forbidden and no communication is created
    $response->assertForbidden();
    $this->assertDatabaseMissing('communications', ['student_id' => $student->id]);
});

test('store validation rejects a type outside the allowed list', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When submitting a communication with an invalid type
    $response = $this->actingAs($user)->post(route('communications.store', $student), [
        'date' => '2026-02-01',
        'type' => 'fax',
        'resume' => 'Appel avec la famille.',
    ]);

    // Then a validation error is raised on the type field
    $response->assertSessionHasErrors('type');
});

test('store validation requires a date and a resume', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When submitting the form without date or resume
    $response = $this->actingAs($user)->post(route('communications.store', $student), [
        'date' => '',
        'type' => 'telephone',
        'resume' => '',
    ]);

    // Then validation errors are raised for both fields
    $response->assertSessionHasErrors(['date', 'resume']);
});

test('update is allowed for the owner and persists changes', function () {
    // Given a communication on a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create(['resume' => 'Old']);

    // When the owner updates the communication
    $response = $this->actingAs($user)->put(route('communications.update', $communication), [
        'date' => '2026-03-01',
        'type' => 'email',
        'resume' => 'New',
    ]);

    // Then the communication is updated
    $response->assertSessionHasNoErrors();
    expect($communication->refresh()->resume)->toBe('New');
});

test('update is forbidden for a user who does not own the communication student classe', function () {
    // Given a communication on a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create(['resume' => 'Old']);

    // When the stranger attempts to update the communication
    $response = $this->actingAs($stranger)->put(route('communications.update', $communication), [
        'date' => '2026-03-01',
        'type' => 'email',
        'resume' => 'New',
    ]);

    // Then access is forbidden and the communication is unchanged
    $response->assertForbidden();
    expect($communication->refresh()->resume)->toBe('Old');
});

test('destroy is allowed for the owner of the communication student classe', function () {
    // Given a communication on a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();

    // When the owner deletes the communication
    $response = $this->actingAs($user)->delete(route('communications.destroy', $communication));

    // Then the communication is removed
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('communications', ['id' => $communication->id]);
});

test('destroy is forbidden for a user who does not own the communication student classe', function () {
    // Given a communication on a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $communication = Communication::factory()->for($student)->create();

    // When the stranger attempts to delete the communication
    $response = $this->actingAs($stranger)->delete(route('communications.destroy', $communication));

    // Then access is forbidden and the communication still exists
    $response->assertForbidden();
    $this->assertDatabaseHas('communications', ['id' => $communication->id]);
});
