import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { Tag } from "./Tag";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  gameObjects: { [key: string]: GameObject[] } = {};
  lastTime: number = 0;
  score: number = 0;
  level: number = 1;
  gameOver: boolean;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.spawnPlayer();
    this.spawnEnemies();
    this.gameOver = false;

    document.addEventListener("keydown", (evt) => {
      if (this.gameOver && evt.key === "r") {
        this.refresh();
      }
    });
  }

  run() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    requestAnimationFrame(this.animate);
  }

  refresh(): void {
    this.lastTime = 0;
    this.score = 0;
    this.level = 1;
    this.gameObjects = {};
    this.spawnPlayer();
    this.spawnEnemies();
    this.gameOver = false;
  }

  addGameObject(go: GameObject): void {
    this.gameObjects[go.tag] = this.gameObjects[go.tag] ?? [];
    const bucket = this.gameObjects[go.tag];
    if (bucket) bucket.push(go);
    else this.gameObjects[go.tag]
  }

  private animate = (currentTime: number): void => {
    const deltaTimeSeconds = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // clear
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let tag of Object.keys(this.gameObjects)) {
      for (let o of this.gameObjects[tag]) {
        o.run(this.ctx, deltaTimeSeconds);
      }
    }

    for (let tag of Object.keys(this.gameObjects)) {
      this.gameObjects[tag] = this.gameObjects[tag].filter(o => o.isActive);
    }

    if (this.gameOver) {
      this.showGameOver();
    }
    this.showScore();
    this.showLevel();

    if (!this.gameObjects[Tag.ENEMY]?.length) {
      this.level++;
      this.spawnEnemies();
      this.resetPlayer();
    }

    requestAnimationFrame(this.animate);
  };

  private spawnEnemies(): void {
    for (let i = 0; i < this.level * 2; i++) {
      this.addGameObject(new Enemy(new Vector2(0, 0), 1, 1));
    }
  }

  private spawnPlayer(): void {
    const player = new Player(this);
    player.position = new Vector2(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
    player.velocity = new Vector2(0, 0);
    this.addGameObject(player);
  }

  private resetPlayer(): void {
    if (!this.gameObjects[Tag.PLAYER]?.length) return;
    const player = this.gameObjects[Tag.PLAYER][0] as Player;
    player.position = new Vector2(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
    player.velocity = new Vector2(0, 0);
  }

  private showScore(): void {
    // TODO style
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
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
}
