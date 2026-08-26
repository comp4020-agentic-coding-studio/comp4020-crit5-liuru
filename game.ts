// Pure game logic, no DOM: a single bubble drifts inside the unit square and
// shrinks toward a fixed lifetime. Catching it before it expires scores a
// point and spawns a faster, shorter-lived one; missing it ends the round.
export type GameStatus = "playing" | "over";

export interface BubbleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  lifetime: number;
}

const MARGIN = 0.08;
const MIN_LIFETIME = 650;
const BASE_LIFETIME = 2200;
const LIFETIME_STEP = 90;
const BASE_SPEED = 0.06;
const SPEED_STEP = 0.006;

export class Game {
  score = 0;
  best = 0;
  status: GameStatus = "playing";
  bubble: BubbleState;

  constructor(private readonly random: () => number = Math.random) {
    this.bubble = this.spawn();
  }

  // A caught bubble reappears from where it was caught, not a fresh random
  // point: on a wide stage a random respawn can land far from the cursor
  // while the shrinking lifetime leaves no time to travel there, turning a
  // high score into a spawn-luck check rather than a tracking one.
  private spawn(origin?: { x: number; y: number }): BubbleState {
    const angle = this.random() * Math.PI * 2;
    const speed = BASE_SPEED + this.score * SPEED_STEP;
    return {
      x: origin ? origin.x : MARGIN + this.random() * (1 - 2 * MARGIN),
      y: origin ? origin.y : MARGIN + this.random() * (1 - 2 * MARGIN),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0,
      lifetime: Math.max(MIN_LIFETIME, BASE_LIFETIME - this.score * LIFETIME_STEP),
    };
  }

  update(dtMs: number): void {
    if (this.status !== "playing") return;
    const b = this.bubble;
    b.age += dtMs;
    b.x += b.vx * (dtMs / 1000);
    b.y += b.vy * (dtMs / 1000);
    if (b.x < MARGIN || b.x > 1 - MARGIN) {
      b.vx *= -1;
      b.x = Math.min(1 - MARGIN, Math.max(MARGIN, b.x));
    }
    if (b.y < MARGIN || b.y > 1 - MARGIN) {
      b.vy *= -1;
      b.y = Math.min(1 - MARGIN, Math.max(MARGIN, b.y));
    }
    if (b.age >= b.lifetime) {
      this.status = "over";
      this.best = Math.max(this.best, this.score);
    }
  }

  catch(): void {
    if (this.status !== "playing") return;
    this.score += 1;
    this.bubble = this.spawn({ x: this.bubble.x, y: this.bubble.y });
  }

  restart(): void {
    this.score = 0;
    this.status = "playing";
    this.bubble = this.spawn();
  }
}
