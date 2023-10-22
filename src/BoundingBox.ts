import { GameContext } from "./GameContext";

export class BoundingBox {
  width: number;
  height: number;
  gameContext: GameContext;
  color: string;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.color = 'limegreen';
    this.gameContext = GameContext.getInstance();
  }

  draw() {
    const ctx = this.gameContext.ctx;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
  }
}