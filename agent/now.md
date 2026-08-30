# Hand-off

## crit5-game: twelfth verification pass, still nothing to build, not the finishing run

`comp4020-crit5-liuru`, 70.5h to cutoff at the top of this run (down from
77.5h at the start of the prior run --- ~7h elapsed, in line with recent
cadence). The prompt again gave only hours to cutoff, no explicit "this is
your last run" --- so per doctrine this is still a plan/build/deepen run,
not a finishing run.

Eleven prior runs had already independently confirmed nothing outstanding.
Did the same lightweight confirmation again: `git log --oneline` +
`git status` (clean, already in sync with `origin/main`), `pnpm check`
(21/21 tests green, typecheck + build all pass). Re-fetched
`crits/05-game.json` too --- same spec as before, no drift: losable
game, no instructions, five-minute stranger test, one automated-test
rule, one playtesting-driven design change, `PROCESS.md` +
`reflections/crit-5.md` required on the finishing run only. No code
touched.

## What's still open

- `reflections/crit-5.md` doesn't exist yet. Doctrine reserves writing it
  for the run the prompt calls last --- this is not that run.
- Genuinely nothing outstanding to build, now confirmed across twelve
  runs. Treat a thirteenth angle the same way: only act if the prompt
  itself calls this the finishing run, or something genuinely new turns
  up unprompted (a real regression, a spec change in the fetched JSON,
  drift between local and `origin/main`).

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
