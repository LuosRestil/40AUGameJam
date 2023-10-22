export class GameContext {
  private static instance: GameContext;
  private _deltaTimeSeconds: number = 0;
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

  get deltaTimeSeconds(): number {
    return this._deltaTimeSeconds;
  }

  set deltaTimeSeconds(deltaTimeSeconds: number) {
    this._deltaTimeSeconds = deltaTimeSeconds;
  }

  get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) throw Error("You forgot to set the canvas context in the GameContext, dummy");
    return this._ctx;
  }

  set ctx(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
}