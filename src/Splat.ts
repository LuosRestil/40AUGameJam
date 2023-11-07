import { GameObject } from "./GameObject";
import { Tag } from "./Tag";
import { Vector2 } from "./Vector2";

class SplatParticle {
  position: Vector2;
  velocity: Vector2;
  lifetime: number = 1;
  elapsed: number = 0;
  isActive: boolean = true;
  fillColor: string;
  strokeColor: string;

  constructor(position: Vector2, velocity: Vector2, fillColor: string, strokeColor: string) {
    this.position = position;
    this.velocity = velocity;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(deltaTimeSeconds);
    this.draw(ctx);
  }

  update(deltaTimeSeconds: number): void {
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

export class Splat implements GameObject {
  position: Vector2;
  fillColor: string;
  strokeColor: string;
  particles: SplatParticle[] = [];
  particleSpeed = 300;
  isActive: boolean = true;
  lifetime: number = 0.25;
  elapsed: number = 0;
  tag: Tag = Tag.PARTICLE_SYSTEM;
  
  constructor(origin: Vector2, fillColor: string, strokeColor: string) {
    this.position = origin;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const vel = new Vector2(Math.cos(angle), Math.sin(angle)).scale(this.particleSpeed);
      this.particles.push(new SplatParticle(this.position.copy(), vel, this.fillColor, this.strokeColor));
    }
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number) {
    for (let particle of this.particles) {
      particle.run(ctx, deltaTimeSeconds);
    }
    this.elapsed += deltaTimeSeconds;
    if (this.elapsed > this.lifetime) this.isActive = false;
  }
}