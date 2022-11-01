import EngineBase from '../../../lib/gaming/EngineBase';
import { Gameobject, Text, Point2d } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';

import './../../../../sass/punchykicky.scss';

const MAXSPEED = 1000000;
const JUMP = 300;
const MOVE = 50;

class Physics2d extends Gameobject {
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

    checkCollision(r1, r2) {
        let result = r1.checkCollision(r2);

        if (!result) return false;

        r1.position.x -= result.normal.x * result.depth;
        r1.position.y -= result.normal.y * result.depth;
        return true;
    }

    handleCollisions(colliders) {
        if (!colliders || colliders.length < 1) return;
        this.isGrounded = false;
        for (let collider of colliders) {

            if (this.checkCollision(this.rect, collider.rect)) {
                collider.colorHex = '#ffffff';
                console.log(`${this.ID} colliding with ${collider.ID}`);
            } else {
                collider.colorHex = '#000fff';
            }
        }
    }

    update(timeDelta) {
        this.velocity.x *= timeDelta;
        this.velocity.y *= timeDelta;

        if (this.useGravity && !this.isGrounded) {
            this.velocity.y += this.gravity;
        }

        this.setPosition(new Point2d(
            this.rect.position.x + this.velocity.x,
            this.rect.position.y + this.velocity.y));
    }
}

class Ting extends Physics2d {
    constructor(rect, colorHex, mass=1, gravity=null) {
        super(rect, mass, gravity);
        this.colorHex = colorHex;
        this.isRunning = false;
        this.maxJumpCount = 2;
        this.jumpCount = 0;
    }

    jump() {
        // if (this.isGrounded)
        //     this.jumpCount = 1;
        // else
        //     this.jumpCount++;
        // if (this.jumpCount > this.maxJumpCount) return;
        if (!this.isGrounded) return;
        this.isGrounded = false;
        this.updateVelocity(0, -JUMP, MAXSPEED);
    }

    run(value) {
        this.isRunning = true;
        this.updateVelocity(MOVE * Math.sign(value), 0, MAXSPEED);
    }
    
    stop() {
        this.isRunning = false;
    }

    draw(context) {
        context.fillStyle = this.colorHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }

    update(timeDelta) {
        super.update(timeDelta);
        if (!this.isRunning && this.velocity.x != 0) {
            this.updateVelocity(Math.round(this.velocity.x * .06 * -Math.sign(this.velocity.x)), 0, MAXSPEED);
        }
    }
}

class PunchyKicky extends EngineBase {
    constructor() {
        super('PunchyKicky', 'PunchyKickyContainer');
        this.player = new Ting(new Rect(
            new Point2d(66,16), 16, 16), 
            '#ff00ff',
            10,
            1);
        this.platform = new Ting(new Rect(
            new Point2d(50,100), 100, 18), 
            '#000fff',
            1000000,
            null);
        this.platform2 = new Ting(new Rect(
            new Point2d(200,75), 100, 18),
            '#000fff', 
            1000000,
            null);
        
        this.pointerText = new Text('( , )');
        this.frameRateText = new Text('');

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let click = this.getClick(ev.offsetX, ev.y);
            this.pointerText.value = `(${click.x},${click.y})`;

            this.player.setPosition(click);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let click = this.getClick(ev.offsetX, ev.y);
            this.pointerText.value = `(${click.x},${click.y})`;
            this.player.setPosition(click);

        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.pointerText.value = '( , )';
        });

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            switch (ev.key) {
                case 'w':
                    this.player.jump();
                break;

                case 'a':
                    this.player.run(-1);
                break;
                
                case 's':
                    
                break;
                
                case 'd':
                    this.player.run(1);
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                    
                break;

                case 'a':
                    this.player.stop();
                break;

                case 's':
                    
                break;

                case 'd':
                    this.player.stop();
                break;
            }
        });
    }
    
    run() {
        super.run();
        let fps = this.getFps();
        this.platform.draw(this.context);
        this.platform2.draw(this.context);
        
        this.player.update(fps/1000);
        this.player.handleCollisions([this.platform, this.platform2]);
        this.player.draw(this.context);
        
        this.frameRateText.value = fps;
        this.frameRateText.draw(this.context,
            new Point2d(
                this.DEFAULT_CANVAS_WIDTH - 75, 
                this.DEFAULT_CANVAS_HEIGHT - 24));

        this.pointerText.draw(this.context, 
            new Point2d(
                this.DEFAULT_CANVAS_WIDTH - 75, 
                this.DEFAULT_CANVAS_HEIGHT - 10));
    }
}

export default PunchyKicky;