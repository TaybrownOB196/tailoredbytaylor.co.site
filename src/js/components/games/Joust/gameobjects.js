import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import BarMeter from '../../../lib/gaming/ui/BarMeter';
import { Animation, AnimationQueue, AnimationFrame, HitboxFrame } from '../../../lib/gaming/animation';
import NeedleMeter from '../../../lib/gaming/ui/NeedleMeter';
import Pubsub from '../../../lib/gaming/Pubsub';
import Transformation2d from '../../../lib/gaming/Transformation2d';
import Utility from '../../../lib/Utility';

const DEBUG_GREEN = '#00ff00';
const HITBOX_OFFSET = 16;

export class Barrier extends PhysicsRect2d {
  constructor(rect) {
    super(rect, 1000, null);
  }

  draw(context, isPaused = false, isDebug = false) {
    context.strokeStyle = '#ff0f0f';
    context.lineWidth = 8;
    context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
  }
}

export class Weapon {
  constructor(spritesheet) {
    this.spritesheet = spritesheet;
    this.animQueue = new AnimationQueue();
    this.setAnimations();
  }
  attack() {
    this.animQueue.setState('attack', true);
  }

  draw(context, position, isPaused = false, isDebug = false) {
    this.animQueue.animate(context, position, isPaused, isDebug);
  }
}

export class Lance extends Weapon {
  constructor(spritesheet) {
    super(spritesheet);
  }

  setAnimations() {
    let idleAnim = new Animation(this.spritesheet, 1, true);
    let attackAnim = new Animation(this.spritesheet, 10, false);

    idleAnim.addFrame(
      new AnimationFrame(
        new Rect(new Vector2d(2560, 92), 96, 8),
        true,
        1));

    attackAnim.addFrame(
      new HitboxFrame(
        new Vector2d(32, 0), 
        18,
        4,
        new Rect(new Vector2d(2560, 92), 96, 8),
        true,
        10));
    attackAnim.addFrame(
      new HitboxFrame(
        new Vector2d(32, 0), 
        18,
        4,
        new Rect(new Vector2d(2688, 92), 96,8),
        true,
        10));
    attackAnim.addFrame(
      new HitboxFrame(
        new Vector2d(64, 0), 
        18,
        4,
        new Rect(new Vector2d(2816, 92), 96,8),
        true,
        10));
    attackAnim.addFrame(
      new HitboxFrame(
        new Vector2d(48, 0), 
        18,
        4,
        new Rect(new Vector2d(2688, 92), 96,8),
        true,
        10));

    this.animQueue.addState('idle', idleAnim);
    this.animQueue.addState('attack', attackAnim);
    this.animQueue.build();
  }
}

export class Battleaxe extends Weapon {
  constructor(spritesheet) {
    super(spritesheet);
  }

  setAnimations() {
    let idleAnim = new Animation(this.spritesheet, 1, true);
    let attackAnim = new Animation(this.spritesheet, 10, false);

    idleAnim.addFrame(
      new AnimationFrame(
        new Rect(new Vector2d(2944, 70), 25, 32),
        true,
        1));

    attackAnim.addFrame(
      new AnimationFrame(
        new Rect(new Vector2d(2944, 70), 25, 32),
        true,
        1));
    attackAnim.addFrame(
      new HitboxFrame(
        new Vector2d(32, 0), 
        8,
        32,
        new Rect(new Vector2d(3083, 70), 36, 28),
        true,
        10));
    attackAnim.addFrame(
      new AnimationFrame(
        new Rect(new Vector2d(3227, 92), 33, 36),
        true,
        10));

    this.animQueue.addState('idle', idleAnim);
    this.animQueue.addState('attack', attackAnim);
    this.animQueue.build();
  }
}

export class Mount {
  constructor(speed=0, chargeSpeed=0) {
    this.speed = speed;
    this.chargeSpeed = chargeSpeed;
  }
}

export class Rider {
  constructor() {
    this.stamina = 10;
    this.strength = 10;
    this.weight = 10;
  }

  getWeight() {
    return this.weight;
  }
}

