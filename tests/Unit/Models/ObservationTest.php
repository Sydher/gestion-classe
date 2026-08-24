<?php

use App\Models\Observation;
use Illuminate\Support\Carbon;

test('date is cast to a date instance', function () {
    // Given an observation with a date
    $observation = Observation::factory()->create(['date' => '2026-03-10']);

    // When re-reading the persisted model
    $observation->refresh();

    // Then date is a Carbon date matching that value
    expect($observation->date)->toBeInstanceOf(Carbon::class);
    expect($observation->date->toDateString())->toBe('2026-03-10');
});

test('an observation belongs to a student', function () {
    // Given an observation attached to a student
    $observation = Observation::factory()->create();

    // When accessing the student relation
    $student = $observation->student;

    // Then it resolves to the owning student
    expect($student)->not->toBeNull();
    expect($student->id)->toBe($observation->student_id);
});
