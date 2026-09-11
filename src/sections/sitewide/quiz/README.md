# Dosha quiz module (Phase 2, sitewide)

The dosha questionnaire island at `/quiz/`. Twelve questions, one per step,
client-side scoring into a dominant dosha, and a result saved to the shared
localStorageStore that the meals planner and the meals / yoga / ayurveda
filters read. Sitewide module: `parent: null`, so it appears in the footer
"Explore"-adjacent surfaces via the registry, never in the pillar navbar.

## Map

```
quiz/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── lib/questions.ts      # questions + scoring, pure, client-safe
├── components/Quiz.ts    # island: wizard + scoring + persistence
└── pages/Quiz.astro      # /quiz/ (server renders every question as a form)
```

## localStorage contract (shared store key)

Created via `createStore('quiz-result', 1)` from
`src/shared/utils/localStorageStore`, full key `satvikfyi:v1:quiz-result`:

| Scope | Owner | Shape | Used by |
| --- | --- | --- | --- |
| `quiz-result` | this module | `{ dosha: 'vata' \| 'pitta' \| 'kapha', date: string }` (date = ISO timestamp of the save) | planner island (read), meals/yoga/ayurveda filter islands (read) |

**Invariant:** only this module writes the key. Every other module reads it
at most. The shape must stay `{ dosha, … }`-compatible; the planner reads
`quiz.dosha` only; bump the store `version` (orphaning old data) if the
shape ever changes meaningfully.

## Behaviour

- **No-JS fallback:** the server renders every question as plain
  fieldset/radio groups; a `<noscript>` scoring key maps each option letter
  to its dosha so the quiz can be tallied by hand.
- **Wizard:** the island hides all-but-one step, auto-advances on
  selection, offers Back/Next, and announces progress (`role="status"`).
- **Scoring:** counts per dosha; ties resolve in the classical enumeration
  order (vāta, pitta, kapha) so results are deterministic.
- **Result:** dominant dosha + per-dosha counts + a plain-language reading;
  links out to each enabled module with `?dosha=` appended client-side.
- **Returning visitors:** a saved result opens straight to the answer, with
  retake / forget buttons. "Forget my result" removes the key.

## Cross-module wiring

Links out are plain URLs only, rendered server-side while the target module
is `enabled` (via `isModuleEnabled`) and personalised client-side by
appending `?dosha=`. No module imports another module's code.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from the
footer and sitemap; `/quiz/` redirects to `/`. No other module breaks, 
they merely show their generic defaults (the planner falls back to its
URL-param/saved-plan/sample logic).
