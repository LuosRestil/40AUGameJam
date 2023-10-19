import { GameContext } from "./GameContext";
import { Vector2 } from "./Vector2";

export interface GameObject {
  gameContext: GameContext;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  rotation: number;

  update(): void;
  draw(): void;
}
