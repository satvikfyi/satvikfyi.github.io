/**
 * Quiz questions and scoring, pure, client-safe data and functions.
 *
 * The page and the island both import this file, so the server-rendered form
 * and the client-side wizard can never drift apart. No Astro imports here.
 *
 * Scoring is a simple count of vāta/pitta/kapha selections; ties resolve in
 * the classical enumeration order (vāta, pitta, kapha) so the result is
 * deterministic. This is a reflection tool, not a diagnosis.
 */

export const DOSHAS = ['vata', 'pitta', 'kapha'] as const;
export type Dosha = (typeof DOSHAS)[number];

export interface QuizOption {
  /** The answer text. */
  label: string;
  dosha: Dosha;
}

export interface QuizQuestion {
  /** Stable id matching the form input name (q1, q2, …). */
  id: string;
  prompt: string;
  help?: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Your body frame is mostly…',
    help: 'Think of your lifelong tendency, not this year alone.',
    options: [
      { label: 'Thin, light or wiry; I gain weight with difficulty', dosha: 'vata' },
      { label: 'Medium and well-proportioned, weight stays fairly steady', dosha: 'pitta' },
      { label: 'Solid, sturdy or rounded; I gain weight easily', dosha: 'kapha' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Your skin tends to be…',
    options: [
      { label: 'Warm, easily flushed; prone to redness or irritation', dosha: 'pitta' },
      { label: 'Thick, smooth, cool and moist; naturally soft', dosha: 'kapha' },
      { label: 'Dry, cool, thin; prone to roughness and cracking', dosha: 'vata' },
    ],
  },
  {
    id: 'q3',
    prompt: 'Your hair is mostly…',
    options: [
      { label: 'Thick, abundant and lustrous', dosha: 'kapha' },
      { label: 'Dry, fine or frizzy', dosha: 'vata' },
      { label: 'Fine, often fair or early-thinning, oily at the roots', dosha: 'pitta' },
    ],
  },
  {
    id: 'q4',
    prompt: 'Your appetite and digestion are…',
    options: [
      { label: 'Irregular, ravenous one day, forgetting meals the next; prone to gas and bloating', dosha: 'vata' },
      { label: 'Steady but mild, I can skip meals calmly; digestion is slow and heavy', dosha: 'kapha' },
      { label: 'Strong, I grow irritable if a meal is late; sometimes acid or burning', dosha: 'pitta' },
    ],
  },
  {
    id: 'q5',
    prompt: 'Your sleep is…',
    options: [
      { label: 'Sound and efficient, I sleep well and wake alert', dosha: 'pitta' },
      { label: 'Light and restless, I wake easily, with busy dreams', dosha: 'vata' },
      { label: 'Deep and long, I love sleep and can wake groggy', dosha: 'kapha' },
    ],
  },
  {
    id: 'q6',
    prompt: 'Your energy moves…',
    options: [
      { label: 'With steady endurance, slow to start, hard to stop', dosha: 'kapha' },
      { label: 'In strong, focused drives; I aim and go', dosha: 'pitta' },
      { label: 'In bursts, quick to start, quick to tire', dosha: 'vata' },
    ],
  },
  {
    id: 'q7',
    prompt: 'Your mind learns and remembers…',
    options: [
      { label: 'Quickly and vividly, and forgets almost as fast, with many ideas at once', dosha: 'vata' },
      { label: 'Sharply, I analyse, organise and remember clearly', dosha: 'pitta' },
      { label: 'Slowly and methodically, but once learned, never forgotten', dosha: 'kapha' },
    ],
  },
  {
    id: 'q8',
    prompt: 'Under stress you tend to…',
    options: [
      { label: 'Intensify, impatience, irritation, sharp words', dosha: 'pitta' },
      { label: 'Withdraw, go quiet and carry it for a long time', dosha: 'kapha' },
      { label: 'Scatter, worry, leap between tasks, sleep poorly', dosha: 'vata' },
    ],
  },
  {
    id: 'q9',
    prompt: 'The weather you dread most is…',
    options: [
      { label: 'Damp and cold, I flourish in warmth and dryness', dosha: 'kapha' },
      { label: 'Cold and wind, I flourish in warmth and stillness', dosha: 'vata' },
      { label: 'Heat and blazing sun, I flourish in coolness', dosha: 'pitta' },
    ],
  },
  {
    id: 'q10',
    prompt: 'Your speech is…',
    options: [
      { label: 'Fast and talkative, I leap between topics', dosha: 'vata' },
      { label: 'Precise and purposeful, I get to the point', dosha: 'pitta' },
      { label: 'Slow and measured, I choose my words', dosha: 'kapha' },
    ],
  },
  {
    id: 'q11',
    prompt: 'When you walk, you are…',
    options: [
      { label: 'Steady and graceful, unhurried', dosha: 'kapha' },
      { label: 'Brisk and purposeful', dosha: 'pitta' },
      { label: 'Quick and light, sometimes erratic', dosha: 'vata' },
    ],
  },
  {
    id: 'q12',
    prompt: 'With decisions and money you…',
    options: [
      { label: 'Decide deliberately and keep a plan, saving comes naturally', dosha: 'pitta' },
      { label: 'Decide slowly and keep things as they are, I hold and keep', dosha: 'kapha' },
      { label: 'Decide quickly and change your mind, money slips through the fingers', dosha: 'vata' },
    ],
  },
];

export type QuizAnswers = Partial<Record<string, Dosha>>;

export interface QuizScores {
  vata: number;
  pitta: number;
  kapha: number;
}

export function tally(answers: QuizAnswers): QuizScores {
  const scores: QuizScores = { vata: 0, pitta: 0, kapha: 0 };
  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (answer) scores[answer] += 1;
  }
  return scores;
}

/**
 * The dominant dosha; ties resolve in the classical enumeration order
 * (vāta, pitta, kapha) so the outcome is deterministic.
 */
export function dominantDosha(scores: QuizScores): Dosha {
  return DOSHAS.reduce((best, dosha) => (scores[dosha] > scores[best] ? dosha : best));
}

export const doshaLabel: Record<Dosha, string> = {
  vata: 'vāta',
  pitta: 'pitta',
  kapha: 'kapha',
};

export const doshaElements: Record<Dosha, string> = {
  vata: 'air & ether',
  pitta: 'fire & water',
  kapha: 'earth & water',
};

export const doshaBlurbs: Record<Dosha, { balanced: string; excess: string; steadied: string }> = {
  vata: {
    balanced: 'lively, imaginative and adaptable; quick as the wind that composes it',
    excess: 'scattered, anxious, dry and sleepless; too much movement in body and mind',
    steadied: 'warmth, routine, oil, grounded food and slow grounding poses',
  },
  pitta: {
    balanced: 'discerning, courageous and bright; the steady flame of understanding',
    excess: 'irritable, overheated and inflamed; fire overflowing its lamp',
    steadied: 'cooling foods, sweetness, moonlight, moderation and forgiving forward folds',
  },
  kapha: {
    balanced: 'patient, compassionate and enduring; the quiet strength of the earth',
    excess: 'heavy, sluggish and clinging; too much of a good thing staying put',
    steadied: 'movement, spice, variety, lightness and warming invigorating poses',
  },
};

export function isDosha(value: unknown): value is Dosha {
  return typeof value === 'string' && (DOSHAS as readonly string[]).includes(value);
}
