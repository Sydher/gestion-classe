<?php

namespace App\Http\Requests;

use App\Models\Observation;
use Illuminate\Foundation\Http\FormRequest;

class StoreObservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [Observation::class, $this->route('student')]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'commentaire' => ['required', 'string'],
        ];
    }
}
