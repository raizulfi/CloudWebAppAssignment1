#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until pg_isready -h db -U ${DB_USER:-postgres}; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - executing commands"

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy --skip-verify

# Start the Next.js application
echo "Starting Next.js application..."
exec "$@"
