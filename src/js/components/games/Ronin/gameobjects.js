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

class Character extends PhysicsRect2d {
    constructor(rect, mass) {
        super(rect, mass, null);
        this._isAlive = true;
    }

    isAlive() {
        return this._isAlive;
    }

    destroy() {
        this._isAlive = false;
    }

    update(timeDelta) {
        if (!this.isAlive()) return;
        super.update(timeDelta);
    }
    
    draw(context) {
        if (!this.isAlive()) return;
        context.fillStyle = '#0f0f11';
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class Npc extends Character {
    constructor(rect, mass) {
        super(rect, mass);
    }
}

class Player extends Character {
    constructor(rect, mass) {
        super(rect, mass);
        this.colorHex = '#00FF00';
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

    setPosition(point) {
        this.rect.position = point;
    }

    update(timeDelta) {
        // if (this.isRunning) {
        //     this.updateVelocity(
        //         this.velocity.x + MOVE * this.directionX, 
        //         0, 
        //         MAXSPEED);
        // } else {
        //     this.updateVelocity(
        //         Math.round(this.velocity.x * .06 * -Math.sign(this.velocity.x)), 
        //         0, 
        //         MAXSPEED);
        // }

        super.update(timeDelta);
    }
}

export {
    Platform,
    Npc,
    Player,
}