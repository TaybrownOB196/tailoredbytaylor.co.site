import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Meter from '../../../lib/gaming/ui/Meter';
import Rect from '../../../lib/gaming/Rect';
import { Point2d } from '../../../lib/gaming/common';

const MAXSPEED = 1000000;
const JUMP = 800;
const MOVE = 25;
const GRAVITY = 1;

class Platform extends PhysicsRect2d {
    constructor(rect, colorHex) {
        super(rect, 100000, null);
        this.colorHex = colorHex;
    }

    draw(context) {
        context.fillStyle = this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class ArcedProjectile extends PhysicsRect2d {
    constructor(rect, colorHex, mass) {
        super(rect, mass, null);
        this.colorHex = colorHex;
        this.lastTime = 0;
        this.finishTime = 0;
        this.speed = 1000;
        this.ticks = 0;
        this._isAlive = true;
    }

    isAlive() {
        return this._isAlive;
    }

    destroy() {
        this._isAlive = false;
    }

    fire(start, ctrl) {
        this.start = start;
        this.ctrl = ctrl;
        this.end = new Point2d(this.start.x + ctrl.x, this.start.y);
    }

    update(timeDelta) {
        this.ticks += timeDelta;
        if (this.ticks >= this.speed) this.destroy();
        if (!this.isAlive()) return;
        this.rect.position = Point2d.getQuadraticBezierVector(
            this.start, 
            this.ctrl, 
            this.end, 
            this.ticks/this.speed);
        super.update(timeDelta);
    }
    
    draw(context) {
        if (!this.isAlive()) return;
        context.fillStyle = this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class Cursor extends PhysicsRect2d {
    constructor(rect, borderHex) {
        super(rect, 10, null);
        this.borderHex = borderHex;
        this.health = new Meter('#00ff00', 100, 100, 24, 4);
    }

    isAlive() {
        return !this.health.isEmpty();
    }

    takeDamage(value) {
        this.health.updateValue(value);
    }

    setPosition(point) {
        this.rect.position = point;
    }

    draw(context) {
        context.beginPath();
        context.lineWidth = "1";
        context.strokeStyle = this.borderHex;
        context.rect(this.rect.position.x-2, this.rect.position.y, this.rect.width-2, this.rect.height);
        context.stroke();

        this.health.draw(context, 
            new Point2d(
                this.rect.position.x + 4, 
                this.rect.position.y - this.rect.height));
    }
}

class Player extends PhysicsRect2d {
    constructor(rect, colorHex, mass) {
        super(rect, mass, GRAVITY);
        this.colorHex = colorHex;
        this.isRunning = false;
        this.directionX = 0;
        this.maxJumpCount = 2;
        this.jumpCount = 0;
    }

    attack(control) {
        let start = new Point2d(this.rect.position.x, this.rect.position.y);
        let proj = new ArcedProjectile(
            new Rect(start, 8, 8),
            '#00f000', 10);

        proj.fire(start, control);
        return proj;
    }

    jump() {
        // if (this.isGrounded)
        //     this.jumpCount = 1;
        // else
        //     this.jumpCount++;
        // if (this.jumpCount > this.maxJumpCount) return;

        // if (!this.isGrounded) {
        //     // console.log(this.rect.position.y, this.rect.position.y + this.rect.height)
        //     // console.log('not on ground');
        //     // return;
        // }

        if (!this.isGrounded) return;
        this.isGrounded = false;
        this.updateVelocity(0, -JUMP, MAXSPEED);
    }

    run(value) {
        if (!this.isGrounded) return;
        this.isRunning = true;
        this.directionX = value;
    }
    
    stop() {
        this.directionX = 0;
        this.isRunning = false;
    }

    draw(context) {
        context.fillStyle = this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }

    setPosition(point) {
        this.rect.position = point;
    }

    update(timeDelta) {
        if (this.isRunning) {
            this.updateVelocity(
                this.velocity.x + MOVE * this.directionX, 
                0, 
                MAXSPEED);
        } else {
            this.updateVelocity(
                Math.round(this.velocity.x * .06 * -Math.sign(this.velocity.x)), 
                0, 
                MAXSPEED);
        }

        super.update(timeDelta);
    }
}

export {
    Platform,
    Player,
    Cursor
}