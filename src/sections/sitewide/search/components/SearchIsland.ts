/**
 * Search island, the interactive half of /search/.
 *
 * The server renders the page (input, results region, and a no-JS note with
 * pillar links); this script takes over: it loads the Pagefind runtime
 * **once** (same-origin static assets under /pagefind/, built after
 * `astro build`, cached by the browser thereafter, so search keeps working
 * offline) and queries it, debounced, with deep-link support via ?q=.
 * Self-contained vanilla TS; nothing is fetched per keystroke and nothing
 * leaves the browser.
 *
 * The runtime only exists after a build — under `npm run dev` the import
 * fails and the status line says so; use `npm run preview` to try search.
 */

const PAGEFIND_URL = '/pagefind/pagefind.js';
const RESULT_LIMIT = 14;

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string; description?: string; section?: string };
}

interface Pagefind {
  search(query: string): Promise<{ results: PagefindResult[] }>;
  preload?(query: string): Promise<void>;
}

interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

let pagefindPromise: Promise<Pagefind> | null = null;

function loadPagefind(): Promise<Pagefind> {
  if (pagefindPromise) return pagefindPromise;
  // Variable specifier + @vite-ignore: the module is a build-output asset,
  // invisible to both TypeScript resolution and Vite's static analysis.
  const url = PAGEFIND_URL;
  pagefindPromise = import(/* @vite-ignore */ url)
    .then((mod) => mod as unknown as Pagefind)
    .catch((error) => {
      pagefindPromise = null; // allow a retry after a transient failure
      throw error;
    });
  return pagefindPromise;
}

function resultItem(hit: PagefindResultData): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'rounded-2xl border border-sand bg-parchment/60 p-5';

  const link = document.createElement('a');
  link.href = hit.url;
  link.className = 'group block';

  const meta = document.createElement('p');
  meta.className = 'text-xs font-semibold tracking-wide text-sage-deep uppercase';
  meta.textContent = hit.meta.section ?? 'Pages';

  const title = document.createElement('p');
  title.className =
    'mt-1 font-display text-lg font-semibold text-earth group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4';
  title.textContent = hit.meta.title ?? hit.url;

  const desc = document.createElement('p');
  desc.className = 'mt-1 text-sm leading-relaxed text-clay';
  desc.textContent =
    hit.meta.description?.trim() || hit.excerpt.replace(/<\/?mark>/g, '').trim();

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
      'The search index could not be loaded. It exists only after a build: run npm run preview (not npm run dev), or reload once you are back online.',
    );
  };

  const runSearch = (query: string): void => {
    if (query.trim().length < 2) {
      showIdle();
      return;
    }
    loadPagefind()
      .then(async (pagefind) => {
        const response = await pagefind.search(query);
        const hits = await Promise.all(
          response.results.slice(0, RESULT_LIMIT).map((result) => result.data()),
        );
        results.replaceChildren(...hits.map(resultItem));
        const total = response.results.length;
        setStatus(
          total === 0
            ? `No matches for “${query}”.`
            : total === hits.length
              ? `${total} result${total === 1 ? '' : 's'} for “${query}”`
              : `${total} results for “${query}” (showing the first ${hits.length})`,
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

  // Warm the runtime as soon as the searcher interacts, so the first
  // results appear without a visible pause.
  input.addEventListener('focus', () => {
    void loadPagefind().catch(() => {
      /* surfaced on search */
    });
  });

  if (!initial) {
    input.focus({ preventScroll: true });
  }
}
