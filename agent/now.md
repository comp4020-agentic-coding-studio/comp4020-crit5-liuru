# Hand-off

## crit5-game: drafted the real PROCESS.md, still not the finishing run

`comp4020-crit5-liuru`, 136.5h to cutoff at the top of this run. Three prior
runs had already exhausted the solo-playtest angles that mattered (spawn-
respawn fairness, high-score ramp robustness, keyboard/touch modality) with
no code change indicated; this run's own hand-off named the next honest
step as starting `PROCESS.md` prose early rather than manufacturing a
fourth playtest angle. Did exactly that.

Replaced the `PROCESS.md` template with the real overview: what the game is
(one bubble, catch-before-lifetime-expires, escalating speed/lifetime ramp),
and three cited moments — the test-first split putting `Game` logic in a
DOM-free `game.ts` class so the required rule has a focused test
(`8da0d75`), the playtesting-driven respawn fix that's the literal answer to
the spec's "one change driven by playtesting rather than code review" ask
(`db931ec`, cited plainly per the standing instruction), and the free
keyboard/touch playability confirmed by a prior run (no commit — it needed
no code change, so it's described but not cited as a diff). Added a short
"what stayed deliberately unbuilt" section explaining the one-mechanic
choice against the brief's "two mechanics that interact" invitation.

Verified `node scripts/check-evidence.ts` before committing: it now passes
the `PROCESS.md` half (template gone, both cited SHAs resolve) and fails
only on the still-missing `reflections/crit-5.md`, exactly the expected
state this far from the finishing run. Ran `pnpm check` first to confirm
21/21 still green (doc-only change, unsurprising but confirmed rather than
assumed). Committed (`b1c2ddd`) and pushed to `origin/main` — checked
`git fetch origin main` first and it matched the prior run's last pushed
commit (`f40d717`), so no stale-state surprise.

## What's still open

- `reflections/crit-5.md` doesn't exist yet. Doctrine reserves writing it
  (and the commit/push bundle around it) for the run the prompt calls last
  --- don't write it early even though `PROCESS.md` was fine to draft early.
- No code change is indicated by anything found across four runs now
  (fairness, ramp robustness, keyboard/touch, and this run's process-writing
  pass turned up nothing new either). Treat a fifth solo-playtest angle as
  manufactured scope, not a real gap, unless something genuinely new comes
  up.
- `PROCESS.md`'s three moments may be worth re-reading once more on the
  finishing run in case anything from a run between now and then changes
  the story, but as drafted it's accurate to the repo as it stands.

## The single most important next action

If this isn't the finishing run yet: there is nothing outstanding to build.
`PROCESS.md` is done in substance; the only remaining honest work is
whatever a genuinely new playtest observation turns up, which none of four
runs have produced past keyboard/touch. Don't invent a fifth angle to fill
time --- leaving it alone is the correct call until the finishing run.

If the prompt calls this run the last one: write `reflections/crit-5.md`
(150--300 words, both standing prompts --- the breakthrough, per this run's
draft, is the playtesting-driven respawn fix in `db931ec`, the one thing
code review alone couldn't have found). Skim `PROCESS.md` once for
accuracy, then confirm `pnpm check` and `pnpm check:evidence` are both
green (the latter will pass once the reflection file exists), commit,
`git fetch`/check `origin/main` first, push, then update both memory files
one final time.
