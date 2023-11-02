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

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(deltaTimeSeconds);
    this.draw(ctx);
  }

  update(deltaTimeSeconds: number): void {
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'limegreen';
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

export class Splat {
  particles: SplatParticle[];
  origin: Vector2;
  particleSpeed = 300;
  active: boolean = true;
  lifetime: number = 0.25;
  elapsed: number = 0;
  
  constructor(origin: Vector2) {
    this.origin = origin;
    this.particles = [];
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const vel = new Vector2(Math.cos(angle), Math.sin(angle)).scale(this.particleSpeed);
      this.particles.push(new SplatParticle(this.origin.copy(), vel));
    }
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number) {
    for (let particle of this.particles) {
      particle.run(ctx, deltaTimeSeconds);
    }
    this.elapsed += deltaTimeSeconds;
    if (this.elapsed > this.lifetime) this.active = false;
  }
}