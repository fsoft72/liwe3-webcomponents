#!/bin/bash

set -e

# We need to be in the root folder (where `packages` dir exists)
if [ ! -d "packages" ]; then
  echo "Error: This script must be run from the root folder where the 'packages' directory exists."
  exit 1
fi

# Login (if not already)
npm login

# Publish core
cd packages/core
pnpm install
pnpm run build
npm publish

# Publish svelte
cd ../svelte
pnpm install
pnpm run package
npm publish
