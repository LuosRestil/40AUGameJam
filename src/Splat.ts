import { Vector2 } from "./Vector2";

class SplatParticle {
  position: Vector2;
  velocity: Vector2;
  lifetime: number = 1;
  elapsed: number = 0;
  active: boolean = true;

  constructor(position: Vector2, velocity: Vector2) {
    this.position = position;
    this.velocity = velocity;
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number, fillColor: string, strokeColor: string): void {
    this.update(deltaTimeSeconds);
    this.draw(ctx, fillColor, strokeColor);
  }

  update(deltaTimeSeconds: number): void {
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));
  }

  draw(ctx: CanvasRenderingContext2D, fillColor: string, strokeColor: string): void {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

export class Splat {
  origin: Vector2;
  fillColor: string;
  strokeColor: string;
  particles: SplatParticle[] = [];
  particleSpeed = 300;
  active: boolean = true;
  lifetime: number = 0.25;
  elapsed: number = 0;
  
  constructor(origin: Vector2, fillColor: string, strokeColor: string) {
    this.origin = origin;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const vel = new Vector2(Math.cos(angle), Math.sin(angle)).scale(this.particleSpeed);
      this.particles.push(new SplatParticle(this.origin.copy(), vel));
    }
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number) {
    for (let particle of this.particles) {
      particle.run(ctx, deltaTimeSeconds, this.fillColor, this.strokeColor);
    }
    this.elapsed += deltaTimeSeconds;
    if (this.elapsed > this.lifetime) this.active = false;
  }
}