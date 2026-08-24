<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Classe>
 */
class ClasseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nom' => fake()->words(2, true),
            'couleur_primaire' => '#1D4ED8',
            'couleur_secondaire' => '#93C5FD',
            'couleur_tertiaire' => '#F5F5F4',
            'couleur_texte' => '#292524',
            'logo_path' => null,
        ];
    }
}
