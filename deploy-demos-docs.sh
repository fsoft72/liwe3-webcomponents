#!/bin/bash

# Deploy demos to GitHub Pages using docs/ folder
# This is a simpler alternative to deploy-demos.sh that doesn't require branch switching.
# Configure GitHub Pages to serve from: main branch / docs folder

set -e  # Exit on error

echo "🚀 Building demos for GitHub Pages (docs/ folder)..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build the core package first
echo -e "${BLUE}📦 Building core package...${NC}"
pnpm run build:core

# Clean and create docs directory
echo -e "${BLUE}📋 Preparing docs directory...${NC}"
rm -rf docs
mkdir -p docs

# Copy demos folder contents
cp -r packages/core/demos/* docs/

# Copy dist folder
cp -r packages/core/dist docs/

# Copy theme folder if it exists
if [ -d "packages/core/demos/theme" ]; then
    cp -r packages/core/demos/theme docs/
fi

# Fix import paths in HTML files (from ../dist/ to ./dist/)
echo -e "${BLUE}🔧 Adjusting import paths...${NC}"
find docs -name "*.html" -type f -exec sed -i 's|from '\''../dist/|from '\''./dist/|g' {} +
find docs -name "*.html" -type f -exec sed -i 's|from "../dist/|from "./dist/|g' {} +

# Create .nojekyll file
touch docs/.nojekyll

# Create a README for the docs folder
cat > docs/README.md << 'EOF'
# @liwe3/webcomponents Demos

This directory contains the live demos for @liwe3/webcomponents.

**[View Live Demos](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)**

## Setup

These demos are automatically generated. To update:

```bash
pnpm run deploy:demos:docs
```

Then commit and push the `docs/` folder.

## GitHub Pages Configuration

In your repository settings:
- Go to Settings > Pages
- Source: Deploy from a branch
- Branch: main (or master)
- Folder: /docs
- Click Save

---

[Back to main repository](../../)
EOF

echo -e "${GREEN}✅ Demos built successfully in docs/ folder!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the generated files in the docs/ folder"
echo "2. Commit and push: git add docs && git commit -m 'Update demos' && git push"
echo "3. Configure GitHub Pages in Settings > Pages:"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main (or master)"
echo "   - Folder: /docs"
echo ""
echo "Your demos will be available at:"
echo "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
