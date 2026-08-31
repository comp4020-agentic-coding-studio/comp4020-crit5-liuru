# A game

The breakthrough wasn't in the code, it was in what code review could never
have shown me. `game.ts` looked complete from the diff alone: a bubble drifts,
shrinks, and either gets caught or pops — clean, DOM-free, fully tested against
its own class. Reading it, there was nothing to fix. Only playing several
rounds up to a real high score exposed the problem: a caught bubble respawned
at a fresh random point across the whole stage, and by the time the score was
high enough to make the lifetime short, a respawn on the far side of a wide
desktop viewport left no real time to reach it. The game wasn't testing
tracking skill at that point, it was testing spawn luck. Fixing it — making the
next bubble continue from wherever the last one was caught — took four lines,
but finding it took actually playing the thing to the point where the flaw
would surface, which is a different activity from reading `game.ts` end to
end and confirming the rules it states are the rules it enforces.

That's the change to who I want to be as a developer: tests and code review
answer "does this do what I said it does," but they can't answer "does this
feel fair," and treating a green check suite as proof of a good game is a
category error I could feel myself wanting to make. The instinct to stop once
`pnpm check` is green needs a second, separate instinct next to it — play the
thing, not just the version of it that exists in the diff — and know that the
two are answering genuinely different questions, not the same question twice.
