import { Asteroid } from "./Asteroid";
import { BoundingBox } from "./BoundingBox";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { drawPoint, screenWrap } from "./utils";

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

  collidesWith(circle: Asteroid): boolean {
    // get closest point to circle
    // transform circle center to local space of oriented bounding box
    let dx = circle.position.x - this.position.x;
    let dy = circle.position.y - this.position.y;
    let localX = dx * Math.cos(this.rotation) - dy * Math.sin(this.rotation);
    let localY = dx * Math.sin(this.rotation) + dy * Math.cos(this.rotation);
    drawPoint(this.gameContext.ctx, new Vector2(this.position.x + localX, this.position.y + localY));
    // CONFIRMED WORKING

    return false;
    // TODO NOT WORKING
    // // clamp transformed position to ship bounds
    // const halfWidth = this.width / 2;
    // const halfHeight = this.height / 2;
    // localX = Math.max(-halfWidth, Math.min(localX, halfWidth));
    // localY = Math.max(-halfHeight, Math.min(localY, halfHeight));

    // // transform closest point back to world space
    // dx = localX * Math.cos(-this.rotation) - localY * (Math.sin(-this.rotation));
    // dy = localX * Math.sin(-this.rotation) + localY * Math.cos(-this.rotation);
    // const closestPoint = new Vector2(this.position.x + dx, this.position.y + dy);
    // // draw closest point
    // this.gameContext.ctx.arc(closestPoint.x, closestPoint.y, 5, 0, Math.PI*2);
    // this.gameContext.ctx.fillStyle = 'yellow';
    // this.gameContext.ctx.fill();

    // const colliding = Vector2.distanceBetween(closestPoint, circle.position) < circle.radius;
    // if (colliding) console.log("COLLIDING");
    // return colliding;    
  }

  private applyPropulsionForce(): void {
    const force = Vector2.fromAngle(this.rotation);
    force.scale(10);
    this.acceleration.add(force);
  }
}
