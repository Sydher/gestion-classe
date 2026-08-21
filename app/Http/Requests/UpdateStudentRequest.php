<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('student'));
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
                Rule::exists('students', 'id')->where('class_id', $this->route('student')->class_id),
                'not_in:'.$this->route('student')->id,
            ],
        ];
    }
}
