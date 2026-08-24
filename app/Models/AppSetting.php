<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $fillable = [
        'registration_enabled',
    ];

    protected $casts = [
        'registration_enabled' => 'boolean',
    ];

    /**
     * Whether new users are currently allowed to self-register.
     *
     * Toggled manually in DB (app_settings.registration_enabled), no admin UI/API for it by design.
     * Self-heals (defaulting to enabled) if the singleton row is ever missing, e.g. truncated tables in tests.
     */
    public static function registrationEnabled(): bool
    {
        return (bool) static::query()
            ->firstOrCreate([], ['registration_enabled' => true])
            ->registration_enabled;
    }
}
