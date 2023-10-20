import { GameContext } from "./GameContext";

export class BoundingBox {
  width: number;
  height: number;
  gameContext: GameContext;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.gameContext = GameContext.getInstance();
  }

  draw() {
    const ctx = this.gameContext.ctx;
    ctx.strokeStyle = 'limegreen';
    ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
  }
}