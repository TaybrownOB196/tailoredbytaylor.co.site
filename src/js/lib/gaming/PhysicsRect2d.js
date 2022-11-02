import Vector2d from './Vector2d';
import { Point2d, Gameobject } from './common';

class PhysicsRect2d extends Gameobject {
    constructor(rect, mass=1, gravity=null) {
        super();
        this.rect = rect;
        this.mass = mass;
        this.velocity = new Vector2d(0,0);
        this.useGravity = gravity ? true : false;
        this.gravity = this.useGravity ? gravity : 0;
        this.isGrounded = this.useGravity ? false : true;
    }

    setPosition(position) {
        this.rect.position = position;
    }

    setVelocity(velocity) {
        this.velocity = velocity;
    }

    updateVelocity(x, y, maxSpeed) {
        let _x = this.velocity.x + x >= maxSpeed ?
            maxSpeed : this.velocity.x + x <= -maxSpeed ?
            -maxSpeed : this.velocity.x + x;

        let _y = this.velocity.y + y >= maxSpeed ?
            maxSpeed : this.velocity.y + y <= -maxSpeed ?
            -maxSpeed : this.velocity.y + y;
        
        if (_x > 0) {
            _x = Math.floor(_x);
        } else {
            _x = Math.ceil(_x);
        }

        if (_y > 0) {
            _y = Math.floor(_y);
        } else {
            _y = Math.ceil(_y);
        }

        this.velocity.x = _x;
        this.velocity.y = _y;
    }

    update(timeDelta) {
        if (this.useGravity) {
            this.velocity.y += this.gravity * this.mass;
        }
        this.velocity.x *= timeDelta;
        this.velocity.y *= timeDelta;

        this.setPosition(new Point2d(
            this.rect.position.x + this.velocity.x,
            this.rect.position.y + this.velocity.y));
    }
}

export default PhysicsRect2d;