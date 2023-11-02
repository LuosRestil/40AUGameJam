import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { screenWrap } from "./utils";

export class Enemy implements GameObject {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  minVel: number = 20;
  maxVel: number = 120;

  constructor(origin: Vector2, stage: number) {
    this.position = origin;
    this.radius = 75 / stage;
    this.velocity = Vector2.unitFromAngle(Math.random() * Math.PI * 2).scale(
      Math.random() * (this.maxVel - this.minVel) + this.minVel
    );
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(ctx, deltaTimeSeconds);
    this.draw(ctx);
  }

  update(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.position.add(
      Vector2.scale(this.velocity, deltaTimeSeconds)
    );
    screenWrap(this, ctx);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // body
    ctx.fillStyle = "limegreen";
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // left eye white
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(
      this.position.x - this.radius / 3,
      this.position.y - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // left eye pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.position.x - this.radius / 3,
      this.position.y - this.radius / 3,
      this.radius / 7,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // right eye white
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.radius / 3,
      this.position.y - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // right eye pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.radius / 3,
      this.position.y - this.radius / 3,
      this.radius / 7,
      0,
      Math.PI,
      true
    );
    ctx.fill();
    ctx.stroke();
    // mouth
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(this.position.x, this.position.y + this.radius/4, this.radius/2, this.radius/3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
