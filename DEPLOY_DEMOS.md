# Deploying Demos to GitHub Pages

This guide explains how to deploy the component demos to GitHub Pages. Two deployment methods are available:

## Method 1: Using gh-pages Branch (Recommended)

This method deploys demos to a separate `gh-pages` branch, keeping your main branch clean.

### Usage

```bash
pnpm run deploy:demos
```

Or directly:

```bash
./deploy-demos.sh
```

### What it does

1. Builds the core package (`@liwe3/webcomponents`)
2. Creates a temporary directory with demos and dist files
3. Adjusts import paths from `../dist/` to `./dist/`
4. Creates or updates the `gh-pages` branch
5. Commits and pushes changes
6. Returns to your original branch

### GitHub Pages Configuration

After first deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Your demos will be available at:
```
https://<username>.github.io/<repository-name>/
```

### Advantages

- Main branch stays clean
- Automatic deployment via script
- No generated files in main branch history
- Standard GitHub Pages workflow

---

## Method 2: Using docs/ Folder

This method generates demos in a `docs/` folder on your main branch.

### Usage

```bash
pnpm run deploy:demos:docs
```

Or directly:

```bash
./deploy-demos-docs.sh
```

### What it does

1. Builds the core package
2. Creates/updates `docs/` folder with demos
3. Adjusts import paths
4. Creates a `.nojekyll` file

### Manual Steps Required

After running the script:

```bash
# Review the generated files
git add docs
git commit -m "Update component demos"
git push
```

### GitHub Pages Configuration

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/docs`
4. Click **Save**

### Advantages

- Simpler workflow
- No branch switching
- Demos versioned with code
- Easy to review changes

### Disadvantages

- Adds generated files to main branch
- Larger repository size
- More commit noise

---

## Comparison

| Feature | gh-pages branch | docs/ folder |
|---------|----------------|--------------|
| **Setup complexity** | Medium | Simple |
| **Deployment** | Automatic | Manual commit |
| **Main branch clean** | ✅ Yes | ❌ No |
| **Easy rollback** | ✅ Yes | ⚠️ Via git history |
| **GitHub Standard** | ✅ Yes | ✅ Yes |

---

## Customization

### Update GitHub URLs

Both scripts contain placeholder URLs. Update these in:

- `deploy-demos.sh` (line 89-92)
- `deploy-demos-docs.sh` (line 49-52)

Replace:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

With your actual GitHub Pages URL.

### Modify Build Process

To customize what gets deployed, edit the respective script:

1. Add/remove files to copy
2. Adjust path transformations
3. Include additional build steps

---

## Troubleshooting

### Demos not loading

- Check browser console for import errors
- Verify paths were correctly transformed (should be `./dist/` not `../dist/`)
- Ensure all dist files are present

### GitHub Pages not updating

- Wait 2-5 minutes for GitHub to rebuild
- Check **Actions** tab for build status
- Verify GitHub Pages is enabled in Settings

### Import errors

If you see module import errors:

1. Ensure core package is built: `pnpm run build:core`
2. Check that dist/ folder exists in deployed files
3. Verify HTML files reference `./dist/` not `../dist/`

### Permission denied when running scripts

```bash
chmod +x deploy-demos.sh
chmod +x deploy-demos-docs.sh
```

---

## Development Workflow

1. **Develop demos** in `packages/core/demos/`
2. **Test locally** by opening HTML files (they reference `../dist/`)
3. **Deploy** using one of the methods above
4. **Verify** by visiting your GitHub Pages URL

---

## Notes

- Both scripts build the core package automatically
- Import paths are automatically adjusted for GitHub Pages
- Original demo files are not modified
- Scripts are idempotent (safe to run multiple times)
