#!/usr/bin/env bash
# Runs the Dusk (E2E) suite against a dedicated database, spinning up a
# temporary `php artisan serve` bound to .env.dusk.local for the duration.
set -uo pipefail

cd "$(dirname "$0")/.."

touch database/testing.sqlite
cp .env .env.backup.local
cp .env.dusk.local .env

php artisan serve --port=8000 > storage/logs/dusk-serve.log 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 50); do
    curl -s -o /dev/null http://127.0.0.1:8000/login && break
    sleep 0.2
done

php artisan dusk
STATUS=$?

kill "$SERVER_PID" 2>/dev/null
mv .env.backup.local .env

exit $STATUS
