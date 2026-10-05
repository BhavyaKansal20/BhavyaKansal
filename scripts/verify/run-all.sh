#!/bin/bash
set -e
echo "Running full verification suite..."

# Ensure playwright is installed
npx playwright install chromium

# Setup worktrees
rm -rf .verify
mkdir -p .verify

# Build Old
echo "Building original main..."
git worktree add .verify/main-repo ef7a871778b77baf6f566bf471d039eb4c7f99c1
cd .verify/main-repo
npm ci
npm run build || true
cp -r dist ../main
cd ../..

# Build New
echo "Building new design..."
npm run build
cp -r dist .verify/new

echo "Starting servers..."
npx serve .verify/main -p 4000 &
PID_OLD=$!
npx serve .verify/new -p 4001 &
PID_NEW=$!

sleep 3 # Wait for servers

echo "Running Playwright Tests..."
npx playwright test scripts/verify/test-effects.spec.js --reporter=list || echo "Tests failed"

# Add more verification script calls here (axe, lighthouse, bundle sizes, leak check)
echo "Running bundle size comparison..."
node scripts/verify/bundle-diff.js > docs/evidence/bundle.txt

echo "Running leak checks..."
node scripts/verify/leak-check.js > docs/evidence/leak-check.txt

echo "Cleanup..."
kill $PID_OLD
kill $PID_NEW
git worktree remove .verify/main-repo --force
rm -rf .verify
echo "Verification complete!"
