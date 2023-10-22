import { GameObject } from "./GameObject";

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