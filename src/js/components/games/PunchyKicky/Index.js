import { Rect, Vector2d, Sprite, Spritephysicsobject } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import './../../../../sass/punchykicky.scss';
import Utility from '../../../lib/Utility';
import EngineBase from '../../../lib/gaming/EngineBase';

const SPEED = 10;
const JUMP = SPEED * 1.5;

class Fighter extends Spritephysicsobject {
    constructor(rect, sprite) {
        super(rect, sprite);
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

        this.player = new Fighter(new Rect(new Vector2d(0,0), 32, 32), new Sprite('#fff'));

        this.run = this.run.bind(this);
    }

    run() {        
        this.player.update(this.tickDelta/60, this.context, this.gameRect);
        for(let index=0; index<this.gameObjects.length; index++) {
            this.gameObjects[index].update(this.tickDelta/60, this.context, this.gameRect);
        }
        
        this.collitionDetection();
    }
    
    collitionDetection() {
        // console.log(this.player.ID, this.gameObjects[0].ID);
        for(let gameObject of this.gameObjects) {
            let gameObjectIndex = this.playerColliderIndexes.indexOf(gameObject.ID);
            //If gameObject is in list and the player is not colliding on the Y axis with the object
            if (gameObjectIndex !== -1 && !this.player.areCollidingY(gameObject.rect)) {
                this.playerColliderIndexes = Utility.RemoveAll(this.playerColliderIndexes, gameObject.ID);
                this.player.isGrounded = false;
                this.player.velocity.y = 0;
            } 
            
            if (this.player.areColliding(gameObject.rect)) {
                if (this.playerColliderIndexes.indexOf(gameObject.ID) === -1 && this.player.areCollidingY(gameObject.rect)) {
                    this.playerColliderIndexes.push(gameObject.ID);
                    if (!this.player.isGrounded && this.player.isAffectedByGravity) {
                        // this.player.rect.position.y -= gameObject.rect.height;
                        this.player.velocity.y = 0;
                        this.player.land();
                    }
                }
            }


            // if (this.player.areCollidingX(gameObject.rect) && (this.player.rect.bottomRight().y > gameObject.rect.position.y || this.player.rect.position.y < gameObject.rect.bottomRight().y)) {
            //     if (this.player.rect.position.x > gameObject.rect.position.x + gameObject.rect.width/2) {
            //         this.player.rect.position.x = gameObject.rect.position.x + gameObject.rect.width;
            //     } else {
            //         this.player.rect.position.x = gameObject.rect.position.x - this.player.rect.width;
            //     }
            // }
        }
    }
}


try {
    new PunchyKicky().run();
} catch(ex) {

}


export default PunchyKicky;