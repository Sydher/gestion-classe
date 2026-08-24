<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'class_id' => Classe::factory(),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'date_naissance' => fake()->date(),
            'gaucher' => false,
            'probleme_vision' => false,
            'besoins_particuliers' => null,
        ];
    }
}
