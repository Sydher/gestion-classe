<?php

use App\Http\Controllers\ClasseController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? to_route('classes.index') : to_route('login');
});

Route::get('/dashboard', function () {
    return to_route('classes.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('classes', ClasseController::class)
        ->parameters(['classes' => 'classe']);

    Route::get('classes/{classe}/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('classes/{classe}/students', [StudentController::class, 'store'])->name('students.store');
    Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::get('students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    Route::post('students/{student}/observations', [ObservationController::class, 'store'])->name('observations.store');
    Route::put('observations/{observation}', [ObservationController::class, 'update'])->name('observations.update');
    Route::delete('observations/{observation}', [ObservationController::class, 'destroy'])->name('observations.destroy');

    Route::post('students/{student}/communications', [CommunicationController::class, 'store'])->name('communications.store');
    Route::put('communications/{communication}', [CommunicationController::class, 'update'])->name('communications.update');
    Route::delete('communications/{communication}', [CommunicationController::class, 'destroy'])->name('communications.destroy');
});

require __DIR__.'/auth.php';
