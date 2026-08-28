# Hand-off

## crit5-game: sixth verification pass, still nothing to build, not the finishing run

`comp4020-crit5-liuru`, 118.5h to cutoff at the top of this run (down from
125.5h at the start of the prior run --- about 7h elapsed, consistent with
runs firing on their own cadence). The prompt again gave only hours to
cutoff, with no explicit "this is your last run" --- so per doctrine this
is still a plan/build/deepen run, not a finishing run.

The prior hand-off was explicit: five runs had already independently
confirmed nothing outstanding (fairness, ramp robustness, keyboard/touch,
process narrative, fresh-eyes re-verification), and warned against
inventing a sixth playtest angle just to fill time. Took that at face
value rather than manufacturing new scope. Did a lightweight confirmation
instead of a full playtest: `git fetch origin main` + `git log
origin/main` (already in sync, matching the prior hand-off's claim ---
this time verified rather than assumed), `git status` (clean), and
`pnpm check` (21/21 green, typecheck + build + vitest all pass). No code
touched.

Re-fetched the course source
(`crits/05-game.json`) to double check nothing about the brief itself had
changed since PROCESS.md was drafted --- same spec: losable game, no
instructions, five-minute stranger test, one automated-test rule, one
playtesting-driven design change, PROCESS.md + reflections/crit-5.md
required. All of that is already satisfied by the existing build and
`PROCESS.md` (citing `8da0d75` and `db931ec`), so no drift there either.

## What's still open

- `reflections/crit-5.md` doesn't exist yet. Doctrine reserves writing it
  for the run the prompt calls last --- this is not that run.
- Genuinely nothing outstanding to build, now confirmed across six runs.
  Treat a seventh angle the same way: only act if the prompt itself calls
  this the finishing run, or something genuinely new turns up unprompted
  (a real regression, a spec change in the fetched JSON, drift between
  local and `origin/main`).

## The single most important next action

If this isn't the finishing run yet: nothing to build. Do a cheap
confirmation pass (fetch/status/`pnpm check`, re-read the fetched brief for
drift) rather than either doing nothing or inventing a new playtest angle,
and stop once it comes back clean.

If the prompt calls this run the last one: write `reflections/crit-5.md`
(150--300 words, both standing prompts --- the breakthrough, per
`PROCESS.md`'s own account, is the playtesting-driven respawn fix in
`db931ec`, the one thing code review alone couldn't have found). Skim
`PROCESS.md` once for accuracy, confirm `pnpm check` and
`pnpm check:evidence` are both green (the latter passes once the
reflection file exists), commit, push (tree was already in sync with
`origin/main` at the start of this run), then update both memory files
one final time.
