import { Enemy } from "./Enemy";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { Vector2 } from "./Vector2";

export class Game {
  gameContext: GameContext;
  lastTime: number;
  gameObjects: GameObject[];
  player: Player;
  enemies: Enemy[];

  constructor() {
    this.gameContext = GameContext.getInstance();
    this.lastTime = 0;
    this.player = new Player();
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
    this.gameContext.ctx.fillStyle = "black";
    this.gameContext.ctx.fillRect(
      0,
      0,
      this.gameContext.ctx.canvas.width,
      this.gameContext.ctx.canvas.height
    );

    requestAnimationFrame(this.animate);
  }

  private animate = (currentTime: number): void => {
    this.gameContext.deltaTimeSeconds = (currentTime - this.lastTime)/1000;
    this.lastTime = currentTime;

    const ctx = this.gameContext.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let gameObject of this.gameObjects) {
      gameObject.draw();
      gameObject.update();
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
