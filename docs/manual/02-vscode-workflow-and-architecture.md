# Module 2: VS Code Workflow & Astro Architecture

The publisher's module: how the project is built, how to run it locally,
and how content goes from approved draft to live page with `git push`.

## 1. Tech stack & directory structure

Stack: **Astro 5 (static output) + TypeScript strict + Tailwind CSS v4 +
Zod content schemas**, vanilla-TS islands for interactivity (planner, quiz,
filters, search). No database, no backend, no client framework; the site is
a folder of HTML plus small JS islands. Content is plain Markdown with YAML
frontmatter.

The site lives at `website/20260910/` inside the `satvikfyi_assets`
repository. All terminal commands in this manual run from that folder.

**Important difference from stock Astro:** there is no top-level
`src/content/`. Content collections live inside their owning module, and
`src/pages/` contains only thin one-line wrappers. The layout:

```text
website/20260910/
├── astro.config.mjs            # site URL, sitemap, Tailwind
├── package.json                # scripts: dev, build, preview, check, verify…
├── public/                     # copied verbatim to the site root
│   ├── CNAME                   # pins the custom domain satvik.fyi
│   ├── robots.txt, favicon.svg
│   └── assets/images/{module}/ # content images (see Module 1, §4)
├── docs/                       # specs, decision log, this manual
├── scripts/                    # CI gates: check-links, check-seo, check-search-index
└── src/
    ├── config/
    │   ├── site.ts             # global config: name, URL, footer, giscus
    │   └── sections.ts         # THE REGISTRY: every module's manifest
    ├── content.config.ts       # registers the 9 collections + schemas
    ├── shared/                 # generic layer: layouts, components, seo, store, lib (ingredientBridge)
    ├── pages/                  # thin route wrappers (isModuleEnabled guards)
    └── sections/
        ├── body/               # meals, yoga, ayurveda  (each a self-contained folder)
        ├── mind/               # pranayama, meditation, mantras
        ├── soul/               # 5 path modules + shared paths/ implementation
        └── sitewide/           # quiz, blog, wiki, search
```

Each module folder is self-contained:

```text
sections/body/yoga/
├── module.config.ts      # manifest: id, title, routePrefix, enabled
├── schemas/pose.ts       # the Zod schema for its collection
├── content/
│   ├── pose-template.md  # fill-in template (start here)
│   └── poses/*.md        # the collection itself
├── lib/                  # pure helpers (labels, sorting, JSON-LD)
├── components/           # cards, filter islands
└── pages/                # Index.astro, PoseDetail.astro
```

Disabling a module = `enabled: false` in its `module.config.ts`; the
registry removes it from nav, sitemap and search, and its routes redirect
to the pillar. Cross-module links are plain URLs only.

## 2. Local development setup

Prerequisites: **Node.js 22 LTS** (check with `node --version`) and Git.

```bash
# 1. Clone the repository (first time on a machine)
git clone https://github.com/aecabhijeet/satvikfyi_assets.git
cd satvikfyi_assets/website/20260910

# 2. Install dependencies (also after every pull that touches package.json)
npm install

# 3. Start the dev server; live at http://localhost:4321
npm run dev

# 4. When finished writing: the full local quality gate
npm run verify
```

Useful commands beyond the basics:

```bash
npm run build          # production build into dist/
npm run preview        # serve the built site (http://localhost:4321)
npm run check          # types + frontmatter schema validation only
npm run check:links    # every internal link/asset must resolve in dist/
npm run check:search   # Pagefind index exists and covers the whole site
npm run check:seo      # canonicals, og:image, JSON-LD, robots, sitemap
```

`npm run verify` chains all of the above; **run it before every push** and
fix what it reports. What CI runs locally, CI would run again (Module 3).

## 3. Content collection management

There are **nine collections**, each with a ready template one level above
its folder. The universal procedure: copy the template, rename to the slug,
fill every field, delete the guidance comments if you like (they are YAML
comments and harmless to keep).

| Collection | Folder under `src/sections/` | Template |
| --- | --- | --- |
| Recipes | `body/meals/content/recipes/` | `../recipe-template.md` |
| Yoga poses | `body/yoga/content/poses/` | `../pose-template.md` |
| Ayurveda entries | `body/ayurveda/content/entries/` | `../entry-template.md` |
| Pranayama | `mind/pranayama/content/techniques/` | `../technique-template.md` |
| Meditation | `mind/meditation/content/practices/` | `../practice-template.md` |
| Mantras | `mind/mantras/content/mantras/` | `../mantra-template.md` |
| Soul teachings | `soul/paths/content/teachings/` | `../teaching-template.md` |
| Blog posts | `sitewide/blog/content/posts/` | `../post-template.md` |
| Wiki articles | `sitewide/wiki/content/articles/` | `../article-template.md` |

Worked example, adding a pose:

```bash
cd website/20260910
cp src/sections/body/yoga/content/pose-template.md \
   src/sections/body/yoga/content/poses/ustrasana.md
code src/sections/body/yoga/content/poses/ustrasana.md
# fill in: name, slug: ustrasana, sanskritName "Uṣṭrāsana", category, level,
# summary, benefits, contraindications, steps, breathingPattern,
# associatedDoshas, sources. Body paragraphs optional.
npm run dev      # check the pose live at /body/yoga/ustrasana/
npm run verify   # schema + links + search + SEO all pass → ready to push
```

Frontmatter notes that apply everywhere:

- `slug` **must equal the file name** (kebab-case); it becomes the URL.
- Required fields differ per collection, but every entry requires
  `sources[]` (blog posts and wiki articles cite references too).
- Frontmatter must be the **first line of the file** (`---` at byte 0) or
  the build reads the entry as empty.
- Quote YAML values containing a colon, and quote anything that looks like
  a bare number or date: `reference: "2.47"`, `date: "2026-08-30"`.
- The prose body below the closing `---` is Markdown; keep links pointed at
  module listings (`/body/meals/`) or fixed routes, never at another
  module's detail pages (they vanish when that module is disabled, and the
  link gate fails the build).

New pages appear automatically: listings, detail routes, tag pages, RSS,
the search index and the sitemap all derive from the collections. No
template or code edits are ever needed to publish content.

## 4. Git publishing routine

Day-to-day sequence (from `website/20260910`, or the repo root for the git
commands; content edits live under the site folder):

```bash
# 1. Start from the latest main
git pull

# 2. (Recommended) work on a branch for anything bigger than a typo
git switch -c content/yoga-ustrasana

# 3. Make your edits in VS Code, then run the gates
npm run verify

# 4. Stage, describe, push
git add .
git commit -m "content(yoga): add uṣṭrāsana with video source"
git push                     # or: git push -u origin HEAD for a new branch

# 5. Branches: open a PR on GitHub, squash-merge when green; direct pushes
#    to main are fine for small content fixes.
```

Commit message convention (keep history readable):

```text
content({module}): {what was added/changed}
fix({module}): {what broke and how it is fixed}
chore(website): {tooling, deps, docs}
docs(manual): {this manual's own changes}
```

Roll-forward rule: if `verify` fails, fix it before pushing; a red main
blocks every later deploys (Module 3 explains the rollback path for the
rare case a bad push slips through).
