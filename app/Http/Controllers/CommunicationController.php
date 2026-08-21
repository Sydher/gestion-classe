<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunicationRequest;
use App\Http\Requests\UpdateCommunicationRequest;
use App\Models\Communication;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;

class CommunicationController extends Controller
{
    public function store(StoreCommunicationRequest $request, Student $student): RedirectResponse
    {
        $student->communications()->create($request->validated());

        return back();
    }

    public function update(UpdateCommunicationRequest $request, Communication $communication): RedirectResponse
    {
        $communication->update($request->validated());

        return back();
    }

    public function destroy(Communication $communication): RedirectResponse
    {
        $this->authorize('delete', $communication);

        $communication->delete();

        return back();
    }
}