export class Jouster extends PhysicsRect2d {
  constructor(rect, clipRect, spritesheet, rider, mount, faceRight=true) {
    super(rect, 10, null);
    this.clipRect = clipRect;
    this.rider = rider;
    this.mount = mount;
    this.spritesheet = spritesheet;
    this.isGalloping = false;
    this.faceRight = faceRight;

    this.weapon = null;

    this.pubsub = new Pubsub();

    this.animQueue = new AnimationQueue();
    this.setAnimations();
  }

  equipWeapon(weapon) {
    this.weapon = weapon;
  }

  getSpeed() {
    return this.mount.speed;
  }

  gallop() {
    if (this.isGalloping) return;
    this.isGalloping = true;
    this.animQueue.setState('gallop', true);

  }
  attack() {
    if (this.weapon) {
      this.weapon.attack();

    }
  }
  dodge() {
    //this.animQueue.setState('dodge', true);

  }
  handleOnHit() {
    //this.animQueue.setState('damage', true);

  }
  handleOnMiss() {
    //this.animQueue.setState('whiff', true);

  }

  update(delta, isDebug) {
    if (isDebug) return;

    if (this.isGalloping) {
      this.velocity.x += (this.getSpeed() * delta) * (this.faceRight ? 1 : -1);
    }
    super.update(delta);
  }

  draw(context, isPaused = false, isDebug = false) {
    drawWeapon = drawWeapon.bind(this);
    let t = this.animQueue.animate(context, this.rect.position, isPaused, isDebug);
    if (t) console.log(t);
    if (!this.faceRight) {
      drawWeapon();
    } else {
      this.weapon.draw(
        context, 
        new Vector2d(this.rect.position.x + this.rect.width/2, this.rect.position.y + this.rect.height/3),
        isPaused,
        isDebug);
    }

    function drawWeapon() {
      const weaponLength = 64;
      context.beginPath();
      context.strokeStyle = '#00ff00';
      context.moveTo(this.rect.position.x + this.rect.width/2, this.rect.position.y + this.rect.height/3);
      context.lineTo(
        this.rect.position.x + this.rect.width/2 + (this.faceRight ? weaponLength : -weaponLength), 
        this.rect.position.y + this.rect.height/3);
      context.stroke();
      context.closePath();
    }
  }

  setAnimations() {
    let idleAnim = new Animation(this.spritesheet, 1, true);
    let gallopAnim = new Animation(this.spritesheet, 10, true);

    idleAnim.addFrame(
      new AnimationFrame(
        new Rect(new Vector2d(64 * (this.faceRight ? 26 : 13), 0), 64,64),
        true, 
        1));

    gallopAnim.addFrame(
      new HitboxFrame(
        new Vector2d(HITBOX_OFFSET + (this.faceRight ? 0 : 8),0),
        24,
        64, 
        new Rect(new Vector2d(64 * (this.faceRight ? 28 : 21), 0), 64,64),
        true, 
        10));
    gallopAnim.addFrame(
      new HitboxFrame(
        new Vector2d(HITBOX_OFFSET + (this.faceRight ? 0 : 8),0),
        24,
        64, 
        new Rect(new Vector2d(64 * (this.faceRight ? 30 : 19), 0), 64,64),
        true, 
        10));
    gallopAnim.addFrame(
      new HitboxFrame(
        new Vector2d(HITBOX_OFFSET + (this.faceRight ? 0 : 8),0),
        24,
        64, 
        new Rect(new Vector2d(64 * (this.faceRight ? 32 : 17), 0), 64,64),
        true, 
        10));
    gallopAnim.addFrame(
      new HitboxFrame(
        new Vector2d(HITBOX_OFFSET + (this.faceRight ? 0 : 8),0),
        24,
        64, 
        new Rect(new Vector2d(64 * (this.faceRight ? 34 : 15), 0), 64,64),
        true, 
        10));

    this.animQueue.addState('idle', idleAnim);
    this.animQueue.addState('gallop', gallopAnim);
    this.animQueue.build();
  }
}
