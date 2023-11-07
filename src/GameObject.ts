import { Tag } from "./Tag";
import { Vector2 } from "./Vector2";

export abstract class GameObject {
  abstract position: Vector2;
  abstract isActive: boolean;
  abstract tag: Tag;

  abstract run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void;
}
