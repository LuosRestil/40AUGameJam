import { Enemy } from "./Enemy";
import { Missile } from "./Missile";
import { Player } from "./Player";
import { Splat } from "./Splat";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  player: Player;
  enemies: Enemy[] = [];
  splats: Splat[] = [];
  missiles: Missile[] = [];
  lastTime: number = 0;
  score: number = 0;
  level: number = 1;
  gameOver: boolean = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(this);
    this.spawnEnemies();

    document.addEventListener("keydown", (evt) => {
      if (this.gameOver && evt.key === "r") {
        this.refresh();
      }
    });
  }

  run() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    requestAnimationFrame(this.animate);
  }

  private animate = (currentTime: number): void => {
    const deltaTimeSeconds = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // clear
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let enemy of this.enemies) {
      enemy.run(this.ctx, deltaTimeSeconds);
    }
    this.enemies = this.enemies.filter((enemy) => enemy.active);

    for (let missile of this.missiles) {
      missile.run(this.ctx, deltaTimeSeconds);
    }
    this.missiles = this.missiles.filter((missile) => missile.active);

    for (let splat of this.splats) {
      splat.run(this.ctx, deltaTimeSeconds);
    }
    this.splats = this.splats.filter((splat) => splat.active);

    if (!this.gameOver) {
      this.player.run(this.ctx, deltaTimeSeconds);
    } else {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.showGameOver();
    }

    this.showScore();
    this.showLevel();

    if (!this.gameOver) {
      this.detectPlayerEnemyCollisions();
      this.detectMissileEnemyCollisions();
    }

    if (!this.enemies.length) {
      this.level++;
      this.spawnEnemies();
      this.player.position = new Vector2(
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 2
      );
      this.player.velocity = new Vector2(0, 0);
      this.missiles = [];
    }

    requestAnimationFrame(this.animate);
  };

  private showScore(): void {
    // TODO style, ensure score can't overflow
    // https://stackoverflow.com/questions/40199805/unable-to-use-a-google-font-on-canvas
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    this.ctx.textAlign = "right";
    this.ctx.font = "30px monospace";
    this.ctx.strokeText("Score: " + this.score, this.ctx.canvas.width - 50, 50);
    this.ctx.fillText("Score: " + this.score, this.ctx.canvas.width - 50, 50);
  }

  private showLevel(): void {
    // TODO style
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    this.ctx.textAlign = "left";
    this.ctx.font = "30px monospace";
    this.ctx.strokeText("Level: " + this.level, 50, 50);
    this.ctx.fillText("Level: " + this.level, 50, 50);
  }

  private showGameOver(): void {
    this.ctx.fillStyle = "crimson";
    this.ctx.strokeStyle = "darkred";
    this.ctx.lineWidth = 5;
    this.ctx.font = "64px monospace";
    this.ctx.textAlign = "center";
    this.ctx.strokeText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 - 50
    );
    this.ctx.fillText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 - 50
    );
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.font = "48px monospace";
    this.ctx.strokeText(
      'Press "R" to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
    this.ctx.fillText(
      'Press "R" to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 50
    );
  }

  private detectPlayerEnemyCollisions(): void {
    let collisionDetected = false;
    for (const enemy of this.enemies) {
      if (this.player.collidesWith(enemy)) {
        collisionDetected = true;
      }
    }
    // TODO destroy player, spend lives, handle game over
    if (collisionDetected) {
      this.splats.push(
        new Splat(this.player.position.copy(), "crimson", "darkred")
      );
      this.player.lives--;
      if (this.player.lives < 1) {
        this.gameOver = true;
      } else {
        this.player.position = new Vector2(
          this.ctx.canvas.width / 2,
          this.ctx.canvas.height / 2
        );
        this.player.velocity = new Vector2(0, 0);
      }
    }
  }

  private detectMissileEnemyCollisions(): void {
    for (let missile of this.missiles) {
      for (let enemy of this.enemies) {
        const collisionDetected = missile.collidesWith(enemy);
        if (collisionDetected) {
          this.score += 10 * enemy.stage;

          missile.active = false;
          enemy.requiredHits--;
          if (enemy.requiredHits === 0) {
            if (enemy.stage < 3) {
              this.enemies.push(
                new Enemy(
                  enemy.position.copy(),
                  enemy.stage + 1,
                  enemy.scale / 2
                )
              );
              this.enemies.push(
                new Enemy(
                  enemy.position.copy(),
                  enemy.stage + 1,
                  enemy.scale / 2
                )
              );
            } else {
              this.splats.push(
                new Splat(enemy.position.copy(), "limegreen", "green")
              );
            }
            enemy.active = false;
          }
        }
      }
    }
  }

  private spawnEnemies(): void {
    for (let i = 0; i < this.level * 2; i++) {
      const enemy = new Enemy(new Vector2(0, 0), 1, 1);
      this.enemies.push(enemy);
    }
  }

  refresh(): void {
    this.enemies = [];
    this.splats = [];
    this.lastTime = 0;
    this.score = 0;
    this.level = 1;
    this.spawnEnemies();
    this.player.position = new Vector2(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
    this.player.velocity = new Vector2(0, 0);
    this.gameOver = false;
  }
}
