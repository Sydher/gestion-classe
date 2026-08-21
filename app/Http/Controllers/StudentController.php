<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Classe;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function create(Classe $classe): Response
    {
        $this->authorize('create', [Student::class, $classe]);

        return Inertia::render('Students/Create', [
            'classe' => $classe,
        ]);
    }

    public function store(StoreStudentRequest $request, Classe $classe): RedirectResponse
    {
        $student = $classe->students()->create($request->validated());

        return to_route('students.show', $student);
    }

    public function show(Student $student): Response
    {
        $this->authorize('view', $student);

        return Inertia::render('Students/Show', [
            'student' => $student->load(['classe', 'observations', 'communications']),
        ]);
    }

    public function edit(Student $student): Response
    {
        $this->authorize('update', $student);

        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $student->update($request->validated());

        return to_route('students.show', $student);
    }

    public function destroy(Student $student): RedirectResponse
    {
        $this->authorize('delete', $student);

        $classe = $student->classe;
        $student->delete();

        return to_route('classes.show', $classe);
    }
}
