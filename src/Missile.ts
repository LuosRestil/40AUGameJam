import { Enemy } from "./Enemy";

class Missile {
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