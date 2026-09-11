/**
 * Comments island, lazy-loaded Giscus discussions.
 *
 * The server renders a placeholder section (with the Giscus config as
 * data-* attributes) only on posts that opt in (`comments: true`). This
 * script attaches an IntersectionObserver and injects the Giscus embed
 * only when the section scrolls into view, readers who never reach the
 * bottom of the page never download a byte of it. When the site's Giscus
 * app is not yet configured, a friendly static note is shown instead.
 */

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

function readConfig(mount: HTMLElement): GiscusConfig | null {
  const repo = mount.dataset.giscusRepo?.trim() ?? '';
  const repoId = mount.dataset.giscusRepoId?.trim() ?? '';
  const category = mount.dataset.giscusCategory?.trim() ?? '';
  const categoryId = mount.dataset.giscusCategoryId?.trim() ?? '';
  if (!repo || !repoId || !category || !categoryId) return null;
  return { repo, repoId, category, categoryId };
}

function showNote(mount: HTMLElement, message: string): void {
  const note = document.createElement('p');
  note.className = 'rounded-2xl border border-sand bg-parchment/60 p-5 text-sm leading-relaxed text-clay';
  note.textContent = message;
  mount.replaceChildren(note);
}

export function mountComments(mount: HTMLElement | null): void {
  if (!mount) return;

  const configured = readConfig(mount) !== null;

  const load = (): void => {
    const config = readConfig(mount);
    if (!config) {
      showNote(
        mount,
        'Comments are enabled for this post and will appear here once the site\u2019s discussion forum finishes being set up. Thank you for your patience, no trackers are involved either way.',
      );
      return;
    }

    const container = document.createElement('div');
    container.className = 'giscus';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');

    container.append(script);
    mount.replaceChildren(container);
  };

  // Nothing loads until the section is actually approached.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            load();
          }
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(mount);
  } else {
    load();
  }

  // Expose whether the app is configured (for debugging; not required).
  mount.dataset.commentsReady = configured ? 'configured' : 'pending-config';
}
