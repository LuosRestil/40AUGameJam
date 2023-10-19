import { Game } from "./Game";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

class Asteroid implements GameObject {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  rotation: number;
  gameContext: GameContext;

  constructor(
    game: Game,
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    rotation: number
  ) {
    this.gameContext = GameContext.getInstance();
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.rotation = rotation;
  }

  update() {}

  draw() {}
}