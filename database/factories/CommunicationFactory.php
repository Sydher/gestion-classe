<?php

namespace Database\Factories;

use App\Models\Communication;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Communication>
 */
class CommunicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'date' => fake()->date(),
            'type' => fake()->randomElement(Communication::TYPES),
            'resume' => fake()->sentence(),
        ];
    }
}
