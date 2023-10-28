import { Enemy } from "./Enemy";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { ParticleSystem } from "./ParticleSystem";
import { Vector2 } from "./Vector2";
import { clamp, drawPoint, screenWrap } from "./utils";

export class Player implements GameObject {
  gameContext: GameContext;
  position: Vector2;
  velocity: Vector2;
  maxVelocity: number;
  acceleration: Vector2;
  rotation: number;
  rotationSpeed: number = Math.PI * 2;
  width: number = 50;
  height: number = 25;
  buttParticles: ParticleSystem;

  constructor() {
    this.gameContext = GameContext.getInstance();
    this.position = new Vector2(
      this.gameContext.ctx.canvas.width / 2,
      this.gameContext.ctx.canvas.height / 2
    );
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.rotation = 0;
    this.maxVelocity = 800;
    this.buttParticles = new ParticleSystem();
  }

  update() {
    const userInput = this.gameContext.userInput;
    if (userInput.up) {
      this.applyPropulsionForce();
      this.buttParticles.active = true;
    } else {
      this.buttParticles.active = false;
    }

    // calculate butt position
    const buttPos = new Vector2(
      Math.cos(this.rotation),
      Math.sin(this.rotation)
    )
    .scale(-this.width/2)
    .add(this.position);
    this.buttParticles.update(
      Date.now(),
      buttPos,
      this.rotation
    );

    if (userInput.left) {
      this.rotation -= this.rotationSpeed * this.gameContext.deltaTimeSeconds;
    }
    if (userInput.right) {
      this.rotation += this.rotationSpeed * this.gameContext.deltaTimeSeconds;
    }

    this.velocity.add(this.acceleration);
    if (this.velocity.getMagnitude() > this.maxVelocity) {
      this.velocity.setMagnitude(this.maxVelocity);
    }
    this.position.add(
      Vector2.scale(this.velocity, this.gameContext.deltaTimeSeconds)
    );
    this.acceleration.scale(0);
    screenWrap(this);
  }

  draw() {
    const ctx = this.gameContext.ctx;
    this.buttParticles.draw(ctx);

    ctx.save();

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    // body
    ctx.fillStyle = "brown";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    // nose
    ctx.beginPath();
    ctx.arc(this.width / 2, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    // right eye
    ctx.beginPath();
    ctx.arc(this.width / 4, this.height / 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width / 4 + 3, this.height / 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // left eye
    ctx.beginPath();
    ctx.arc(this.width / 4, -this.height / 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width / 4 + 3, -this.height / 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // legs
    ctx.fillStyle = "brown";
    ctx.fillRect(0, -this.height / 2 - 10, 5, 10);
    ctx.fillRect(0, this.height / 2, 5, 10);
    ctx.fillRect(-20, -this.height / 2 - 10, 5, 10);
    ctx.fillRect(-20, this.height / 2, 5, 10);
    // tail
    ctx.beginPath();
    ctx.arc(-this.width / 2, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // this.drawBoundingBox();

    ctx.restore();
  }

  collidesWith(enemy: Enemy): boolean {
    const D = Vector2.subtract(enemy.position, this.position); // a vector pointing from player to enemy
    const U = new Vector2(Math.cos(this.rotation), Math.sin(this.rotation)); // a unit vector representing the local x axis of the obb
    const V = new Vector2(-Math.sin(this.rotation), Math.cos(this.rotation)); // a unit vector representing the local y axis of the obb

    const projU = Vector2.dot(D, U);
    const projV = Vector2.dot(D, V);
    const enemyPrime = new Vector2(
      clamp(projU, -this.width / 2, this.width / 2),
      clamp(projV, -this.height / 2, this.height / 2)
    );
    const q = new Vector2(
      this.position.x + enemyPrime.x * U.x + enemyPrime.y * V.x,
      this.position.y + enemyPrime.x * U.y + enemyPrime.y * V.y
    );
    return Vector2.distanceBetween(q, enemy.position) <= enemy.radius;
  }

  private applyPropulsionForce(): void {
    const force = Vector2.fromAngle(this.rotation);
    force.scale(10);
    this.acceleration.add(force);
  }

  private drawBoundingBox(): void {
    const ctx = this.gameContext.ctx;
    ctx.strokeStyle = "limegreen";
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}
