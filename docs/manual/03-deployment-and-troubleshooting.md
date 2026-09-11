# Module 3: Deployment, Domain & Troubleshooting

How the site ships, how to fix it when the build objects, and how to roll
back when something reaches production that should not have.

## 1. Hosting & CI/CD

### Two repositories, two jobs

- **The live website repository** hosts the site on GitHub Pages. Its
  root is the content of this website build folder. Both workflows ship
  inside the build (`.github/workflows/`) and run there from the repo
  root as-is, with no working-directory tweaks.
- **`satvikfyi_assets`** (this folder's home) is the archive: recipes,
  prompts, decisions, and the website as per-build zip artifacts. It
  does not build or deploy anything.

Shipping a build to live = unzip the build's zip into the live repo's
root, commit, push. The zip is built from inside the website folder so
its contents land at the live repo's root directly.

### The pipeline

- **CI** (`ci.yml`): on every push/PR to main in the live repo, runs
  `npm run check`, `npm run build` (which includes the Pagefind indexing
  step), the three content gates (links, search index, SEO) and
  Lighthouse CI (performance ≥ 0.90, accessibility ≥ 0.95).
- **Deploy** (`deploy.yml`): on push to main (or manual dispatch), builds
  and publishes `dist/` to GitHub Pages.

`public/CNAME` pins the custom domain **satvik.fyi**; the sitemap lands at
`/sitemap-index.xml` and RSS at `/rss.xml`.

### One-time activation checklist (in the live repo, before first deploy)

1. Repository settings: **Settings → Pages → Source: GitHub Actions**.
2. DNS at the registrar, for the apex domain `satvik.fyi`:
   ```text
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   <your-github-username>.github.io
   ```
3. Settings → Pages → Custom domain: `satvik.fyi`, then enable
   **Enforce HTTPS** once the certificate issues (usually minutes).
4. Verify DNS propagation: `dig satvik.fyi +short` should list the four
   A records.

After activation, every push to main deploys; PRs run CI without deploying.
Until then (or instead), publish manually with the same commands the
workflow runs: `npm ci && npm run build` and upload `dist/`.

### Creating a build zip (handoff / archive)

From inside the website build folder — the zip's contents must land at
the live repo's root, so the archive root IS the site:

```bash
cd satvikfyi_assets/website/<build>
zip -qr ../../<build>.zip . \
  -x "node_modules/*" -x "dist/*" -x ".astro/*" -x ".lighthouseci/*" \
  -x "*.log" -x ".DS_Store"
```

The zip must include the dotfiles — `.github/workflows/` (the site is
incomplete for live without them) and `.gitignore`. Commit the zip to
`satvikfyi_assets`; the open `website/` folder is gitignored there by
design. Renaming a build folder means updating the archive-side scripts
(`content/scripts/*.py`) and the docs path references — search the repo
for the old folder name before and after.

## 2. Build error resolution

Every failure below has been seen in this project. The error's first line
names the file; the indented line names the field.

**Invalid YAML frontmatter** (`bad indentation of a mapping entry`,
`mapping values are not allowed`): a plain value contains a colon+space, a
comma-list item starts with a quote, or a `: ` appears in a multi-line
scalar. Fix: double-quote the whole value, or quote the list item:
`preparation: "In the kitchen: ¼ tsp cooked into dal."`

**Wrong type for a field** (`Expected type "string", received "number"`):
a verse reference like `reference: 2.47` parses as a float. Fix: quote it,
`reference: "2.47"`.

**Dates failing validation** (blog: `date: Required` or a type error):
unquoted `2026-08-30` parses as a YAML Date object, not a string. Fix:
`date: "2026-08-30"` (the post template reminds you).

**Every field suddenly "Required"** on a new entry: the file does not start
with `---` at byte 0 (an HTML comment or blank text above the frontmatter
makes Astro read it as empty). Fix: the file must open with `---`.

**Schema failures** (`data does not match collection schema`, e.g.
`contraindications: … min 1`): a required list is empty or a value is not
in the enum. Pranayama entries require at least one honest contraindication
by design. Fix per the template's commented options.

**Missing asset references** (`broken internal link → /assets/…` from
`check-links`): a cover image named in frontmatter but not present in
`public/assets/images/{module}/`, or a typo'd file name (case matters).
Fix: add the WebP (Module 1, §4) or correct the name.

**Broken internal page links** (`check-links` fails): usually a hand-typed
URL. Markdown bodies may link to module listings and fixed routes across
modules, and to detail pages only within the same module; anything else
fails when a module is disabled. Fix: point at the listing page.

**Search gate** (`dist/pagefind/pagefind.js is missing`): pagefind did
not run after the build. Fix: build with `npm run build` (the script runs
`pagefind --site dist`; pagefind comes from `npm ci`). If search works in
`npm run preview` but the page says the index cannot load under
`npm run dev`, that is expected: the index only exists after a build.

**SEO gate** (`N page(s) lack og:image` / missing JSON-LD): almost always
means a page was hand-added outside the layouts. Fix: use the shared
layouts, which emit these automatically.

The universal debug loop: `npm run dev`, fix, `npm run verify`; when
verify is green, everything CI checks is green.

## 3. Disaster recovery

**Bad content reached production** (a wrong recipe, a broken paragraph):

```bash
git pull                                   # be current
git revert <bad-commit-sha>                # creates an inverse commit
git push                                   # triggers a fresh deploy
```

Find the sha with `git log --oneline` or on the repository's Commits page.
Revert (which preserves history) is preferred over reset/force-push
(which rewrites it and can strand collaborators).

**Prefer the UI?** On GitHub: Commits → the bad commit → **Revert** button
→ merge the auto-created PR. Same effect, no terminal.

**Deploy is broken but content is fine** (build failure on main): the
Actions tab shows the failing workflow log; the live site keeps serving
the last successful build, so there is no outage, only a stalled update.
Fix locally (`npm run verify` reproduces it), push the fix. To force a
re-deploy of the current main without a new commit: Actions → "Deploy to
GitHub Pages" → **Run workflow**.

**Roll the whole site back N commits** (nuclear option, use rarely):

```bash
git log --oneline                       # pick the last known-good sha
git revert --no-commit HEAD~3..HEAD     # undo the last 3 commits
git commit -m "chore(website): roll back to <sha>"
git push
```

**Repository-level recovery**: the repo is the backup. If a machine dies,
re-clone and `npm install`. If main itself is unreachable, branch from any
commit (`git switch -c rescue <sha>`) and rebuild from there. Secrets:
there are none, by design, so nothing to rotate.

## 4. Site health

**Dependency updates** (monthly, ten minutes):

```bash
npm outdated                 # review what is stale
npm update                   # safe: patch/minor within ranges
npm run verify               # gates must stay green
# majors (astro, tailwindcss) get a dedicated session:
npm install astro@latest && npm run verify && git diff package.json
```

Pin nothing manually; `package-lock.json` is committed, so volunteers'
machines and CI install identical trees via `npm ci`.

**Sitemap**: generated on every build (`@astrojs/sitemap`), excludes
disabled modules automatically. Verify after structural changes:
`curl -s https://satvik.fyi/sitemap-index.xml` and confirm current dates.

**RSS**: `/rss.xml` rebuilds from published (non-draft) posts on every
build. Validate after feed changes:

```bash
curl -s https://satvik.fyi/rss.xml | head -5      # looks like RSS 2.0
python3 -c "import xml.dom.minidom,urllib.request; \
  xml.dom.minidom.parseString(urllib.request.urlopen('https://satvik.fyi/rss.xml').read()); \
  print('RSS valid')"
```

**Quarterly checklist**:

- `npm outdated` and update; `npm audit` for advisories.
- Submit `https://satvik.fyi` to Google Search Console's live test; fetch
  as Google once after big launches.
- Lighthouse spot-check the home page, a recipe, and a blog post (the CI
  bar is performance ≥ 0.90, accessibility ≥ 0.95).
- Skim the 404s: Pages settings → nothing needed, but search console's
  Coverage report lists stale inbound URLs; add redirects only if a URL
  genuinely moved.
- Re-read Module 1's forbidden-themes list before onboarding new
  volunteers.
