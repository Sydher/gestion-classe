<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [Student::class, $this->route('classe')]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'date_naissance' => ['required', 'date', 'before:today'],
            'gaucher' => ['boolean'],
            'probleme_vision' => ['boolean'],
            'besoins_particuliers' => ['nullable', 'string'],
            'separations' => ['array'],
            'separations.*' => [
                'integer',
                Rule::exists('students', 'id')->where('class_id', $this->route('classe')->id),
            ],
        ];
    }
}
