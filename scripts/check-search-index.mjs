#!/usr/bin/env node
/**
 * check-search-index.mjs, CI gate: the Pagefind index (built by the
 * `pagefind --site dist` step appended to `npm run build`) must exist,
 * parse, and cover the whole site. Pagefind chunks its index and loads
 * fragments on demand, so there is no single-file size budget to guard.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const MIN_FRAGMENTS = 50;

const problems = [];

const runtimePath = join(DIST, 'pagefind', 'pagefind.js');
const entryPath = join(DIST, 'pagefind', 'pagefind-entry.json');

// Disable-aware: when the search module is off, /search/ is a meta-refresh
// redirect; Pagefind still indexes the rest of the site but nothing links
// to search, so the gate only checks that the index itself is sane.
const searchPage = join(DIST, 'search', 'index.html');
const searchDisabled =
  existsSync(searchPage) && /http-equiv="refresh"/i.test(readFileSync(searchPage, 'utf8'));
if (searchDisabled) {
  console.log('Search module is disabled (redirect page present); checking the index only.');
}

if (!existsSync(runtimePath)) {
  problems.push('dist/pagefind/pagefind.js is missing, pagefind did not run after the build.');
}

if (!existsSync(entryPath)) {
  problems.push('dist/pagefind/pagefind-entry.json is missing.');
} else {
  let entry = null;
  try {
    entry = JSON.parse(readFileSync(entryPath, 'utf8'));
  } catch (error) {
    problems.push(`pagefind-entry.json does not parse: ${error.message}`);
  }
  if (entry) {
    const languages = Object.values(entry.languages ?? {});
    const pageCount = languages.reduce((sum, lang) => sum + (lang?.page_count ?? 0), 0);
    console.log(
      `Pagefind index: v${entry.version ?? '?'}, ${pageCount} page(s), ` +
        `${readdirSync(join(DIST, 'pagefind')).length} files.`,
    );
    if (pageCount < MIN_FRAGMENTS) {
      problems.push(`index covers only ${pageCount} pages, expected the whole site (${MIN_FRAGMENTS}+).`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('✓ Pagefind search index present and covering the site.');
