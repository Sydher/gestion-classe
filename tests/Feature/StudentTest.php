<?php

use App\Models\Classe;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;

function validStudentPayload(array $overrides = []): array
{
    return array_merge([
        'nom' => 'Dupont',
        'prenom' => 'Alice',
        'date_naissance' => '2016-05-10',
        'gaucher' => false,
        'probleme_vision' => false,
        'besoins_particuliers' => null,
    ], $overrides);
}

test('create is allowed for the owner of the classe', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();

    // When the owner visits the create student page
    $response = $this->actingAs($user)->get(route('students.create', $classe));

    // Then access is granted
    $response->assertOk();
});

test('create is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();

    // When the stranger visits the create student page
    $response = $this->actingAs($stranger)->get(route('students.create', $classe));

    // Then access is forbidden
    $response->assertForbidden();
});

test('store creates a student in the classe', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();

    // When the owner submits a valid student payload
    $response = $this->actingAs($user)->post(route('students.store', $classe), validStudentPayload());

    // Then the student is persisted under that classe
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('students', [
        'class_id' => $classe->id,
        'nom' => 'Dupont',
        'prenom' => 'Alice',
    ]);
});

test('store is forbidden for a user who does not own the classe', function () {
    // Given a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();

    // When the stranger submits a student payload
    $response = $this->actingAs($stranger)->post(route('students.store', $classe), validStudentPayload());

    // Then access is forbidden and no student is created
    $response->assertForbidden();
    $this->assertDatabaseMissing('students', ['nom' => 'Dupont', 'class_id' => $classe->id]);
});

test('store validation rejects a birth date that is not in the past', function () {
    // Given a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();

    // When submitting a birth date in the future
    $response = $this->actingAs($user)->post(
        route('students.store', $classe),
        validStudentPayload(['date_naissance' => now()->addDay()->toDateString()])
    );

    // Then a validation error is raised on date_naissance
    $response->assertSessionHasErrors('date_naissance');
});

test('store validation rejects a separation id from another classe', function () {
    // Given a classe with a foreign student not in the same class
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $foreignStudent = Student::factory()->create();

    // When submitting a separation referencing that foreign student
    $response = $this->actingAs($user)->post(
        route('students.store', $classe),
        validStudentPayload(['separations' => [$foreignStudent->id]])
    );

    // Then a validation error is raised on the separations entry
    $response->assertSessionHasErrors('separations.0');
});

test('store creates bidirectional separation rows for classmates', function () {
    // Given two existing classmates in the same classe
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $classmateA = Student::factory()->for($classe, 'classe')->create();
    $classmateB = Student::factory()->for($classe, 'classe')->create();

    // When creating a new student separated from both classmates
    $response = $this->actingAs($user)->post(
        route('students.store', $classe),
        validStudentPayload(['separations' => [$classmateA->id, $classmateB->id]])
    );
    $response->assertSessionHasNoErrors();
    $newStudent = Student::where('nom', 'Dupont')->firstOrFail();

    // Then a separation row exists in both directions for each classmate
    expect(DB::table('student_separations')
        ->where('student_id', $newStudent->id)->where('separated_student_id', $classmateA->id)->exists())->toBeTrue();
    expect(DB::table('student_separations')
        ->where('student_id', $classmateA->id)->where('separated_student_id', $newStudent->id)->exists())->toBeTrue();
    expect(DB::table('student_separations')
        ->where('student_id', $newStudent->id)->where('separated_student_id', $classmateB->id)->exists())->toBeTrue();
});

test('show redirects to the classe page for the owner', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the owner visits the student show route
    $response = $this->actingAs($user)->get(route('students.show', $student));

    // Then it redirects to the classe show page with the student selected
    $response->assertRedirect(route('classes.show', ['classe' => $classe->id, 'student' => $student->id]));
});

test('show is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the stranger visits the student show route
    $response = $this->actingAs($stranger)->get(route('students.show', $student));

    // Then access is forbidden
    $response->assertForbidden();
});

test('edit is allowed for the owner of the student classe', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the owner visits the edit page
    $response = $this->actingAs($user)->get(route('students.edit', $student));

    // Then access is granted
    $response->assertOk();
});

