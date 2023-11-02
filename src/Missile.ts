import { Enemy } from "./Enemy";
import { Vector2 } from "./Vector2";
import { randRange } from "./utils";

export class Missile {
  active: boolean = true;
  position: Vector2;
  velocity: Vector2;
  radius: number = 10;
  angle: number = 0;
  rotationSpeed: number;

  constructor(origin: Vector2, velocity: Vector2) {
    this.position = origin;
    this.velocity = velocity;
    this.rotationSpeed = randRange(-Math.PI * 2, Math.PI * 2);
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(ctx, deltaTimeSeconds);
    this.draw(ctx);
  }

  update(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));
    // check for out of bounds
    const canvas = ctx.canvas;
    if (
      this.position.x > canvas.width ||
      this.position.y > canvas.height ||
      this.position.x < 0 ||
      this.position.y < 0
    ) {
      this.active = false;
    }
    this.angle += this.rotationSpeed * deltaTimeSeconds;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = "chocolate";
    ctx.fillStyle = "burlywood";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "saddlebrown";
    ctx.beginPath();
    ctx.arc(2, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-5, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  collidesWith(enemy: Enemy): boolean {
    return (
      Vector2.distanceBetween(this.position, enemy.position) <=
      this.radius + enemy.radius
    );
  }
}
