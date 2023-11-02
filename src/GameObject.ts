import { Vector2 } from "./Vector2";

export abstract class GameObject {
  abstract position: Vector2;

  abstract run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void;
}
