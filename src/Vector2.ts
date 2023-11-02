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

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  static fromAngle(angle: number, length: number = 1): Vector2 {
    const v = new Vector2(Math.cos(angle), Math.sin(angle));
    v.scale(length);
    return v;
  }

  static distanceBetween(v1: Vector2, v2: Vector2): number {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
  }

  static scale(vector: Vector2, scalar: number): Vector2 {
    return new Vector2(vector.x * scalar, vector.y * scalar);
  }

  static dot(v1: Vector2, v2: Vector2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static unitFromAngle(angle: number) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  static subtract(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }
}
