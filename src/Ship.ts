import { BoundingBox } from "./BoundingBox";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Ship implements GameObject {
  gameContext: GameContext;
  position: Vector2;
  velocity: Vector2;
  maxVelocity: number = 10;
  acceleration: Vector2;
  rotation: number;
  rotationSpeed: number = Math.PI*2;
  width: number = 100;
  height: number = 100;
  boundingBox: BoundingBox;

  constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    rotation: number
  ) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.rotation = rotation;
    this.boundingBox = new BoundingBox(this.width + 10, this.height + 10);
    this.gameContext = GameContext.getInstance();
  }

  update() {
    const userInput = this.gameContext.userInput;
    if (userInput.up) {
      this.applyPropulsionForce();
      // fire thrusters
    }
    if (userInput.left) {
      this.rotation -= this.rotationSpeed * this.gameContext.deltaTime/1000;
    }
    if (userInput.right) {
      this.rotation += this.rotationSpeed  * this.gameContext.deltaTime/1000;
    }

    this.velocity.add(this.acceleration);
    if (this.velocity.getMagnitude() > this.maxVelocity) {
      console.log('max velocity reached');
      this.velocity.setMagnitude(this.maxVelocity);
    }
    this.position.add(this.velocity);
    this.acceleration.scale(0);
    this.screenWrap();
  }

  draw() {
    const ctx = this.gameContext.ctx;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    // body
    ctx.fillStyle = "brown";
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    // nose
    ctx.beginPath();
    ctx.arc(this.width/2, 0, 10, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    // right eye
    ctx.beginPath();
    ctx.arc(this.width/4, this.height/4, 12, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width/4 + 6, this.height/4, 8, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
    // left eye
    ctx.beginPath();
    ctx.arc(this.width/4, -this.height/4, 12, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width/4 + 6, -this.height/4, 8, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
    this.boundingBox.draw();
    ctx.restore();
  }

  private applyPropulsionForce(): void {
    const force = Vector2.fromAngle(this.rotation);
    force.scale(this.gameContext.deltaTime/1000 * 10);
    this.acceleration.add(force);
  }

  private screenWrap(): void {
    const canvas = this.gameContext.ctx.canvas;
    if (this.position.x > canvas.width) {
      this.position.x = 0;
    } else if (this.position.y > canvas.height) {
      this.position.y = 0;
    }
    if (this.position.x < 0) {
      this.position.x = canvas.width;
    } else if (this.position.y < 0) {
      this.position.y = canvas.height;
    }
  }
}
