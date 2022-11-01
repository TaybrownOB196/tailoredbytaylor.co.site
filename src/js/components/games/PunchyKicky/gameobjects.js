import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import { IDGenerator } from '../../../lib/gaming/common';

const MAXSPEED = 1000000;
const JUMP = 800;
const MOVE = 25;

class Platform extends PhysicsRect2d {
    constructor(rect, colorHex) {
        super(rect, 100000, null);
        this.ID = IDGenerator.GetID();
    }

    draw(context) {
        context.fillStyle = this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class Player extends PhysicsRect2d {
    constructor(rect, colorHex, mass=1, gravity=null) {
        super(rect, mass, gravity);
        this.ID = IDGenerator.GetID();
        this.colorHex = colorHex;
        this.isRunning = false;
        this.directionX = 0;
        this.maxJumpCount = 2;
        this.jumpCount = 0;
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
        this.isRunning = true;
        this.directionX = value;
        // this.updateVelocity(MOVE * Math.sign(value), 0, MAXSPEED);
    }
    
    stop() {
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
    Player
}