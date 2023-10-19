import { Game } from "./Game";
import { Vector2 } from "./Vector2";

export interface GameObject {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  rotation: number;
  game: Game;

  update(): void;
  draw(): void;
}
