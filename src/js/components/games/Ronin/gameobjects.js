import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Rect from '../../../lib/gaming/Rect';
import Vector2d from '../../../lib/gaming/Vector2d';
import { Animation, AnimationFrame } from '../../../lib/gaming/animation';
import { Point2d } from '../../../lib/gaming/common';

const MAXSPEED = 100;
const JUMP = 32;
const MOVE = 8;
const GRAVITY = .02;
const DRAG = .07;
const CHARACTER_DIMS = {x: 128, y: 128}
const DAMAGE = 10;

const ACTION_STATES = {
    STARTUP: 'STARTUP',
    ACTIVE: 'ACTIVE',
    RECOVERY: 'RECOVERY'
};

// class AnimationOrchestrator {
//     constructor(idleAnimation) {
//         this.idleAnimation = idleAnimation;
//         this.queue = new AnimationQueue();
//     }

//     next() {
//         if (this.queue.isEmpty()) {
//             this.queue.push(this.idleAnimation);
//         }

//         let animation = this.queue.getCurrent();
//         if (!animation) throw new Error('no animation to draw');
//     }
// }

class AnimationQueue {
    constructor() {
        this.animationQueue = [];
    }

    isEmpty() { return this.animationQueue.length <= 0; }

    clearQueue() {
        this.animationQueue = [];
    }

    getCurrent() {
        return this.animationQueue[0];
    } 

    push(animation, clearLesserOrder = false) {
        if (clearLesserOrder) {
            this.animationQueue = this.animationQueue.filter((anim) => { return anim.order >= animation.order });
        }

        this.animationQueue.push(animation);
    }
}

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

class Weapon {
    constructor(name, range, weight) {
        this.name = name;
        this.range = range;
        this.weight = weight;
    }

    getDamage() {
        return DAMAGE;
    }
}

class WeaponFactory {
    static getSword() {
        return new Weapon('sword', 10, 50);
    }
    static getClub() {
        return new Weapon('club', 10, 50);
    }
    static getAxe() {
        return new Weapon('axe', 10, 50);
    }
    static getPolearm() {
        return new Weapon('staff', 10, 50);
    }
}

class Character extends PhysicsRect2d {
    constructor(rect, mass, showDebug) {
        super(rect, mass, GRAVITY);
        this._isAlive = true;
        this.isHalting = false;
        this.isChangeDirection = false;
        this.colorHex = '#000';
        this.direction = 0;
        this.showDebug = showDebug;
        this.weapon = WeaponFactory.getSword();
        this.animationQueue = new AnimationQueue();
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

    attack() {
        console.log(this.weapon);
        console.log(this.weapon.getDamage())
    }

    jump() {
        if (!this.isGrounded) return;

        this.setVelocity(new Vector2d(this.velocity.x, -JUMP));
        this.isGrounded = false;
    }

    sprint(direction) {
        if (!this.isGrounded) return;
        this.isChangeDirection = this.direction != direction;
        this.direction = direction;
        if (this.isChangeDirection) {
            this.setVelocity(new Vector2d(0, this.velocity.y));
        }

        this.setVelocity(new Vector2d(MOVE * this.direction, this.velocity.y));

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

        if (this.spritesheet) {
            if (this.direction == 1) {
                this.spritesheet.draw(context, this.rect, new Rect(new Vector2d(0,0), CHARACTER_DIMS.x, CHARACTER_DIMS.y));
    
            } else {
                this.spritesheet.draw(context, this.rect, new Rect(new Vector2d(CHARACTER_DIMS.x,0), CHARACTER_DIMS.x, CHARACTER_DIMS.y));
            }
        } else {
            context.fillStyle = this.isHalting ? '#0000ff' : this.colorHex;
            context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        }
        
        if (this.showDebug) {
            context.strokeStyle = '#00ff00';
            context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        }
    }

    update() {
        if (!this.isAlive()) return;

        if (this.useGravity && !this.isGrounded) {
            this.updateVelocity(0, this.gravity * this.mass, MAXSPEED);
        }

        if (this.isHalting) {
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
    constructor(rect, mass, showDebug=false) {
        super(rect, mass, showDebug);
        this.colorHex = '#0f0f11';
    }
}

class Player extends Character {
    constructor(rect, mass, spritesheet, showDebug=false) {
        super(rect, mass, showDebug);
        this.maxJumpCount = 2;
        this.jumpCount = 0;
        this.spritesheet = spritesheet;
    }
}

export {
    Platform,
    Npc,
    Player,
}