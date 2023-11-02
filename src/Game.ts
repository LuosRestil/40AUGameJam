import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  player: Player;
  enemies: Enemy[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.lastTime = 0;
    this.player = new Player(ctx);
    this.enemies = [];
    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy(new Vector2(0, 0), 1);
      this.enemies.push(enemy);
    }
  }

  run() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );

    requestAnimationFrame(this.animate);
  }

  private animate = (currentTime: number): void => {
    const deltaTimeSeconds = (currentTime - this.lastTime)/1000;
    this.lastTime = currentTime;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.player.run(this.ctx, deltaTimeSeconds);
    for (let enemy of this.enemies) {
      enemy.run(this.ctx, deltaTimeSeconds);
    }
    this.enemies = this.enemies.filter(enemy => enemy.active);
    this.detectMissileAsteroidCollisions();
    this.detectShipAsteroidCollisions();

    requestAnimationFrame(this.animate);
  };

  private detectShipAsteroidCollisions(): void {
    let collisionDetected = false;
    for (const enemy of this.enemies) {
      if (this.player.collidesWith(enemy)) {
        collisionDetected = true;
      }
    }
    if (collisionDetected) console.log('BOOM!');
  }

  private detectMissileAsteroidCollisions(): void {
    for (let missile of this.player.missiles) {
      for (let enemy of this.enemies) {
        const collisionDetected = missile.detectCollision(enemy);
        if (collisionDetected) {
          missile.active = false;
          if (enemy.stage < 3) {
            this.enemies.push(new Enemy(enemy.position.copy(), enemy.stage + 1));
            this.enemies.push(new Enemy(enemy.position.copy(), enemy.stage + 1));
          } else {
            // TODO play explosion
          }
          enemy.active = false;
        }
      }
    }
  }
}
