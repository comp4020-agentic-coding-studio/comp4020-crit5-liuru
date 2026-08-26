import { describe, expect, it } from "vitest";
import { Game } from "../game.ts";

// The one rule this week's spec asks to put under test: a bubble left
// unclicked ends the round once its lifetime elapses, and catching it in
// time keeps play going instead.
describe("game: a missed bubble ends the round", () => {
  it("stays playing right up to the bubble's lifetime, then ends", () => {
    const game = new Game(() => 0.5);
    const lifetime = game.bubble.lifetime;

    game.update(lifetime - 1);
    expect(game.status).toBe("playing");

    game.update(2);
    expect(game.status).toBe("over");
  });

  it("records the round's score as the best once the round ends", () => {
    const game = new Game(() => 0.5);
    game.update(100);
    game.catch();
    game.update(game.bubble.lifetime + 1);

    expect(game.status).toBe("over");
    expect(game.best).toBe(1);
  });

  it("catching the bubble before it expires scores a point and continues", () => {
    const game = new Game(() => 0.5);
    game.update(100);
    game.catch();

    expect(game.status).toBe("playing");
    expect(game.score).toBe(1);
  });

  it("a finished round can restart from zero", () => {
    const game = new Game(() => 0.5);
    game.update(game.bubble.lifetime + 1);
    expect(game.status).toBe("over");

    game.restart();
    expect(game.status).toBe("playing");
    expect(game.score).toBe(0);
  });
});
