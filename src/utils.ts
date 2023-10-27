import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export function screenWrap(go: GameObject): void {
  const canvas = go.gameContext.ctx.canvas;
  if (go.position.x > canvas.width) {
    go.position.x = 0;
  } else if (go.position.y > canvas.height) {
    go.position.y = 0;
  }
  if (go.position.x < 0) {
    go.position.x = canvas.width;
  } else if (go.position.y < 0) {
    go.position.y = canvas.height;
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function drawPoint(ctx: CanvasRenderingContext2D, pt: Vector2, color = 'red', radius = 10) {
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}