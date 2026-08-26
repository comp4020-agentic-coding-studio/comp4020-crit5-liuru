import { Game } from "./game.ts";

const stage = document.querySelector<HTMLDivElement>("#stage")!;
const bubbleEl = document.querySelector<HTMLButtonElement>("#bubble")!;
const scoreEl = document.querySelector<HTMLDivElement>("#score")!;
const bestEl = document.querySelector<HTMLDivElement>("#best")!;
const flashEl = document.querySelector<HTMLDivElement>("#flash")!;

const MIN_SIZE = 22;
const MAX_SIZE = 72;
const RESTART_DELAY = 1100;

const game = new Game();
let lastTime: number | null = null;
let restartAt: number | null = null;
let stageWidth = 0;
let stageHeight = 0;

function measure(): void {
  const rect = stage.getBoundingClientRect();
  stageWidth = rect.width;
  stageHeight = rect.height;
}

function sizeFor(age: number, lifetime: number): number {
  const remaining = Math.max(0, 1 - age / lifetime);
  return MIN_SIZE + (MAX_SIZE - MIN_SIZE) * remaining;
}

function render(): void {
  const { bubble } = game;
  const size = sizeFor(bubble.age, bubble.lifetime);
  bubbleEl.style.width = `${size}px`;
  bubbleEl.style.height = `${size}px`;
  bubbleEl.style.left = `${bubble.x * stageWidth - size / 2}px`;
  bubbleEl.style.top = `${bubble.y * stageHeight - size / 2}px`;
  scoreEl.textContent = String(game.score);
  bestEl.textContent = game.best > 0 ? `best ${game.best}` : "";
}

function frame(now: number): void {
  if (lastTime === null) lastTime = now;
  const dt = now - lastTime;
  lastTime = now;

  const wasPlaying = game.status === "playing";
  if (wasPlaying) {
    game.update(dt);
  }
  const justEnded: boolean = wasPlaying && game.status === "over";
  if (justEnded) {
    flashEl.textContent = String(game.score);
    flashEl.classList.add("show");
    bubbleEl.classList.add("popped");
    restartAt = now + RESTART_DELAY;
  } else if (!wasPlaying && restartAt !== null && now >= restartAt) {
    flashEl.classList.remove("show");
    bubbleEl.classList.remove("popped");
    game.restart();
    restartAt = null;
  }

  render();
  requestAnimationFrame(frame);
}

bubbleEl.addEventListener("click", () => {
  if (game.status !== "playing") return;
  game.catch();
  render();
});

window.addEventListener("resize", measure);
measure();
render();
requestAnimationFrame(frame);
