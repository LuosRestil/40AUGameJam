import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Missile } from "./Missile";
import { ButtParticleSystem } from "./ButtParticleSystem";
import { Vector2 } from "./Vector2";
import { clamp, screenWrap } from "./utils";
import { Game } from "./Game";
import { Splat } from "./Splat";
import { Tag } from "./Tag";

type PlayerInput = {
  up: boolean;
  left: boolean;
  right: boolean;
};

export class Player implements GameObject {
  position: Vector2;
  velocity: Vector2;
  maxVelocity: number;
  acceleration: Vector2;
  rotation: number;
  rotationSpeed: number = Math.PI * 2;
  width: number = 50;
  height: number = 25;
  buttParticles: ButtParticleSystem;
  input: PlayerInput = {
    up: false,
    left: false,
    right: false,
  };
  missileSpeed: number = 200;
  propulsionForce: number = 1000;
  game: Game;
  // lives: number = 1;
  isActive = true;
  tag: Tag = Tag.PLAYER;

  constructor(game: Game) {
    this.game = game;
    this.position = new Vector2(
      game.ctx.canvas.width / 2,
      game.ctx.canvas.height / 2
    );
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.rotation = 0;
    this.maxVelocity = 800;
    this.buttParticles = new ButtParticleSystem();
    this.addEventListeners();
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.update(ctx, deltaTimeSeconds);
    this.draw(ctx);
    this.detectEnemyCollisions((this.game.gameObjects[Tag.ENEMY] ?? []) as Enemy[]);
  }

  update(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number) {
    this.handleMovementInput(deltaTimeSeconds);

    const buttPos = this.getButtPos();
    this.buttParticles.update(Date.now(), buttPos, this.rotation);

    this.velocity.add(this.acceleration.scale(deltaTimeSeconds));
    if (this.velocity.getMagnitude() > this.maxVelocity) {
      this.velocity.setMagnitude(this.maxVelocity);
    }
    this.position.add(Vector2.scale(this.velocity, deltaTimeSeconds));

    this.acceleration.scale(0);
    screenWrap(this, ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
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

  private addEventListeners(): void {
    document.addEventListener("keydown", (evt: KeyboardEvent) => {
      if (this.game.gameOver) return;

      const key = evt.key;
      if (key === "ArrowUp" || key === "w") {
        this.input.up = true;
      }
      if (key === "ArrowLeft" || key === "a") {
        this.input.left = true;
      }
      if (key === "ArrowRight" || key === "d") {
        this.input.right = true;
      }
    });

    document.addEventListener("keyup", (evt: KeyboardEvent) => {
      const key = evt.key;
      if (key === "ArrowUp" || key === "w") {
        this.input.up = false;
      }
      if (key === "ArrowLeft" || key === "a") {
        this.input.left = false;
      }
      if (key === "ArrowRight" || key === "d") {
        this.input.right = false;
      }
    });

    this.handleFirePressed = this.handleFirePressed.bind(this);

    document.addEventListener("keydown", this.handleFirePressed);
  }

  private handleFirePressed(evt: KeyboardEvent) {
    if (!evt.repeat && (evt.key === " " || evt.key === "f")) {
      this.fire();
    }
  }

  private collidesWith(enemy: Enemy): boolean {
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
    force.scale(this.propulsionForce);
    this.acceleration.add(force);
  }

  private fire(): void {
    if (this.game.score > 0) this.game.score -= 1;

    const forward = new Vector2(
      Math.cos(this.rotation),
      Math.sin(this.rotation)
    );
    const nosePos = this.getNosePos();
    this.game.addGameObject(new Missile(nosePos, Vector2.scale(forward, this.missileSpeed), this.game));
  }

  private handleMovementInput(deltaTimeSeconds: number) {
    if (this.input.up) {
      this.applyPropulsionForce();
      this.buttParticles.isActive = true;
    } else {
      this.buttParticles.isActive = false;
    }

    if (this.input.left) {
      this.rotation -= this.rotationSpeed * deltaTimeSeconds;
    }
    if (this.input.right) {
      this.rotation += this.rotationSpeed * deltaTimeSeconds;
    }
  }

  private getButtPos(): Vector2 {
    return new Vector2(Math.cos(this.rotation), Math.sin(this.rotation))
      .scale(-this.width / 2)
      .add(this.position);
  }

  private getNosePos(): Vector2 {
    return new Vector2(Math.cos(this.rotation), Math.sin(this.rotation))
      .scale(this.width / 2)
      .add(this.position);
  }

  private detectEnemyCollisions(enemies: Enemy[]) {
    let collisionDetected = false;
    for (const enemy of enemies) {
      if (this.collidesWith(enemy)) {
        collisionDetected = true;
      }
    }

    if (collisionDetected) {
      this.destroy();

      // TODO should you get multiple lives?
      // this.lives--;
      // if (this.lives < 1) {
      //   this.isActive = false;
      //   this.game.gameOver = true;
      // } else {
      //   this.position = new Vector2(
      //     this.game.ctx.canvas.width / 2,
      //     this.game.ctx.canvas.height / 2
      //   );
      //   this.velocity = new Vector2(0, 0);
      // }
    }
  }

  private destroy() {
    this.game.addGameObject(new Splat(this.position.copy(), "crimson", "darkred"));
    this.isActive = false;
    this.game.gameOver = true;
    document.removeEventListener("keydown", this.handleFirePressed);
  }
}
