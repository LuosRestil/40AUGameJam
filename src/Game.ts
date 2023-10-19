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
    this.gameObjects = [];
    const ship = new Ship(
      new Vector2(
        this.gameContext.ctx.canvas.width / 2,
        this.gameContext.ctx.canvas.height / 2
      ),
      new Vector2(0, 0),
      new Vector2(0, 0),
      0
    );
    this.gameObjects.push(ship);
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
    this.gameContext.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    for (let gameObject of this.gameObjects) {
      gameObject.draw();
      gameObject.update();
    }

    requestAnimationFrame(this.animate);
  };
}
