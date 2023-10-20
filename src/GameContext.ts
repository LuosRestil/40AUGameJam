export class GameContext {
  private static instance: GameContext;
  private _deltaTime: number = 0;
  private _ctx?: CanvasRenderingContext2D;
  userInput = {
    up: false,
    left: false,
    right: false
  };

  static getInstance(): GameContext {
    if (!GameContext.instance) {
      GameContext.instance = new GameContext();
    }
    return GameContext.instance;
  }

  get deltaTime(): number {
    return this._deltaTime;
  }

  set deltaTime(deltaTime: number) {
    this._deltaTime = deltaTime;
  }

  get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) throw Error("You forgot to set the canvas context in the GameContext, dummy");
    return this._ctx;
  }

  set ctx(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
}