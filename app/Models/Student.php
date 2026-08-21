<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'gaucher',
        'probleme_vision',
        'besoins_particuliers',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'gaucher' => 'boolean',
            'probleme_vision' => 'boolean',
        ];
    }

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class)->orderByDesc('date')->orderByDesc('created_at');
    }

    public function communications(): HasMany
    {
        return $this->hasMany(Communication::class)->latest('date');
    }

    public function separations(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_separations', 'student_id', 'separated_student_id')
            ->orderBy('nom');
    }
}
