/**
 * Quiz island, the interactive half of /quiz/.
 *
 * The server renders every question as a plain fieldset/radio group (the
 * no-JS fallback: answer on paper and tally with the printed key); this
 * script takes over and turns the same markup into a step-by-step wizard:
 * one question at a time, progress announced, auto-advance on selection,
 * back/next navigation, then client-side scoring into a dominant dosha.
 *
 * The result is saved to the shared localStorageStore:
 *   `satvikfyi:v1:quiz-result` = { dosha, date }
 * The meals planner and the meals/yoga/ayurveda filters read that key
 * (read-only), this module never reaches into any of them.
 */
import { createStore } from '../../../../shared/utils/localStorageStore';
import {
  DOSHAS,
  QUESTIONS,
  dominantDosha,
  doshaBlurbs,
  doshaElements,
  doshaLabel,
  tally,
  type Dosha,
} from '../lib/questions';

export interface QuizResult {
  dosha: Dosha;
  /** ISO timestamp of the moment the result was saved. */
  date: string;
}

export const quizStore = createStore<QuizResult>('quiz-result', 1);

export function mountQuiz(root: HTMLElement | null): void {
  if (!root) return;

  const form = root.querySelector<HTMLFormElement>('#quiz-form');
  const nav = document.getElementById('quiz-nav');
  const progress = document.getElementById('quiz-progress');
  const progressBar = document.getElementById('quiz-progress-bar');
  const backButton = document.getElementById('quiz-back') as HTMLButtonElement | null;
  const nextButton = document.getElementById('quiz-next') as HTMLButtonElement | null;
  const result = document.getElementById('quiz-result');
  const savedNote = document.getElementById('quiz-saved-note');
  if (!form || !nav || !result) return;

  const steps = QUESTIONS.map((question) => form.querySelector<HTMLFieldSetElement>(`fieldset[name="${question.id}"]`));
  const total = steps.length;
  let current = 0;

  const answerOf = (index: number): string => {
    const step = steps[index];
    if (!step) return '';
    const checked = step.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    return checked?.value ?? '';
  };

  const setLinkHrefs = (dosha: Dosha): void => {
    for (const link of Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-quiz-link]'))) {
      const base = link.getAttribute('href') || '#';
      link.href = `${base}${base.includes('?') ? '&' : '?'}dosha=${dosha}`;
    }
  };

  const renderResult = (dosha: Dosha, scores: Record<Dosha, number> | null, savedOn?: string): void => {
    const title = document.getElementById('quiz-result-title');
    const elements = document.getElementById('quiz-result-elements');
    const blurb = document.getElementById('quiz-result-blurb');
    const bars = document.getElementById('quiz-bars');
    if (title) title.textContent = `${doshaLabel[dosha]}-dominant`;
    if (elements) elements.textContent = `The elements of ${doshaLabel[dosha]}: ${doshaElements[dosha]}.`;
    if (blurb) {
      const info = doshaBlurbs[dosha];
      const others = DOSHAS.filter((d) => d !== dosha).map((d) => doshaLabel[d]);
      blurb.textContent = `In balance you are ${info.balanced}; in excess, ${info.excess}. Traditionally steadied by ${info.steadied}. Your ${others.join(' and ')} counts showed up too, most people are a blend, with one dosha leading.`;
    }
    if (bars) bars.hidden = scores === null;
    if (scores) {
      for (const d of DOSHAS) {
        const bar = document.getElementById(`quiz-bar-${d}`);
        const count = document.getElementById(`quiz-count-${d}`);
        if (bar) bar.style.width = `${Math.round((scores[d] / total) * 100)}%`;
        if (count) count.textContent = `${scores[d]} of ${total}`;
      }
    }
    if (savedNote) {
      savedNote.hidden = !savedOn;
      if (savedOn) {
        const when = new Date(savedOn);
        const text = Number.isNaN(when.getTime()) ? savedOn : when.toLocaleDateString();
        savedNote.textContent = `Loaded from your saved result (${text}), retake the quiz any time to refresh it.`;
      }
    }
    setLinkHrefs(dosha);
    form.hidden = true;
    nav.hidden = true;
    if (progress) progress.hidden = true;
    result.hidden = false;
    title?.focus();
  };

  const finish = (): void => {
    const answers: Record<string, string> = {};
    for (let index = 0; index < total; index++) {
      const answer = answerOf(index);
      if (answer) answers[QUESTIONS[index].id] = answer;
    }
    const scores = tally(answers as Parameters<typeof tally>[0]);
    const dosha = dominantDosha(scores);
    quizStore.set({ dosha, date: new Date().toISOString() });
    renderResult(dosha, scores);
  };

  const isLast = (index: number): boolean => index === total - 1;

  const showStep = (index: number): void => {
    current = index;
    steps.forEach((step, stepIndex) => {
      if (step) step.hidden = stepIndex !== current;
    });
    if (progress) progress.textContent = `Question ${current + 1} of ${total}`;
    if (progressBar) progressBar.style.width = `${Math.round((current / total) * 100)}%`;
    if (backButton) backButton.disabled = current === 0;
    if (nextButton) {
      nextButton.textContent = isLast(current) ? 'See my result' : 'Next question';
      nextButton.disabled = !answerOf(current);
    }
    steps[current]?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  };

  const next = (): void => {
    if (isLast(current)) {
      finish();
      return;
    }
    showStep(current + 1);
  };

  // Wire the wizard, only after this does the single-question view exist.
  for (const [index] of QUESTIONS.entries()) {
    const step = steps[index];
    if (!step) continue;
    step.addEventListener('change', () => {
      // Auto-advance on selection; the last step waits for the button.
      if (!isLast(index)) next();
      else if (nextButton) nextButton.disabled = false;
    });
  }

  backButton?.addEventListener('click', () => showStep(Math.max(0, current - 1)));
  nextButton?.addEventListener('click', next);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!(nextButton?.disabled ?? false)) next();
  });

  const retake = document.getElementById('quiz-retake');
  retake?.addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    form.hidden = false;
    nav.hidden = false;
    if (progress) progress.hidden = false;
    if (nextButton) nextButton.disabled = true;
    showStep(0);
  });

  const forget = document.getElementById('quiz-forget');
  forget?.addEventListener('click', () => {
    quizStore.remove();
    retake?.click();
  });

  // A saved result from an earlier visit opens straight to the answer.
  const saved = quizStore.get();
  if (saved && DOSHAS.includes(saved.dosha)) {
    renderResult(saved.dosha, null, saved.date);
    return;
  }

  if (nextButton) nextButton.disabled = true;
  nav.hidden = false;
  if (progress) progress.hidden = false;
  showStep(0);
}
