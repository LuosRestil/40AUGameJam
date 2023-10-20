export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2): Vector2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subtract(other: Vector2): Vector2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  normalize(): Vector2 {
    const mag = this.getMagnitude();
    this.x /= mag;
    this.y /= mag;
    return this;
  }

  scale(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  setMagnitude(magnitude: number): Vector2 {
    this.normalize().scale(magnitude);
    return this;
  }

  static fromAngle(angle: number, length: number = 1): Vector2 {
    const v = new Vector2(Math.cos(angle), Math.sin(angle));
    v.scale(length);
    return v;
  }
}