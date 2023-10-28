import { Enemy } from "./Enemy";

export class Missile {
  active: boolean = true;

  constructor() {}

  update(): void {

  }

  draw(): void {

  }

  detectCollision(enemy: Enemy): boolean {
    return false;
  }
}