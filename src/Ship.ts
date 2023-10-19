import { Game } from "./Game";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Ship implements GameObject {
  game: Game;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  rotation: number;

  constructor(
    game: Game,
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    rotation: number
  ) {
    this.game = game;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.rotation = rotation;
  }

  update() {}

  draw() {
    this.game.ctx.fillStyle = 'red';
    this.game.ctx.fillRect(100, 100, 100, 100);
  }
}
