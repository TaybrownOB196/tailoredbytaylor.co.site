import Rect from '../../../lib/gaming/Rect';
import Vector2d from '../../../lib/gaming/Vector2d';
import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import { PhysicsCircle2d } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import { Animation, AnimationFrame } from '../../../lib/gaming/animation';
import EngineBase from '../../../lib/gaming/EngineBase';
import spritesheet from './../../../../png/Basketball/basketball_spritesheet.png';
import '../../../../sass/basketball.scss';

class ActionProbability {
    constructor(probability, message) {
        this.probability = probability;
        this.message = message;
    }
}

class Entity extends  PhysicsRect2d {
    constructor(rect, clipRect, spritesheet) {
        super(rect, true, false);
        this.clipRect = clipRect;
        this.spritesheet = spritesheet;
    }
}

//During dribble animation, the hands of the player should move to match where the ball bounces
class Ball extends  PhysicsCircle2d {
    constructor(rect, clipRect, spritesheet) {
        super(rect, false, false);
        this.clipRect = clipRect;
        this.spritesheet = spritesheet;
    }
}

class Hooper extends Entity {
    //Skills should be percentages out of 5
    constructor(rect, clipRect, spritesheet, name, skill, speed, size, bounce, stamina, isOffense) {
        super(rect, clipRect, spritesheet);
        this.name = name;
        this._attrValueCheck(skill);
        this._attrValueCheck(speed);
        this._attrValueCheck(size);
        this._attrValueCheck(bounce);
        this._attrValueCheck(stamina);

        this.skill = skill/5;
        this.speed = speed/5;
        this.size = size/5;
        this.bounce = bounce/5;
        this.stamina = stamina/5;
        this.isOffense = isOffense/5;
    }

    _attrValueCheck(attrValue) {
        if (attrValue > 5 || attrValue < 0) throw 'value must be [0,5]';
    }

    attemptShot(defHooper) {
        // return new ActionResult(0, `${this.name} attempts shot`);
    }

    attemptPass(defHooper, tmHooper) {
        // return new ActionResult(0, `${this.name} attempts pass to ${tmHooper.name}`);
    }

    attemptSteal(offHooper) {
        // return new ActionResult(0, `${this.name} attempts steal on ${offHooper.name}`);
    }

    attemptBlock(offHooper) {
        // return new ActionResult(0, `${this.name} attempts block on ${offHooper.name}`);
    }

    boost() {

    }
}

class Basketball extends EngineBase {
    constructor() {
        super('Basketball', 'BasketballContainer');
        this.spritesheet = new Spritesheet(spritesheet);
        this.anim = new Animation(this.spritesheet, 1);
        this.anim.addFrame(
            new AnimationFrame(
                new Rect(new Vector2d(0,256), 128, 128),
                true, 
                5));
            this.anim.addFrame(
                new AnimationFrame(
                    new Rect(new Vector2d(128,256), 128, 128),
                    true, 
                    5));
            this.anim.addFrame(
                new AnimationFrame(
                    new Rect(new Vector2d(256,256), 128, 128),
                    true, 
                    5));
            this.anim.addFrame(
                new AnimationFrame(
                    new Rect(new Vector2d(384,256), 128, 128),
                    true, 
                    5));
        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            switch (ev.key) {
                case 'w':
                break;

                case 'a':
                break;

                case 's':
                break;

                case 'd':
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                break;

                case 'a':
                break;
                
                case 's':
                break;

                case 'd':
                break;
            }
        });

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            // let click = new Vector2d(
            //     (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
            //     (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));
            
            // if (this.hud.rect.contains(click)) {
            //     this.hud.inventory.ExecuteGrid((row, column) => {
            //         let tile = this.hud.inventory.Get(row, column);
            //         if (tile.rect.contains(click)) {
            //             if (tile.isOccupied()) {
            //                 if (tile.occupant.canWield(this.gameObjects.player.race.power)) {
            //                     if (tile.occupant instanceof Weapon) {
            //                         this.gameObjects.player.equipWeapon(tile.occupant);
            //                         tile.occupant.unsetPosition(tile);
            //                     } else if (tile.occupant instanceof Armor) {
            //                         this.gameObjects.player.equipArmor(tile.occupant);
            //                         tile.occupant.unsetPosition(tile);
            //                     }
            //                 }

            //             }

            //             return true;
            //         }
            //     });
            // } else {
            //     this.roomGrid.ExecuteGrid((row, column) => {
            //         let tile = this.roomGrid.Get(row, column);
            //         if (tile.rect.contains(click)) {
            //             if (this.roomGrid.IsInRange(
            //                 this.gameObjects.player.gridTile.position.x, 
            //                 this.gameObjects.player.gridTile.position.y, 
            //                 column, 
            //                 row)
            //             ) {
            //                 if (tile.isOccupied()) {
            //                     if (tile.occupant instanceof Equipable) {
            //                         // console.log('picking up', tile.occupant.name);
            //                         this.hud.addToInventory(tile.occupant);
            //                         // console.log(tile.occupant);
            //                         tile.occupant.setPosition(new Vector2d(tile.position, tile));
            //                         tile.unsetOccupant(tile.occupant);
            //                     } else {
            //                         this.gameObjects.player.attack(tile);
            //                     }
                                
            //                 } else {
            //                     this.gameObjects.player.setPosition(tile.rect.position, tile);
            //                 }
            //             }

            //             return true;
            //         }
            //     });
            // }
        });
    }

    run() {
        super.run();
        // this.spritesheet.draw(
        //     this.context, 
        //     new Rect(
        //         new Vector2d(0,0), 
        //         64, 
        //         32), 
        //     new Rect(
        //         new Vector2d(0,0),
        //         128, 
        //         128));

        // this.spritesheet.draw(
        //     this.context, 
        //     new Rect(
        //         new Vector2d(64,0), 
        //         64, 
        //         32), 
        //     new Rect(
        //         new Vector2d(0,128),
        //         128, 
        //         128));

        this.anim.draw(this.context, 
            new Rect(
                new Vector2d(32,32), 
                128, 
                64));
    }
}

export default Basketball;