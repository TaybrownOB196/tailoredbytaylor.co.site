import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Meter from '../../../lib/gaming/ui/Meter';
import Rect from '../../../lib/gaming/Rect';
import Vector2d from '../../../lib/gaming/Vector2d';
import { Point2d } from '../../../lib/gaming/common';

const MAXSPEED = 100;
const JUMP = 100;
const MOVE = 8;
const GRAVITY = .2;
const DRAG = .07;

const RIGHT = 1;
const LEFT = -1;

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
        super(rect, mass, GRAVITY);
        // super(rect, mass, null);
        this._isAlive = true;
        this.isHalting = false;
        this.isChangeDirection = false;
        this.colorHex = '#000';
        this.direction = 0;
    }

    isAlive() { return this._isAlive; }
    destroy() { this._isAlive = false; }

    handleCollisions(others, gameRect) {
        this.isGrounded = false;
        if (others && others.length > 0) {
            for (let other of others) {
                let result = this.rect.checkCollision(other.rect);
            
                this.rect.position.x -= result.normal.x * result.depth/2;
                this.rect.position.y -= result.normal.y * result.depth/2;
                
                other.rect.position.x += result.normal.x * result.depth/2;
                other.rect.position.y += result.normal.y * result.depth/2;
            }
        }
        
        if (this.rect.position.y + this.rect.height >= gameRect.height) {
            this.isGrounded = true;
            this.velocity.y = 0;
            this.rect.position.y = gameRect.height - this.rect.height;
        }
    }

    jump() {
        if (!this.isGrounded) return;

        this.setVelocity(new Vector2d(this.velocity.x, -JUMP));
        this.isGrounded = false;
    }

    sprint(direction) {
        console.log(this.velocity.x, this.velocity.y)
        this.isChangeDirection = this.direction != direction;
        this.direction = direction;
        if (this.isChangeDirection) {
            this.setVelocity(new Vector2d(0, this.velocity.y));
        }

        this.setVelocity(new Vector2d(MOVE * this.direction, this.velocity.y));
        // this.updateVelocity(MOVE * this.direction + this.velocity.x, 0, MAXSPEED);

        this.isHalting = false;
        console.log(this.velocity.x, this.velocity.y)
    }

    halt() {
        this.isHalting = true;
    }

    setPosition(point) {
        this.rect.position = point;
    }

    draw(context) {
        if (!this.isAlive()) return;
        context.fillStyle = this.isHalting ? '#0000ff' : this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }

    update() {
        if (!this.isAlive()) return;

        if (this.useGravity && !this.isGrounded) {
            this.updateVelocity(0, this.gravity * this.mass, MAXSPEED);
        }

        if (this.isHalting) {
            // let dir = this.isChangeDirection ? this.direction * -1 : this.direction;
            let ceil = Math.ceil(this.velocity.x);
            this.velocity.x = (ceil == 1 || ceil == 0) ? 0 : this.velocity.x - (this.velocity.x * DRAG);
            if (this.velocity.x == 0) {
                this.isHalting = false;
            }
        }

        this.setPosition(new Point2d(
            this.rect.position.x + this.velocity.x,
            this.rect.position.y + this.velocity.y));
    }
}

class Npc extends Character {
    constructor(rect, mass) {
        super(rect, mass);
        this.colorHex = '#0f0f11';
    }
}

class Player extends Character {
    constructor(rect, mass) {
        super(rect, mass);
        this.isRunning = false;
        this.directionX = 0;
        this.maxJumpCount = 2;
        this.jumpCount = 0;
    }
}

export {
    Platform,
    Npc,
    Player,
}