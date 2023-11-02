import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  gameObjects: GameObject[];
  player: Player;
  enemies: Enemy[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.lastTime = 0;
    this.player = new Player(ctx);
    this.gameObjects = [];
    this.gameObjects.push(this.player);
    this.enemies = [];
    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy(new Vector2(0, 0), 1);
      this.gameObjects.push(enemy);
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
    for (let gameObject of this.gameObjects) {
      gameObject.run(this.ctx, deltaTimeSeconds);
    }
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
}
