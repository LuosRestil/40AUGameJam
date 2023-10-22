import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { screenWrap } from "./utils";

export class Asteroid implements GameObject {
  position: Vector2;
  radius: number;
  velocity: Vector2;
  rotation: number;
  gameContext: GameContext;

  constructor(
    position: Vector2,
    radius: number,
    velocity: Vector2,
    rotation: number
  ) {
    this.gameContext = GameContext.getInstance();
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.rotation = rotation;
  }

  update() {
    this.position.add(Vector2.scale(this.velocity, this.gameContext.deltaTimeSeconds));
    screenWrap(this);
  }

  draw() {
    const ctx = this.gameContext.ctx;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'limegreen';
    ctx.strokeStyle = 'green';
    ctx.fill();
    ctx.stroke();
  }
}