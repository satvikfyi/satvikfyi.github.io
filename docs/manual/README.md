# Satvik.fyi Operations Manual

Three modules, one job each. Read in order the first time; afterwards each
module stands alone.

| Module | File | For whom |
| --- | --- | --- |
| 1. Content & Volunteer Editorial Guide | [01-content-and-editorial-guide.md](./01-content-and-editorial-guide.md) | Volunteers, editors, reviewers |
| 2. VS Code Workflow & Astro Architecture | [02-vscode-workflow-and-architecture.md](./02-vscode-workflow-and-architecture.md) | The site owner (you), working in VS Code |
| 3. Deployment, Domain & Troubleshooting | [03-deployment-and-troubleshooting.md](./03-deployment-and-troubleshooting.md) | The site owner, on call |

## Who does what

- **Volunteers** draft in Google Docs or Word using the submission template
  in Module 1. They never touch the repository.
- **You (editor/publisher)** transpose approved drafts into the collection
  templates in VS Code, run the local quality gates, and push. Automation
  takes it from there.
- **The build** is the final reviewer: schema validation, link checking,
  search-index budget and SEO checks run on every push. If a volunteer's
  draft breaks a rule, the build says so in plain language.

## The one-page cheat sheet

```bash
cd website/20260822          # the site lives in this sub-folder of the repo
npm run dev                  # local preview at http://localhost:4321
npm run verify               # ALL quality gates (run before every push)
git pull                     # never push on a stale branch
git add . && git commit -m "content(yoga): add uṣṭrāsana"
git push
```

Spelling: **satvik**, always and only. Sanskrit in IAST. No em dashes in
copy. Sources cited. Disclaimers render automatically; do not remove them.
