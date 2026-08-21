<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'gaucher',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'gaucher' => 'boolean',
        ];
    }

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class)->latest('date');
    }

    public function communications(): HasMany
    {
        return $this->hasMany(Communication::class)->latest('date');
    }
}
