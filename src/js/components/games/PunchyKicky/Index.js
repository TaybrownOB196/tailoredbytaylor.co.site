import { Circle,Rect, Vector2d, Fill, FillPhysicsRect, FillPhysicsCircle } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import './../../../../sass/punchykicky.scss';
import Utility from '../../../lib/Utility';
import EngineBase from '../../../lib/gaming/EngineBase';

const SPEED = 10;
const JUMP = SPEED * 1.5;

class Fighter extends FillPhysicsRect {
    constructor(rect, fill) {
        super(rect, fill);
        this.jumpCount = 0;
        this.maxJumpCount = 2;
    }

    update(timeDelta, context, gameRect) {
        super.update(timeDelta, context, gameRect);

        if (this.rect.bottomRight().y >= gameRect.bottomRight().y) {
            this.land();
        }      
    }

    jump() {
        if (this.jumpCount < this.maxJumpCount) {
            this.isGrounded = false;
            this.velocity.y = -JUMP;
        }

        this.jumpCount++;
    }
    
    land() {
        this.isGrounded = true;
        this.jumpCount = 0;
        this.velocity.y = 0;
    }
    
    crouch() {
        this.rect.position.y += this.rect.height/2;
        this.rect.height /= 2;
    }
}

class PunchyKicky extends EngineBase {
    constructor() {
        super('PunchyKicky', 'PunchyKickyContainer')
        this.playerColliderIndexes = [];
        this.previousDirKey = '';
        this.gameObjects = [];
        this.pointerhandler = new Pointerhandler();
        this.keyboardhandler = new Keyboardhandler();
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            switch (ev.key) {
                case 'w':
                    this.player.jump();
                    this.previousDirKey = ev.key;
                break;

                case 'a':
                    if (!this.player.isGrounded)
                        return; 
                    this.player.velocity.x = -SPEED;
                    this.previousDirKey = ev.key;
                break;

                case 's':
                    this.player.crouch();
                    this.previousDirKey = ev.key;
                break;

                case 'd':
                    if (!this.player.isGrounded) 
                        return; 
                    this.player.velocity.x = SPEED;
                    this.previousDirKey = ev.key;
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                    if (this.player.isAffectedByGravity)
                        return;
                    this.player.velocity.y = 0;
                break;

                case 's':
                    this.player.rect.position.y += this.player.rect.height*2;
                    this.player.rect.height *= 2;
                    this.player.velocity.y = 0;
                break;

                case 'a':
                    if (this.previousDirKey === 'd') {
                        return;
                    }
                    this.player.velocity.x = 0;
                break;

                case 'd':
                    if (this.previousDirKey === 'a') {
                        return;
                    }
                    this.player.velocity.x = 0;
                break;
            }
        });

        //this.player = new Fighter(new Rect(new Vector2d(0,0), 32, 32), new Fill('#fff'));
        this.box1 = new FillPhysicsRect(new Rect(new Vector2d(0,0), 16, 16), new Fill('#fff'));
       this.box2 = new FillPhysicsRect(new Rect(new Vector2d(0,32), 16, 16), new Fill('#aaa'));

       //console.log(this.box2);
       // this.ball1 = new FillPhysicsCircle(new Circle(new Vector2d(16,8), 8), 1, 0.7, '#fff');
       // this.ball2 = new FillPhysicsCircle(new Circle(new Vector2d(16,32), 16), 2, 0.7, '#fff');
    }
    
    run() {
        super.run();     
        // this.player.update(this.tickDelta/60, this.context, this.gameRect);
        // for(let index=0; index<this.gameObjects.length; index++) {
            //     this.gameObjects[index].update(this.tickDelta/60, this.context, this.gameRect);
            // }
            
        this.box1.update(this.tickDelta/60, this.context, this.gameRect);
        this.box2.update(this.tickDelta/60, this.context, this.gameRect);

        // this.ball1.update(this.tickDelta/60, this.context, this.gameRect);
        // this.ball2.update(this.tickDelta/60, this.context, this.gameRect);
       
        this.box1.rect2dCollision(this.box2);
        // this.ball2.circle2dCollision(this.ball1);
    }
}

export default PunchyKicky;