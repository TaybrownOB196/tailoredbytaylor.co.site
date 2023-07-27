import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import BarMeter from '../../../lib/gaming/ui/BarMeter';
import { Animation, AnimationQueue, HitboxFrame } from '../../../lib/gaming/animation';
import NeedleMeter from '../../../lib/gaming/ui/NeedleMeter';
import Pubsub from '../../../lib/gaming/Pubsub';
import Transformation2d from '../../../lib/gaming/Transformation2d';
import Utility from '../../../lib/Utility';

const DEBUG_GREEN = '#00ff00';

export class Barrier extends PhysicsRect2d {
    constructor(rect) {
        super(rect, 1000, null);
    }

    draw(context, isPaused = false, isDebug = false) {
        context.strokeStyle = '#ff0f0f';
        context.lineWidth = 8;
        context.strokeRect(
            this.rect.position.x, 
            this.rect.position.y, 
            this.rect.width, 
            this.rect.height);
    }
}

export class Jouster extends PhysicsRect2d {
    constructor(rect, clipRect, spritesheet, rider, mount,) {
        super(rect, 10, null);
        this.clipRect = clipRect;
        this.rider = rider;
        this.mount = mount;
        this.spritesheet = spritesheet;
        this.isGalloping = false;

        this.pubsub = new Pubsub();
        this.animQueue = new AnimationQueue();
        this.setAnimations();
    }

    update(delta, isDebug) {

    }

    draw(context, isPaused = false, isDebug = false) {
        this.animQueue.animate(context, this.rect, isPaused);
        // this.spritesheet.draw(context, this.rect, this.clipRect);
        if (!isDebug) return;
    }

    setAnimations() {
        let idleAnim = new Animation(this.spritesheet, 1, true);
        let gallopAnim = new Animation(this.spritesheet, 10, false);

        idleAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(0,0), 64,64),
                true, 
                1));

        gallopAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(0,128), 64,64),
                true, 
                10));
        gallopAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(128, 128), 64,64),
                true, 
                10));
        gallopAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(256, 128), 64,64),
                true, 
                10));
        gallopAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(256 + 128, 128), 64,64),
                true, 
                10));

        this.animQueue.addState('idle', idleAnim);
        this.animQueue.addState('gallop', gallopAnim);
        this.animQueue.build();
    }

    gallop() {
        if (this.isGalloping) return;
        this.isGalloping = true;
    }
    attack() {

    }
    dodge() {

    }

    handleOnHit() {

    }

    handleOnMiss() {

    }
}

export class Mount {
    constructor() {
        this.speed = 0;
        this.gallopSpeed = 0;
    }
}

export class Rider {
    constructor() {
        // this.defense = armor;
        // this.weapon = weapon;
        this.stamina = 10;
        this.strength = 10;
        this.weight = 10;
    }

    getWeight() {
        return this.weight;
    }
}
