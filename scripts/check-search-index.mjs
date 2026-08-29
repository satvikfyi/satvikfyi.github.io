#!/usr/bin/env node
/**
 * check-search-index.mjs, CI gate: the merged search index must exist,
 * parse, be non-trivial, and stay under the size budget (300 KB).
 */
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BUDGET_BYTES = 300 * 1024;

const problems = [];

const indexPath = join(DIST, 'search', 'index.json');

// Disable-aware: when the search module is off, /search/ is a meta-refresh
// redirect and no index should exist, the gate passes with a note.
const searchPage = join(DIST, 'search', 'index.html');
const searchDisabled =
  existsSync(searchPage) &&
  /http-equiv="refresh"/i.test(readFileSync(searchPage, 'utf8')) &&
  !existsSync(indexPath);
if (searchDisabled) {
  console.log('Search module is disabled (redirect page present), index gate skipped.');
  process.exit(0);
}

if (!existsSync(indexPath)) {
  problems.push('dist/search/index.json is missing, the merged search index did not build.');
} else {
  const bytes = statSync(indexPath).size;
  let docs = null;
  try {
    docs = JSON.parse(readFileSync(indexPath, 'utf8'));
  } catch (error) {
    problems.push(`dist/search/index.json does not parse: ${error.message}`);
  }
  if (Array.isArray(docs)) {
    if (docs.length < 50) {
      problems.push(`merged index has only ${docs.length} documents, expected the whole site (50+).`);
    }
    const invalid = docs.filter((d) => !d.t || !d.u || !d.c || typeof d.d !== 'string');
    if (invalid.length > 0) {
      problems.push(`${invalid.length} index document(s) are missing required fields (t/d/u/c).`);
    }
  } else if (docs !== null) {
    problems.push('merged index is not a JSON array.');
  }
  if (bytes > BUDGET_BYTES) {
    problems.push(
      `merged index is ${(bytes / 1024).toFixed(1)} KB, over the ${BUDGET_BYTES / 1024} KB budget.`,
    );
  }
  console.log(`Merged search index: ${docs?.length ?? 0} documents, ${(bytes / 1024).toFixed(1)} KB (budget ${BUDGET_BYTES / 1024} KB).`);
}

// Per-collection chunks must also exist alongside the merged index.
const chunkDir = join(DIST, 'search');
if (existsSync(chunkDir)) {
  const chunks = readdirSync(chunkDir).filter((f) => f.endsWith('.json') && f !== 'index.json');
  console.log(`Per-collection chunks: ${chunks.length} (${chunks.join(', ')}).`);
  if (chunks.length < 5) {
    problems.push(`expected 5+ per-collection chunks, found ${chunks.length}.`);
  }
} else {
  problems.push('dist/search/ does not exist.');
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('✓ Search index present, valid and within budget.');
