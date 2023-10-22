import { BoundingBox } from "./BoundingBox";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { screenWrap } from "./utils";

export class Ship implements GameObject {
  gameContext: GameContext;
  position: Vector2;
  velocity: Vector2;
  maxVelocity: number;
  acceleration: Vector2;
  rotation: number;
  rotationSpeed: number = Math.PI * 2;
  width: number = 100;
  height: number = 100;
  boundingBox: BoundingBox;

  constructor() {
    this.gameContext = GameContext.getInstance();
    this.position = new Vector2(
      this.gameContext.ctx.canvas.width / 2,
      this.gameContext.ctx.canvas.height / 2
    );
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.rotation = 0;
    this.maxVelocity = 800;
    this.boundingBox = new BoundingBox(this.width + 10, this.height + 10);
  }

  update() {
    const userInput = this.gameContext.userInput;
    if (userInput.up) {
      this.applyPropulsionForce();
      // shoot sparkles out rudolph's butt (particle system)
      // NOTE soundtrack is god rest ye merry gentlemen a la marvelous toys
    }
    if (userInput.left) {
      this.rotation -= this.rotationSpeed * this.gameContext.deltaTimeSeconds;
    }
    if (userInput.right) {
      this.rotation += this.rotationSpeed * this.gameContext.deltaTimeSeconds;
    }

    this.velocity.add(this.acceleration);
    if (this.velocity.getMagnitude() > this.maxVelocity) {
      this.velocity.setMagnitude(this.maxVelocity);
    }
    // this.position.add(this.velocity);
    this.position.add(Vector2.scale(this.velocity, this.gameContext.deltaTimeSeconds));
    this.acceleration.scale(0);
    screenWrap(this);
  }

  draw() {
    const ctx = this.gameContext.ctx;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    // body
    ctx.fillStyle = "brown";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    // nose
    ctx.beginPath();
    ctx.arc(this.width / 2, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    // right eye
    ctx.beginPath();
    ctx.arc(this.width / 4, this.height / 4, 12, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width / 4 + 6, this.height / 4, 8, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // left eye
    ctx.beginPath();
    ctx.arc(this.width / 4, -this.height / 4, 12, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width / 4 + 6, -this.height / 4, 8, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    this.boundingBox.draw();
    ctx.restore();
  }

  private applyPropulsionForce(): void {
    const force = Vector2.fromAngle(this.rotation);
    force.scale(10);
    this.acceleration.add(force);
  }
}
