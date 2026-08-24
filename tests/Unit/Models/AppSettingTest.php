<?php

use App\Models\AppSetting;

test('registrationEnabled returns true when the DB flag is enabled', function () {
    // Given the seeded app_settings row has registration enabled (migration default)

    // When reading the flag
    $enabled = AppSetting::registrationEnabled();

    // Then it is true
    expect($enabled)->toBeTrue();
});

test('registrationEnabled returns false when the DB flag is disabled', function () {
    // Given the app_settings row is manually toggled off
    AppSetting::query()->update(['registration_enabled' => false]);

    // When reading the flag
    $enabled = AppSetting::registrationEnabled();

    // Then it is false
    expect($enabled)->toBeFalse();
});
