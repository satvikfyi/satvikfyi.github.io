/**
 * Search island, the interactive half of /search/.
 *
 * The server renders the page (input, results region, and a no-JS note with
 * pillar links); this script takes over: it fetches the merged JSON index
 * **once** (same-origin static asset, cached by the browser thereafter, so
 * search keeps working offline) and runs Fuse.js over it, debounced, with
 * deep-link support via ?q=. Self-contained vanilla TS + Fuse.js; nothing
 * is fetched per keystroke.
 */
import Fuse from 'fuse.js';
import type { SearchDoc } from '../lib/index-builder';

const INDEX_URL = '/search/index.json';
const RESULT_LIMIT = 14;

interface LoadedImage {
  fuse: Fuse<SearchDoc>;
  docs: SearchDoc[];
}

let loaded: Promise<LoadedImage> | null = null;

function loadIndex(): Promise<LoadedImage> {
  if (loaded) return loaded;
  loaded = fetch(INDEX_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`index ${response.status}`);
      return response.json() as Promise<SearchDoc[]>;
    })
    .then((docs) => ({
      docs,
      fuse: new Fuse(docs, {
        keys: [
          { name: 't', weight: 0.6 },
          { name: 'k', weight: 0.25 },
          { name: 'd', weight: 0.15 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    }))
    .catch((error) => {
      loaded = null; // allow a retry after a transient failure
      throw error;
    });
  return loaded;
}

function resultItem(hit: SearchDoc): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'rounded-2xl border border-sand bg-parchment/60 p-5';

  const link = document.createElement('a');
  link.href = hit.u;
  link.className = 'group block';

  const meta = document.createElement('p');
  meta.className = 'text-xs font-semibold tracking-wide text-sage-deep uppercase';
  meta.textContent = hit.c;

  const title = document.createElement('p');
  title.className =
    'mt-1 font-display text-lg font-semibold text-earth group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4';
  title.textContent = hit.t;

  const desc = document.createElement('p');
  desc.className = 'mt-1 text-sm leading-relaxed text-clay';
  desc.textContent = hit.d;

  link.append(meta, title, desc);
  item.append(link);
  return item;
}

export function mountSearch(root: HTMLElement | null): void {
  if (!root) return;

  const input = root.querySelector<HTMLInputElement>('#search-input');
  const results = root.querySelector<HTMLElement>('#search-results');
  const status = root.querySelector<HTMLElement>('#search-status');
  if (!input || !results) return;

  let timer: number | undefined;
  let lastQuery = '';

  const setStatus = (text: string): void => {
    if (status) status.textContent = text;
  };

  const showIdle = (): void => {
    results.replaceChildren();
    setStatus('');
  };

  const showError = (): void => {
    results.replaceChildren();
    setStatus(
      'The search index could not be loaded, check your connection and try again. Everything else on this page works.',
    );
  };

  const runSearch = (query: string): void => {
    if (query.trim().length < 2) {
      showIdle();
      return;
    }
    loadIndex()
      .then(({ fuse, docs }) => {
        const hits = fuse.search(query, { limit: RESULT_LIMIT }).map((r) => r.item);
        results.replaceChildren(...hits.map(resultItem));
        setStatus(
          hits.length === 0
            ? `No matches for “${query}”.`
            : `${hits.length} result${hits.length === 1 ? '' : 's'} for “${query}” (of ${docs.length} pages)`,
        );
      })
      .catch(showError);
  };

  // Deep link: /search/?q=kitchari
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q');
  if (initial) {
    input.value = initial;
    lastQuery = initial;
    runSearch(initial);
  }

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query === lastQuery) return;
    lastQuery = query;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => runSearch(query), 140);
  });

  // Warm the index as soon as the searcher interacts, so the first
  // results appear without a visible pause.
  input.addEventListener('focus', () => {
    void loadIndex().catch(() => {
      /* surfaced on search */
    });
  });

  if (!initial) {
    input.focus({ preventScroll: true });
  }
}
