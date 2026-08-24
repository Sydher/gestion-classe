<?php

use App\Models\Observation;
use App\Models\Student;
use Illuminate\Support\Carbon;

test('gaucher and probleme_vision are cast to booleans', function () {
    // Given a student stored with truthy integer flags
    $student = Student::factory()->create([
        'gaucher' => 1,
        'probleme_vision' => 0,
    ]);

    // When re-reading the persisted model
    $student->refresh();

    // Then the flags are cast to real booleans
    expect($student->gaucher)->toBeTrue();
    expect($student->probleme_vision)->toBeFalse();
});

test('date_naissance is cast to a date instance', function () {
    // Given a student with a birth date
    $student = Student::factory()->create(['date_naissance' => '2015-04-12']);

    // When re-reading the persisted model
    $student->refresh();

    // Then date_naissance is a Carbon date matching that value
    expect($student->date_naissance)->toBeInstanceOf(Carbon::class);
    expect($student->date_naissance->toDateString())->toBe('2015-04-12');
});

test('observations are ordered by date then created_at, most recent first', function () {
    // Given a student with observations on different dates
    $student = Student::factory()->create();
    $older = Observation::factory()->for($student)->create(['date' => '2026-01-01']);
    $newer = Observation::factory()->for($student)->create(['date' => '2026-06-01']);

    // When accessing the observations relation
    $ids = $student->observations()->pluck('id');

    // Then the most recent observation comes first
    expect($ids->first())->toBe($newer->id);
    expect($ids->last())->toBe($older->id);
});

test('a student belongs to a classe', function () {
    // Given a student attached to a classe
    $student = Student::factory()->create();

    // When accessing the classe relation
    $classe = $student->classe;

    // Then it resolves to the owning classe
    expect($classe)->not->toBeNull();
    expect($classe->id)->toBe($student->class_id);
});
