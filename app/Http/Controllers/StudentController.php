<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Classe;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function create(Classe $classe): Response
    {
        $this->authorize('create', [Student::class, $classe]);

        return Inertia::render('Students/Create', [
            'classe' => $classe,
            'classmates' => $classe->students()->orderBy('nom')->get(),
        ]);
    }

    public function store(StoreStudentRequest $request, Classe $classe): RedirectResponse
    {
        $data = $request->validated();
        $separations = $data['separations'] ?? [];
        unset($data['separations']);

        $student = $classe->students()->create($data);

        $this->syncSeparations($student, $separations);

        return to_route('classes.show', ['classe' => $classe->id, 'student' => $student->id]);
    }

    public function show(Student $student): RedirectResponse
    {
        $this->authorize('view', $student);

        return to_route('classes.show', ['classe' => $student->class_id, 'student' => $student->id]);
    }

    public function edit(Student $student): Response
    {
        $this->authorize('update', $student);

        return Inertia::render('Students/Edit', [
            'student' => $student->load(['classe', 'separations']),
            'classmates' => $student->classe->students()
                ->where('id', '!=', $student->id)
                ->orderBy('nom')
                ->get(),
        ]);
    }

    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $data = $request->validated();
        $separations = $data['separations'] ?? [];
        unset($data['separations']);

        $student->update($data);

        $this->syncSeparations($student, $separations);

        return to_route('classes.show', ['classe' => $student->class_id, 'student' => $student->id]);
    }

    public function destroy(Student $student): RedirectResponse
    {
        $this->authorize('delete', $student);

        $classe = $student->classe;
        $student->delete();

        return to_route('classes.show', $classe);
    }

    /**
     * @param  array<int, int|string>  $separatedStudentIds
     */
    private function syncSeparations(Student $student, array $separatedStudentIds): void
    {
        $ids = collect($separatedStudentIds)
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->reject(fn ($id) => $id === $student->id)
            ->values();

        DB::table('student_separations')
            ->where('student_id', $student->id)
            ->orWhere('separated_student_id', $student->id)
            ->delete();

        $now = now();
        $rows = $ids->flatMap(fn ($id) => [
            ['student_id' => $student->id, 'separated_student_id' => $id, 'created_at' => $now, 'updated_at' => $now],
            ['student_id' => $id, 'separated_student_id' => $student->id, 'created_at' => $now, 'updated_at' => $now],
        ])->all();

        if ($rows !== []) {
            DB::table('student_separations')->insert($rows);
        }
    }
}
