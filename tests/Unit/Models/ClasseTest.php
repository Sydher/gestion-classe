<?php

use App\Models\Classe;
use App\Models\Student;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('logo_url is null when the classe has no logo_path', function () {
    // Given a classe without a logo
    $classe = Classe::factory()->create(['logo_path' => null]);

    // When reading the logo_url accessor
    $url = $classe->logo_url;

    // Then it is null
    expect($url)->toBeNull();
});

test('logo_url resolves the public disk url when the classe has a logo_path', function () {
    // Given a classe with a stored logo
    Storage::fake('public');
    $path = UploadedFile::fake()->image('logo.png')->store('logos', 'public');
    $classe = Classe::factory()->create(['logo_path' => $path]);

    // When reading the logo_url accessor
    $url = $classe->logo_url;

    // Then it matches the public disk's url for that path
    expect($url)->toBe(Storage::disk('public')->url($path));
});

test('a classe belongs to its user', function () {
    // Given a classe created for a user
    $classe = Classe::factory()->create();

    // When accessing the user relation
    $user = $classe->user;

    // Then it resolves to the owning user
    expect($user)->not->toBeNull();
    expect($user->id)->toBe($classe->user_id);
});

test('a classe has many students', function () {
    // Given a classe with students attached
    $classe = Classe::factory()->create();
    $student = Student::factory()->for($classe, 'classe')->create();

    // When accessing the students relation
    $students = $classe->students;

    // Then it includes the attached student
    expect($students->pluck('id'))->toContain($student->id);
});
