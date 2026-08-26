# Hand-off

## crit5-game: playtest-driven fix landed, still not the finishing run

`comp4020-crit5-liuru`, 160.5h to cutoff at the top of this run --- still
plan/build/deepen per doctrine, not finish. Continuing from the bubble game
built last run (see git log for the full build).

This run did the one thing the previous hand-off flagged as still open: play
the actual game and let that change something. Started the dev server,
opened it in `agent-browser`, confirmed the tab really was mine, then played
several ways --- rapid `el.click()` runs (never missed, proved nothing about
difficulty since it has zero travel time), then real screen-coordinate
clicks (missed constantly, because each `mouse move`/`mouse down`/`mouse up`
step is its own CLI round-trip with more latency than a real hand). Neither
extreme is a fair proxy for a human, and this is now written up in
`MEMORY.md`. What actually surfaced a real problem was a plain screenshot of
the 1920x1080 opening state plus doing the arithmetic: a caught bubble
respawned at a fresh random point anywhere on a wide stage, while its
lifetime kept shrinking with score --- at higher scores there wasn't enough
time left to travel across the stage to a random spawn, so a high score
depended on spawn-proximity luck rather than tracking skill. Fixed in
`game.ts`'s `spawn()`: a caught bubble now continues from the position it
was caught at (`catch()` passes `{x: this.bubble.x, y: this.bubble.y}` as
the new one's origin) instead of teleporting; initial spawn and `restart()`
still pick a fresh random point, since there's no "previous" position to
continue from there. Confirmed with `eval` that a bubble's position is
identical immediately before and after a catch. `pnpm check` stayed
21/21 green throughout (the existing tests exercise score/status/best, not
spawn position, so nothing needed updating).

Also closed the other open item: `public/card.png` was still the starter's
"Replace this card" placeholder. Rendered a real one at the card's own
1200x630 using the same background gradient and bubble glow as the live
page (built as a standalone HTML file, screenshotted with `agent-browser`
at that exact viewport, no scaling needed) and committed it over the
placeholder.

Commits this run (local only, per doctrine push is reserved for the
finishing run):
- `db931ec` --- game: respawn a caught bubble from its own position
- `3dea944` --- public: replace placeholder link-preview card with the
  game's own art

Verification: `pnpm check` green after the gameplay change; dev server and
browser both shut down cleanly afterwards (had to kill the underlying
`node .../vite.js` process directly --- the `pnpm dev &` job's pid and
`kill %1` didn't reach it in this tool's per-call shell). Console/error
stream clean; saw stray `[astro] Initializing prefetch script` lines in
`agent-browser console` that don't belong to this (non-Astro) project ---
matches the already-documented shared-instance risk in `MEMORY.md`, not a
defect here, confirmed by checking `location.href` still matched.

## What's still open

- `PROCESS.md` and `reflections/crit-5.md` are still template boilerplate.
  Write these only on the run doctrine calls last, and when that run comes,
  `PROCESS.md` must cite the playtest-driven fix above plainly (it's exactly
  the "one change that came from playing the finished game" the spec asks
  for) --- with real commit hashes, not a generic account.
- The spec's "obvious in ten seconds" / "still interesting at five minutes"
  calls are for the Wednesday pod to judge live, not to re-litigate solo.
- Possible further "deepen" without a second mechanic (per
  [[one mechanic, not six toys]]): the drift/shrink/speed-ramp constants in
  `game.ts` are still the only real dials. Worth another honest play session
  before the finishing run to see if the ramp still feels right now that
  respawn is continuous rather than teleporting --- continuous respawn could
  make the game easier overall (no dead travel time), which might mean the
  speed/lifetime ramp constants deserve retuning to keep five-minute
  interest.
- Nothing has been pushed to `origin` yet --- still correct per doctrine
  until this is the finishing run.

## The single most important next action

If this isn't the finishing run yet: play a fresh session against the
now-continuous respawn and judge honestly whether the ramp constants still
feel calibrated, since removing the teleport-and-miss problem changes the
game's actual difficulty curve. If the prompt calls this run the last one:
do the finishing steps in order --- write `PROCESS.md` citing `db931ec`
plainly, write `reflections/crit-5.md` (150--300 words, both standing
prompts), confirm `pnpm check` and `pnpm check:evidence` are both green,
commit, push, then update both memory files one more time.
