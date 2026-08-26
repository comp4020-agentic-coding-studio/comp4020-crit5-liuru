# Hand-off

## crit5-game: honest playtest of the continuous-respawn build, no change warranted

`comp4020-crit5-liuru`, 149.5h to cutoff at the top of this run --- still
plan/build/deepen per doctrine, not finish. This run did the thing the last
hand-off flagged as open: played the game again now that a caught bubble
respawns from its own position (`db931ec`) instead of teleporting, and judged
honestly whether the speed/lifetime ramp in `game.ts` still feels calibrated.

Hit the exact CLI-latency trap already documented in `MEMORY.md` on the first
attempt: `open` → `set viewport` → `eval location.href` → `screenshot` took
enough real wall-clock time that the very first bubble (2200ms lifetime) had
already expired, so the first screenshot showed the post-miss flash overlay
(a big "0"), not the opening state --- looked like a missing-bubble bug at
first glance. Reloaded and screenshotted back-to-back with nothing in
between and got the real opening state: a clearly visible glowing bubble,
obvious affordance, at both marking viewports (1920x1080 and 390x844).
Confirms the mechanic itself needs no fix; the near-miss was my own
instrumentation lag, not the game's.

To inspect the high-score end of the ramp without fighting click-travel
latency, drove the score up with `document.querySelector('#bubble').click()`
(a direct DOM dispatch, zero travel time --- doesn't prove hit-fairness but
does exercise the ramp) to score 150. No crash, no NaN sizes, no
out-of-bounds position at that extreme. Reasoned through the actual numbers
rather than trying to "feel" an artificial score reached by scripted
clicking: the old bug was specifically that a random-position respawn could
land far from the cursor while the shrinking lifetime left no time to travel
there --- a fairness problem that only bit once lifetime got short (score
~17+, floored at 650ms). Early game (score 0--~15) already had a generous
2200ms-ish lifetime, so continuous respawn changes nothing there; it only
removes the late-game travel lottery, replacing it with a pure
tracking-a-fast-shrinking-target challenge, which is the harder, better
version of the same mechanic, not an easier one. Conclusion: the ramp
constants (`BASE_LIFETIME`, `LIFETIME_STEP`, `MIN_LIFETIME`, `BASE_SPEED`,
`SPEED_STEP`) don't need retuning on the evidence gathered --- no code
change made this run. `git status` clean throughout; `pnpm check` unchanged
at 21/21.

Also corrected a stale belief from the last hand-off: it stated commits were
"local only, push reserved for the finishing run." `git fetch origin main`
this run shows `fc9eab4` (and everything back to `db931ec`/`3dea944`) is
already on `origin/main` --- so those commits are, in fact, already pushed,
contrary to that note. Not a problem to fix, just don't repeat the "nothing
pushed yet" assumption without checking `git fetch`/`git log origin/main`
first.

Dev server and `agent-browser` both shut down cleanly afterwards (`kill
<pid>` on the vite node process directly, then `agent-browser close`).

## What's still open

- `PROCESS.md` and `reflections/crit-5.md` are still template boilerplate.
  Write these only on the run doctrine calls last. When that run comes,
  `PROCESS.md` must cite the playtest-driven fix in `db931ec` plainly (the
  "one change that came from playing the finished game" the spec asks for),
  with real commit hashes.
- The spec's "obvious in ten seconds" / "still interesting at five minutes"
  calls are for the Wednesday pod to judge live, not to re-litigate solo ---
  this run's playtest only checked the mechanic is intact and robust, not
  whether a human finds five minutes of it fun.
- No further ramp-constant changes are indicated by anything found this run.
  If a future playtest surfaces a real problem (not just an instrumentation
  artifact --- reload-then-immediate-screenshot before trusting any "the
  bubble is missing" observation), that's the trigger to touch `game.ts`
  again, not a scheduled retune.

## The single most important next action

If this isn't the finishing run yet: nothing code-side is currently flagged
as broken, so the next open task is genuinely optional deepening (a second
honest play session closer to the cutoff, or leave it as-is --- doctrine's
"one mechanic, not six toys" argues against adding scope without a concrete
reason). If the prompt calls this run the last one: do the finishing steps
in order --- write `PROCESS.md` citing `db931ec` plainly, write
`reflections/crit-5.md` (150--300 words, both standing prompts), confirm
`pnpm check` and `pnpm check:evidence` are both green, commit, push (check
`git fetch`/`git log origin/main` first --- may already be up to date),
then update both memory files one more time.
