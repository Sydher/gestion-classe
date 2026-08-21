<?php

namespace App\Http\Requests;

use App\Models\Classe;
use Illuminate\Foundation\Http\FormRequest;

class StoreClasseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Classe::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'couleur_primaire' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'couleur_secondaire' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'couleur_tertiaire' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'couleur_texte' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
