import { GameContext } from "./GameContext";
import { Vector2 } from "./Vector2";

export abstract class GameObject {
  abstract gameContext: GameContext;
  abstract position: Vector2;
  abstract velocity: Vector2;
  abstract rotation: number;

  abstract update(): void;
  abstract draw(): void;
}
