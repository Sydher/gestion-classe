<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreObservationRequest;
use App\Http\Requests\UpdateObservationRequest;
use App\Models\Observation;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;

class ObservationController extends Controller
{
    public function store(StoreObservationRequest $request, Student $student): RedirectResponse
    {
        $student->observations()->create($request->validated());

        return back();
    }

    public function update(UpdateObservationRequest $request, Observation $observation): RedirectResponse
    {
        $observation->update($request->validated());

        return back();
    }

    public function destroy(Observation $observation): RedirectResponse
    {
        $this->authorize('delete', $observation);

        $observation->delete();

        return back();
    }
}