test('edit is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the stranger visits the edit page
    $response = $this->actingAs($stranger)->get(route('students.edit', $student));

    // Then access is forbidden
    $response->assertForbidden();
});

test('update is allowed for the owner and persists changes', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create(['nom' => 'Old']);

    // When the owner submits an update
    $response = $this->actingAs($user)->put(route('students.update', $student), validStudentPayload(['nom' => 'New']));

    // Then the student is updated
    $response->assertSessionHasNoErrors();
    expect($student->refresh()->nom)->toBe('New');
});

test('update is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create(['nom' => 'Old']);

    // When the stranger submits an update
    $response = $this->actingAs($stranger)->put(route('students.update', $student), validStudentPayload(['nom' => 'New']));

    // Then access is forbidden and the student is unchanged
    $response->assertForbidden();
    expect($student->refresh()->nom)->toBe('Old');
});

test('update validation rejects a separation referencing the student itself', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When submitting an update with the student separated from itself
    $response = $this->actingAs($user)->put(
        route('students.update', $student),
        validStudentPayload(['separations' => [$student->id]])
    );

    // Then a validation error is raised on the separations entry
    $response->assertSessionHasErrors('separations.0');
});

test('update replaces existing separations with the new set', function () {
    // Given a student already separated from one classmate
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $oldClassmate = Student::factory()->for($classe, 'classe')->create();
    $newClassmate = Student::factory()->for($classe, 'classe')->create();
    DB::table('student_separations')->insert([
        ['student_id' => $student->id, 'separated_student_id' => $oldClassmate->id, 'created_at' => now(), 'updated_at' => now()],
        ['student_id' => $oldClassmate->id, 'separated_student_id' => $student->id, 'created_at' => now(), 'updated_at' => now()],
    ]);

    // When updating with a different separation set
    $response = $this->actingAs($user)->put(
        route('students.update', $student),
        validStudentPayload(['separations' => [$newClassmate->id]])
    );
    $response->assertSessionHasNoErrors();

    // Then the old separation is gone and the new one exists in both directions
    expect(DB::table('student_separations')
        ->where('student_id', $student->id)->where('separated_student_id', $oldClassmate->id)->exists())->toBeFalse();
    expect(DB::table('student_separations')
        ->where('student_id', $student->id)->where('separated_student_id', $newClassmate->id)->exists())->toBeTrue();
    expect(DB::table('student_separations')
        ->where('student_id', $newClassmate->id)->where('separated_student_id', $student->id)->exists())->toBeTrue();
});

test('update with an empty separations list clears all separations', function () {
    // Given a student already separated from a classmate
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();
    $classmate = Student::factory()->for($classe, 'classe')->create();
    DB::table('student_separations')->insert([
        ['student_id' => $student->id, 'separated_student_id' => $classmate->id, 'created_at' => now(), 'updated_at' => now()],
        ['student_id' => $classmate->id, 'separated_student_id' => $student->id, 'created_at' => now(), 'updated_at' => now()],
    ]);

    // When updating with no separations at all
    $response = $this->actingAs($user)->put(
        route('students.update', $student),
        validStudentPayload(['separations' => []])
    );
    $response->assertSessionHasNoErrors();

    // Then no separation rows remain for that student
    expect(DB::table('student_separations')->where('student_id', $student->id)
        ->orWhere('separated_student_id', $student->id)->exists())->toBeFalse();
});

test('destroy is allowed for the owner of the student classe', function () {
    // Given a student in a classe owned by the current user
    $user = User::factory()->create();
    $classe = Classe::factory()->for($user)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the owner deletes the student
    $response = $this->actingAs($user)->delete(route('students.destroy', $student));

    // Then the student is removed and redirected to the classe page
    $response->assertRedirect(route('classes.show', $classe));
    $this->assertDatabaseMissing('students', ['id' => $student->id]);
});

test('destroy is forbidden for a user who does not own the student classe', function () {
    // Given a student in a classe owned by another user
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $classe = Classe::factory()->for($owner)->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When the stranger attempts to delete the student
    $response = $this->actingAs($stranger)->delete(route('students.destroy', $student));

    // Then access is forbidden and the student still exists
    $response->assertForbidden();
    $this->assertDatabaseHas('students', ['id' => $student->id]);
});
