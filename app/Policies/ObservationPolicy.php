<?php

namespace App\Policies;

use App\Models\Observation;
use App\Models\Student;
use App\Models\User;

class ObservationPolicy
{
    public function create(User $user, Student $student): bool
    {
        return $user->id === $student->classe->user_id;
    }

    public function update(User $user, Observation $observation): bool
    {
        return $user->id === $observation->student->classe->user_id;
    }

    public function delete(User $user, Observation $observation): bool
    {
        return $user->id === $observation->student->classe->user_id;
    }
}
