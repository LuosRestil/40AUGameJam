import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { screenWrap } from "./utils";

export class Enemy implements GameObject {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  active: boolean = true;
  minVel: number = 20;
  maxVel: number = 120;
  stage: number;
  scale: number;
  requiredHits: number;
  colors = {
    fill: ["limegreen", "violet", "crimson"],
    stroke: ["green", "rebeccapurple", "firebrick"],
  };

  constructor(origin: Vector2, stage: number, scale: number) {
    this.position = origin;
    this.stage = stage;
    this.scale = scale;
    this.radius = 75 * this.scale;
    this.velocity = Vector2.unitFromAngle(Math.random() * Math.PI * 2).scale(
      Math.random() * (this.maxVel - this.minVel) + this.minVel
    );
    const rand = Math.random();
    if (rand > 0.2) this.requiredHits = 1;
    else if (rand > 0.05) this.requiredHits = 2;
    else this.requiredHits = 3;
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(ctx, deltaTimeSeconds);
    this.draw(ctx);
  }

  update(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));
    screenWrap(this, ctx);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // body
    ctx.shadowBlur = 40/this.requiredHits;
    ctx.shadowColor = this.colors.fill[this.requiredHits - 1];
    ctx.fillStyle = this.colors.fill[this.requiredHits - 1];
    ctx.strokeStyle = this.colors.stroke[this.requiredHits - 1];
    ctx.lineWidth = 3 * this.scale;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
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
    ctx.ellipse(
      this.position.x,
      this.position.y + this.radius / 4,
      this.radius / 2,
      this.radius / 3,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
