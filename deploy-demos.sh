#!/bin/bash

# Deploy demos to GitHub Pages
# This script builds the core package, copies demos and dist files,
# adjusts paths, and deploys to the gh-pages branch

set -e  # Exit on error

echo "🚀 Starting GitHub Pages deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build the core package first
echo -e "${BLUE}📦 Building core package...${NC}"
pnpm run build:core

# Create temporary directory for gh-pages content
TEMP_DIR=".gh-pages-temp"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}📋 Copying files...${NC}"

# Copy demos folder
cp -r packages/core/demos/* "$TEMP_DIR/"

# Copy dist folder
cp -r packages/core/dist "$TEMP_DIR/"

# Copy theme folder if it exists
if [ -d "packages/core/demos/theme" ]; then
    cp -r packages/core/demos/theme "$TEMP_DIR/"
fi

# Fix import paths in HTML files (from ../dist/ to ./dist/)
echo -e "${BLUE}🔧 Adjusting import paths...${NC}"
find "$TEMP_DIR" -name "*.html" -type f -exec sed -i 's|from '\''../dist/|from '\''./dist/|g' {} +
find "$TEMP_DIR" -name "*.html" -type f -exec sed -i 's|from "../dist/|from "./dist/|g' {} +

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${BLUE}🔄 Updating gh-pages branch...${NC}"
else
    echo -e "${BLUE}🌱 Creating gh-pages branch...${NC}"
    git branch gh-pages
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Checkout gh-pages branch
git checkout gh-pages

# Remove old files (except .git)
echo -e "${BLUE}🧹 Cleaning gh-pages branch...${NC}"
git rm -rf . 2>/dev/null || true

# Copy new files from temp directory
cp -r "$TEMP_DIR"/* .

# Create .nojekyll file to prevent GitHub from processing files with Jekyll
touch .nojekyll

# Create a README for the gh-pages branch
cat > README.md << 'EOF'
# @liwe3/webcomponents Demos

This branch contains the demo pages for @liwe3/webcomponents.

**[View Live Demos](https://fsoft72.github.io/liwe3-webcomponents/)**

These demos are automatically generated from the `packages/core/demos/` directory.

To update these demos:
1. Make changes to the demos in the `master` branch
2. Run `./deploy-demos.sh` to rebuild and deploy

---

[Back to main repository](https://github.com/fsoft72/liwe3-webcomponents)
EOF

# Stage all changes
git add -A

# Commit
if git diff --cached --quiet; then
    echo -e "${GREEN}✅ No changes to commit${NC}"
else
    echo -e "${BLUE}💾 Committing changes...${NC}"
    git commit -m "Deploy demos to GitHub Pages

Updated demos and component files"
fi

# Push to GitHub
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin gh-pages

# Switch back to original branch
git checkout "$CURRENT_BRANCH"

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Your demos should be available at:"
echo "https://fsoft72.github.io/liwe3-webcomponents/"
echo ""
echo "Note: It may take a few minutes for GitHub Pages to update."
echo "You may need to configure GitHub Pages in your repository settings:"
echo "Settings > Pages > Source: gh-pages branch"
