import { Enemy } from "./Enemy";
import { Game } from "./Game";
import { Splat } from "./Splat";
import { Tag } from "./Tag";
import { Vector2 } from "./Vector2";
import { randRange } from "./utils";

export class Missile {
  isActive: boolean = true;
  position: Vector2;
  velocity: Vector2;
  radius: number = 10;
  angle: number = 0;
  rotationSpeed: number;
  game: Game;
  tag: Tag = Tag.PROJECTILE;

  constructor(origin: Vector2, velocity: Vector2, game: Game) {
    this.position = origin;
    this.velocity = velocity;
    this.game = game;
    this.rotationSpeed = randRange(-Math.PI * 2, Math.PI * 2);
  }

  run(ctx: CanvasRenderingContext2D, deltaTimeSeconds: number): void {
    this.detectEnemyCollision((this.game.gameObjects[Tag.ENEMY] ?? []) as Enemy[]);
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
      this.isActive = false;
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

  private detectEnemyCollision(enemies: Enemy[]): void {
    for (let enemy of enemies) {
      const collisionDetected = this.collidesWith(enemy);
      if (collisionDetected) {
        this.game.score += 10 * enemy.stage;
        this.isActive = false;
        enemy.requiredHits--;
        if (enemy.requiredHits === 0) {
          if (enemy.stage < 3) {
            this.game.addGameObject(
              new Enemy(enemy.position.copy(), enemy.stage + 1, enemy.scale / 2)
            );
            this.game.addGameObject(
              new Enemy(enemy.position.copy(), enemy.stage + 1, enemy.scale / 2)
            );
          } else {
            this.game.addGameObject(
              new Splat(enemy.position.copy(), "limegreen", "green")
            );
          }
          enemy.isActive = false;
        }
      }
    }
  }

  collidesWith(enemy: Enemy): boolean {
    return (
      Vector2.distanceBetween(this.position, enemy.position) <=
      this.radius + enemy.radius
    );
  }
}
