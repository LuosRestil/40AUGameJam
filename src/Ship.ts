import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Ship implements GameObject {
  gameContext: GameContext;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  rotation: number;

  constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    rotation: number
  ) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.rotation = rotation;
    this.gameContext = GameContext.getInstance();
  }

  update() {
    if (this.gameContext.userInput.up) {
      // move in direction we're facing
      // fire thrusters
    }
    if (this.gameContext.userInput.left) {
      // rotate left
    }
    if (this.gameContext.userInput.right) {
      // rotate right
    }
  }

  draw() {
    this.gameContext.ctx.fillStyle = 'red';
    this.gameContext.ctx.fillRect(100, 100, 100, 100);
  }
}
