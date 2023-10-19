export class GameContext {
  private static instance: GameContext;
  private _deltaTime: number = 0;
  private _ctx?: CanvasRenderingContext2D;
  userInput = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  private constructor() {
    if (!GameContext.instance) {
      GameContext.instance = new GameContext();
    }
    return GameContext.instance;
  }

  getInstance(): GameContext {
    return GameContext.instance;
  }

  getDeltaTime(): number {
    return this._deltaTime;
  }

  setDeltaTime(deltaTime: number): void {
    this._deltaTime = deltaTime;
  }

  getCtx(): CanvasRenderingContext2D {
    if (!this._ctx) throw Error("You forgot to set the canvas context in the GameContext, dummy");
    return this._ctx;
  }

  setCtx(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
}