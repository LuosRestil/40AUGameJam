import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { Splat } from "./Splat";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  player: Player;
  enemies: Enemy[];
  splats: Splat[];
  score: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.lastTime = 0;
    this.player = new Player(this);
    this.enemies = [];
    this.splats = [];
    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy(new Vector2(0, 0), 1, 1);
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

    // clear
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.player.run(this.ctx, deltaTimeSeconds);

    for (let enemy of this.enemies) {
      enemy.run(this.ctx, deltaTimeSeconds);
    }
    this.enemies = this.enemies.filter(enemy => enemy.active);

    for (let splat of this.splats) {
      splat.run(this.ctx, deltaTimeSeconds);
    }
    this.splats = this.splats.filter(splat => splat.active);

    this.showScore();

    this.detectMissileAsteroidCollisions();
    this.detectShipAsteroidCollisions();

    requestAnimationFrame(this.animate);
  };

  private showScore(): void {
    // TODO style, ensure score can't overflow
    // https://stackoverflow.com/questions/40199805/unable-to-use-a-google-font-on-canvas
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.font = "30px monospace";
    this.ctx.strokeText('Score: ' + this.score, this.ctx.canvas.width / 4 * 3, 50);
    this.ctx.fillText('Score: ' + this.score, this.ctx.canvas.width / 4 * 3, 50);
  }

  private detectShipAsteroidCollisions(): void {
    let collisionDetected = false;
    for (const enemy of this.enemies) {
      if (this.player.collidesWith(enemy)) {
        collisionDetected = true;
      }
    }
    // TODO destroy player, spend lives, handle game over
    if (collisionDetected) console.log('BOOM!');
  }

  private detectMissileAsteroidCollisions(): void {
    for (let missile of this.player.missiles) {
      for (let enemy of this.enemies) {
        const collisionDetected = missile.collidesWith(enemy);
        if (collisionDetected) {
          this.score += 10 * enemy.stage;

          missile.active = false;
          if (enemy.stage < 3) {
            this.enemies.push(new Enemy(enemy.position.copy(), enemy.stage + 1, enemy.scale / 2));
            this.enemies.push(new Enemy(enemy.position.copy(), enemy.stage + 1, enemy.scale / 2));
          } else {
            this.splats.push(new Splat(enemy.position.copy()));
          }
          enemy.active = false;
        }
      }
    }
  }
}
