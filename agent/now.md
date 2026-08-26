# Hand-off

## crit5-game: built and verified, not yet finished (this is not the last run)

`comp4020-crit5-liuru`, brief fetched fresh from
`crits/05-game.json`: build a tiny browser game, one mechanic usually
enough, obvious in ten seconds, still interesting at five minutes, no
tutorial anywhere (no modal, no how-to-play page, nothing in the README
standing in for either), a wrong move possible and play ends somewhere, one
rule under a focused automated test, played at both marking viewports. 166.5h
to cutoff at the top of this run, so per doctrine this is plan/build/deepen,
not finish --- no `PROCESS.md` or `reflections/crit-5.md` yet, and nothing
pushed to `origin` (doctrine reserves push for the finishing-steps run).

Repo started from the template's default page (no prior work: one commit,
"Initial commit"). Built a single-screen game, themed on 泡 (bubble, one of
Tang Yin's six as-ifs, continuing [[the running theme]]): a soap-bubble
drifts inside the play area and visually shrinks toward zero as its lifetime
runs out; clicking it before then scores a point and spawns a faster,
shorter-lived one; missing it pops the bubble, flashes that round's score
centered on screen, then auto-restarts from zero after ~1.1s --- no button,
no text telling you what happened, the visual pop + flash + fresh bubble is
the whole feedback loop. Game logic is a DOM-free `Game` class in `game.ts`
(update/catch/restart, normalized 0..1 coordinates) so the one required rule
--- a bubble not caught before its lifetime elapses ends the round --- has a
focused test in `spec/game.test.ts`, independent of real timers/rendering.
`main.ts` just wires that class to the DOM via `requestAnimationFrame`.

Commit: `8da0d75` (local; not yet pushed) --- "game: a bubble that drifts,
shrinks and pops if you miss it".

Verification this run:
- `pnpm check` (tsc, vite build, vitest): 21/21 green.
- Hit one real TS strictness issue (not a memory-worthy generalizable
  lesson, just noted here): narrowing `game.status === "playing"` across a
  `game.update(dt)` call and then re-checking `=== "over"` in a nested `if`
  made `tsc` treat the second check as comparing disjoint literals. Fixed by
  reading `game.status` into a plain `boolean` local instead of relying on
  narrowing surviving the method call.
- Dev server up, `agent-browser` opened, confirmed `location.href` matched
  before trusting anything (this container's browser has drifted to another
  session's tab before). Found and worked around two timing traps specific
  to driving a live game loop through the CLI --- both now in `MEMORY.md`:
  a CDP click on a *moving* button can miss even when the selector and
  command are right, and real wall-clock time during unrelated setup calls
  can already finish/reset a short round before the first screenshot.
  Confirmed the actual click handler and scoring work via a direct
  `el.click()` eval once those were understood.
- Screenshotted at both marking viewports (1920x1080, 390x844): bubble
  renders clearly, glowing and obviously clickable, no text needed. Watched
  the full cycle at desktop viewport: fresh bubble --- catch scores ---
  round times out --- score flashes centered, bubble pops --- auto-restarts
  clean at zero.
- Console/error stream clean beyond normal vite HMR noise. Dev server and
  browser both shut down afterwards; confirmed no stray vite process left
  running.

## What's still open

- The spec's no-tutorial rule and "still interesting at five minutes" and
  "a stranger reaches an ending inside five minutes" are judged by the pod
  playing it cold at the Wednesday crit, same as crit-4 --- not something to
  re-litigate solo.
- The spec explicitly wants "one change you made came from playing the
  finished game rather than reading its code" --- nothing yet in this run
  qualifies (the timing-trap discoveries were testing-methodology fixes, not
  a change to the game itself from a felt playtest reaction). A later run
  should actually play several rounds, form an opinion (does the shrink rate
  read clearly as a countdown? is the speed ramp too gentle/harsh? does the
  1.1s restart delay feel right, or does it drag?), change one constant or
  behaviour because of that feel, and cite it plainly in `PROCESS.md`.
- Possible depth to consider without adding a second mechanic (per
  [[one mechanic, not six toys]]): the drift/shrink/speed-ramp constants in
  `game.ts` are the only real dials --- tuning those, not adding new game
  objects, is the right kind of "deepen."
- `public/card.png` is still the template placeholder; the CLAUDE.md here
  says to replace it and the description meta before shipping. Description
  meta is already replaced; the card image itself is not.
- `PROCESS.md` and `reflections/crit-5.md` are both still template
  boilerplate --- write these only on the run doctrine calls last.

## The single most important next action

Play the actual game for real (several rounds, both viewports) and let that
play change one concrete thing in `game.ts` --- that's the one spec
requirement this run didn't touch. If a later run is a different
deliverable entirely, orient from that repo's own brief and history instead;
this file is shared across all deliverables and gets overwritten by whichever
repo a run touches last.
