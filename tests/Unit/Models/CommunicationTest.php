<?php

use App\Models\Communication;
use Illuminate\Support\Carbon;

test('date is cast to a date instance', function () {
    // Given a communication with a date
    $communication = Communication::factory()->create(['date' => '2026-03-10']);

    // When re-reading the persisted model
    $communication->refresh();

    // Then date is a Carbon date matching that value
    expect($communication->date)->toBeInstanceOf(Carbon::class);
    expect($communication->date->toDateString())->toBe('2026-03-10');
});

test('a communication belongs to a student', function () {
    // Given a communication attached to a student
    $communication = Communication::factory()->create();

    // When accessing the student relation
    $student = $communication->student;

    // Then it resolves to the owning student
    expect($student)->not->toBeNull();
    expect($student->id)->toBe($communication->student_id);
});

test('TYPES constant lists every allowed communication type', function () {
    // Given the Communication model's TYPES constant
    // When reading it
    // Then it exposes exactly the five known types
    expect(Communication::TYPES)->toBe(['telephone', 'email', 'rencontre', 'carnet', 'autre']);
});
