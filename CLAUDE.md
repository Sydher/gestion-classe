# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Gestion Classe — a French-language web app for a teacher to manage classes: customizable classes (name, colors, logo), students, dated observations, and family communication logs. Every teacher (`User`) only ever sees their own classes and students.

Stack: Laravel 12 (PHP 8.2+) + Inertia.js + React/TypeScript, Tailwind CSS, SQLite, Laravel Breeze for auth, Pest for testing.

## Commands

```bash
# Install
composer install
npm install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate
php artisan storage:link   # needed for class logo uploads to display

# Run dev (Laravel server + queue + logs + Vite, all in one)
composer run dev

# Frontend only
npm run dev
npm run build          # runs `tsc` type-check, then vite build

# Tests (Pest, config clears cache first)
composer run test
php artisan test
php artisan test --filter=ClasseTest      # single test file/name
php artisan test tests/Feature/ProfileTest.php

# PHP code style (Laravel Pint, no custom config — defaults)
vendor/bin/pint
vendor/bin/pint --test   # check only, no changes
```

## Architecture

**Domain model / ownership chain**: `User` → `Classe` (table `classes`) → `Student` → `Observation` / `Communication`. A `Classe` belongs to a `User`; a `Student` belongs to a `Classe` (FK `class_id`, not `classe_id`); `Observation` and `Communication` belong to a `Student`. There is no direct `user_id` on `Student`/`Observation`/`Communication` — ownership is always checked by walking up this chain (see Policies).

**Authorization**: every model except `Observation`/`Communication` creation is gated through a Policy in `app/Policies` that compares `$user->id` against the owning chain (e.g. `StudentPolicy::update` checks `$student->classe->user_id`; `ObservationPolicy`/`CommunicationPolicy` check `$observation->student->classe->user_id`). Controllers call `$this->authorize(...)` explicitly rather than relying on route model binding + `authorizeResource`. When adding new mutating endpoints, follow the same explicit-authorize pattern and walk the same chain rather than adding new `user_id` columns.

**Validation**: all input validation lives in `app/Http/Requests/{Store,Update}*Request.php` (Form Requests), one pair per resource. Controllers stay thin — they just call `$request->validated()`.

**Controllers are resourceful but hand-wired**: `routes/web.php` uses `Route::resource('classes', ...)` but manually declares routes for `students`, `observations`, and `communications` (nested under classes/students) rather than nested resource routing, because Observation/Communication only need `store`/`update`/`destroy` (no dedicated index/show pages — they're managed inline on the Student show page).

**Class theming**: each `Classe` has `couleur_primaire`/`couleur_secondaire` (+ optional `logo_path`, exposed as computed `logo_url` via an `Attribute` accessor in `Classe`). `resources/js/Components/ClasseTheme.tsx` injects these as CSS custom properties (`--color-primary`, `--color-secondary`) on a wrapping `div` so any descendant can use `var(--color-primary)` in Tailwind arbitrary values without prop drilling. Wrap any page that renders class-scoped UI in `<ClasseTheme classe={classe}>`.

**Frontend structure** (`resources/js/`): standard Breeze/Inertia layout — `Pages/<Resource>/{Index,Create,Edit,Show}.tsx`, shared field groups in `Pages/<Resource>/Partials/`, reusable inputs/buttons in `Components/`, `Layouts/AuthenticatedLayout.tsx` wraps authenticated pages. Shared TS types mirroring the Eloquent models live in `resources/js/types/index.ts` (keep in sync when changing model fields/casts — e.g. `Communication::TYPES` in the model must match `COMMUNICATION_TYPES` in `types/index.ts`). `PageProps<T>` is the generic wrapper for Inertia page props, always carrying `auth.user`.

**Migrations**: student/observation/communication/class tables were added on top of the Breeze/Jetstream default (users/cache/jobs) starter migrations — check existing migration files for column names/casts before assuming a field exists (e.g. `Student.class_id` not `classe_id`; `gaucher` is a boolean; dates use `date`, not `datetime`, casts).
