import { Asteroid } from "./Asteroid";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Ship } from "./Ship";
import { Vector2 } from "./Vector2";

export class Game {
  gameContext: GameContext;
  lastTime: number;
  gameObjects: GameObject[];

  constructor() {
    this.gameContext = GameContext.getInstance();
    this.lastTime = 0;
    const ship = new Ship();
    this.gameObjects = [];
    this.gameObjects.push(ship);
    this.gameObjects.push(new Asteroid(
      new Vector2(100, 100),
      50,
      new Vector2(100, 100),
      0,
    ));
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

    requestAnimationFrame(this.animate);
  };
}
