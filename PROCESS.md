# Process overview

A single bubble drifts inside a bounded stage, shrinking toward a fixed
lifetime as it goes. Click it before it disappears and it scores a point, then
respawns faster and shorter-lived from wherever it was just caught; miss it and
it pops, flashes the round's score, and restarts from zero. There is no
how-to-play text anywhere — the bubble itself, alone on an otherwise empty
stage, is the whole affordance. One mechanic (catch it in time), one escalating
knob (speed up, lifetime down as score rises) is meant to be the entire game:
easy to read in the first three seconds, harder to keep up with the longer a
round runs.

## The moments that mattered

1. **Deciding where the one required rule lived.** The spec asks for a rule
   under "a focused automated test" — testing a round's win/loss condition
   meant it couldn't live tangled up in DOM/`requestAnimationFrame` code.
   `game.ts` is a plain, DOM-free class (`Game`, with `update`/`catch`/
   `restart`) that `main.ts` only renders and drives; `spec/game.test.ts` tests
   "a missed bubble ends the round, a caught one keeps it going" directly
   against that class, no browser needed. Building the logic this way from the
   start, rather than retrofitting a test around DOM state afterwards, is what
   made the rule testable at all.
   [`8da0d75`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-liuru/commit/8da0d75)

2. **The playtesting-driven fix, not a code-review one.** Playing several
   rounds through to a high score surfaced a fairness problem no amount of
   reading the code would have: a caught bubble respawned at a fresh random
   point across the whole stage, but the lifetime that comes with a high score
   is short enough that a spawn on the far side of a wide desktop viewport
   left no real time to reach it. A high score was measuring spawn luck, not
   tracking skill. The fix makes the next bubble continue from wherever the
   last one was caught, so distance-to-target stays roughly constant as the
   game speeds up instead of growing with stage size at exactly the moment
   there's least time to spare. This is the change the spec means by "one
   change driven by playtesting rather than code review" — nothing about it
   was visible from `game.ts` alone until an actual round exposed it.
   [`db931ec`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-liuru/commit/db931ec)

3. **Checking modality, not just difficulty.** Once the mechanic and its ramp
   held up under repeated mouse-click playtesting, the open question was
   whether "no tutorial" also held for a player who never touches a mouse. The
   bubble element is a real `<button>` with no bespoke keydown/touch handling
   in `main.ts`, so tabbing to it and pressing Enter or Space scores a point
   for free from native button semantics, and a touch-equivalent click on the
   390×844 marking viewport works the same way. Confirming this needed no code
   change — it confirmed the opening choice to use a plain `<button>` rather
   than a styled `<div>` was the one paying off, not a gap to patch.

## What stayed deliberately unbuilt

The brief invites "two mechanics that interact" as the harder, better move;
this stayed at one on purpose. The escalating speed/lifetime ramp is the
existing mechanic's own difficulty curve, not a second mechanic, and stacking
a second toy on top risked diluting the ten-second read the no-tutorial rule
asks for. Whether the single mechanic still holds attention for the full five
minutes is a crit-floor question, not one a solo playtest run can settle.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that a
reflection entry the marker reads is in `reflections/`, and that your
`CLAUDE.md` is there --- before a marker ever opens the file. It checks that
your map is traceable, not that it is good: the marker judges whether your
small, deliberately chosen set of moments shows real judgement and reflection. A
green check is not a substitute for that curation.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
