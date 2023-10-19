import { GameObject } from "./GameObject";
import { Ship } from "./Ship";
import { Vector2 } from "./Vector2";

export class Game {
  ctx: CanvasRenderingContext2D;
  deltaTime: number;
  lastTime: number;
  gameObjects: GameObject[];
  ship: Ship;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.deltaTime = 0;
    this.lastTime = 0;
    this.gameObjects = [];
    this.ship = new Ship(
      this, 
      new Vector2(ctx.canvas.width/2,
      ctx.canvas.height/2),
      new Vector2(0, 0),
      new Vector2(0, 0),
      0
    );
  }
  
  run() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    requestAnimationFrame(this.animate);
  }

  private animate = (currentTime: number): void => {
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.ship.update();
    this.ship.draw();

    requestAnimationFrame(this.animate);
  }
}
