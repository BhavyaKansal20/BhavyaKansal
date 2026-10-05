# Local Verification Suite

Because the automated sandbox environment lacks the capacity to run a full Chromium browser securely for visual diffs and Lighthouse, you MUST run this test suite locally to verify the rewrite accurately followed all hard rules.

### Prerequisites
- Node.js environment
- macOS (or a system capable of running bash and chromium)

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run the verification suite
npm run verify
```

### What this does:
1. Checks out the original `main` branch into a hidden worktree (`.verify/main-repo`) and builds it.
2. Builds the new code in your current directory.
3. Serves both locally on ports 4000 and 4001.
4. Executes Playwright checks to compare:
   - Preserved interaction parity (Hover, "Eyes", Ctrl+K)
   - Bounding boxes and chart consistency for Tracing the Arc & Coding Journey
5. Runs Lighthouse for performance, Axe for accessibility, and compares GZIP bundle sizes.
6. Dumps all evidence locally into `docs/evidence/`.

**After running this script, commit the generated `docs/evidence/` files!**
