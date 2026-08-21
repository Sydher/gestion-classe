<?php

namespace App\Policies;

use App\Models\Communication;
use App\Models\Student;
use App\Models\User;

class CommunicationPolicy
{
    public function create(User $user, Student $student): bool
    {
        return $user->id === $student->classe->user_id;
    }

    public function update(User $user, Communication $communication): bool
    {
        return $user->id === $communication->student->classe->user_id;
    }

    public function delete(User $user, Communication $communication): bool
    {
        return $user->id === $communication->student->classe->user_id;
    }
}
