import { GameContext } from "./GameContext";
import { Vector2 } from "./Vector2";
import { randRange } from "./utils";

export class Particle {
  position: Vector2;
  velocity: Vector2;
  lifetime: number;
  active: boolean;
  lastTime: number;
  createdTime: number;
  color: string;
  size: number;
  shape: string;
  colors: string[] = ["cyan", "magenta", "yellow", "lime", "red", "orange"];
  gameContext: GameContext;

  constructor(
    position: Vector2,
    velocity: Vector2,
    size: number,
    shape: string,
    lifetime: number,
    createdTime: number
  ) {
    this.position = position;
    this.velocity = velocity;
    this.lifetime = lifetime;
    this.active = true;
    this.createdTime = createdTime;
    this.lastTime = createdTime;
    const randIdx = Math.floor(Math.random() * this.colors.length);
    this.color = this.colors[randIdx];
    this.size = size;
    this.shape = shape;
    this.gameContext = GameContext.getInstance();
  }

  update(timestamp: number) {
    const deltaTimeSeconds = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.position.x += this.velocity.x * deltaTimeSeconds;
    this.position.y += this.velocity.y * deltaTimeSeconds;

    if (timestamp - this.createdTime > this.lifetime) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export class ParticleSystem {
  particles: Particle[] = [];
  spawnRate: number = 5;
  lastSpawnTime: number = 0;
  active: boolean = false;

  constructor() {}

  update(timestamp: number, origin: Vector2, playerAngle: number) {
    const deltaTime = timestamp - this.lastSpawnTime;
    if (deltaTime > this.spawnRate && this.active) {
      this.spawnParticle(timestamp, origin, playerAngle);
      this.lastSpawnTime = timestamp - (timestamp % this.spawnRate);
    }

    this.particles = this.particles.filter((particle) => particle.active);
    for (let particle of this.particles) {
      particle.update(timestamp);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let particle of this.particles) {
      particle.draw(ctx);
    }
  }

  spawnParticle(timestamp: number, origin: Vector2, playerAngle: number) {
    const angleVariance = Math.PI / 6;
    const minAngle = playerAngle - angleVariance;
    const maxAngle = playerAngle + angleVariance;
    const angle = randRange(minAngle, maxAngle);
    const speed = 200;
    this.particles.push(
      new Particle(
        new Vector2(origin.x, origin.y),
        new Vector2(Math.cos(angle), Math.sin(angle)).scale(-speed),
        5,
        "square",
        400, // ms
        timestamp
      )
    );
  }
}
