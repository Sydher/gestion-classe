<?php

namespace Database\Factories;

use App\Models\Observation;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Observation>
 */
class ObservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'date' => fake()->date(),
            'commentaire' => fake()->sentence(),
        ];
    }
}
