import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export const applyForce = (target: GameObject, force: Vector2) => {
  target.acceleration.add(force);
}