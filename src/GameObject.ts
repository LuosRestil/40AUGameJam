import { GameContext } from "./GameContext";
import { Vector2 } from "./Vector2";

export abstract class GameObject {
  abstract position: Vector2;
  abstract gameContext: GameContext;

  abstract update(): void;
  abstract draw(): void;
}
