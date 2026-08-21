<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClasseRequest;
use App\Http\Requests\UpdateClasseRequest;
use App\Models\Classe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClasseController extends Controller
{
    public function index(): Response
    {
        $classes = auth()->user()->classes()->latest()->get();

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Classes/Create');
    }

    public function store(StoreClasseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        }
        unset($data['logo']);

        $classe = auth()->user()->classes()->create($data);

        return to_route('classes.show', $classe);
    }

    public function show(Classe $classe, Request $request): Response
    {
        $this->authorize('view', $classe);

        $selectedStudent = null;
        if ($request->filled('student')) {
            $selectedStudent = $classe->students()
                ->with(['observations', 'communications'])
                ->find($request->integer('student'));
        }

        return Inertia::render('Classes/Show', [
            'classe' => $classe,
            'students' => $classe->students()->orderBy('nom')->get(),
            'selectedStudent' => $selectedStudent,
        ]);
    }

    public function edit(Classe $classe): Response
    {
        $this->authorize('update', $classe);

        return Inertia::render('Classes/Edit', [
            'classe' => $classe,
        ]);
    }

    public function update(UpdateClasseRequest $request, Classe $classe): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($classe->logo_path) {
                Storage::disk('public')->delete($classe->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        }
        unset($data['logo']);

        $classe->update($data);

        return to_route('classes.show', $classe);
    }

    public function destroy(Classe $classe): RedirectResponse
    {
        $this->authorize('delete', $classe);

        if ($classe->logo_path) {
            Storage::disk('public')->delete($classe->logo_path);
        }

        $classe->delete();

        return to_route('classes.index');
    }
}
