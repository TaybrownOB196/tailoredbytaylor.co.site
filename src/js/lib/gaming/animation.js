import Vector2d from "./Vector2d";
import Rect from "./Rect";
import Pubsub from "./Pubsub";

class AnimationQueue {
  constructor() {
    this.stateMap = new Map();
    this.pubsub = new Pubsub();
    this.isBuilt = false;
    this.queue = [];
  }

  animate(context, position, isPaused=false, isDebug=false) {
    if (this.queue.length > 0 && this.queue.at(0).isCompleted()) {
      this.queue.shift().reset();
    }

    if (this.queue.length == 0 && this.stateMap.has('idle')) {
      this.queue.push(this.stateMap.get('idle'))
    }

    if (this.queue.length == 0) throw new Error('queue is empty');

    const anim = this.queue.at(0);
    return anim.draw(context, position, isPaused, isDebug);
  }
    
  setState(stateKey, isClear=false) {
    if (!this.stateMap.has(stateKey)) {
      console.warn(`${stateKey} does not exist in animation map`);
    }
      
    const anim = this.stateMap.get(stateKey);
    if (isClear && this.queue.length > 0) {
      this.queue = this.queue.filter(x => x.order >= anim.order);
    }
    this.queue.push(anim);
  }

  addState(stateKey, animation) {
    if (this.isBuilt) return;
    this.stateMap.set(stateKey, animation);
  }

  build() {
    if (this.isBuilt) return;

    if (!this.stateMap.has('idle')) console.warn('no idle state set');

    for (let animation of this.stateMap.values()) {
      animation.build();
    }

    this.isBuilt = true;
  }
}

class FrameTrigger {
  constructor(frameIndex, callback) {
    this.frameIndex = frameIndex;
    this.callback = callback;
  }
}

class Animation {
  constructor(spritesheet, order=0, isLooping=false, frameTriggers=null) {
    this._frameTicker = 0;

    this.frameTriggers = frameTriggers || [];
    this.spritesheet = spritesheet;
    this.order = order;
    this.frames = [];
    this.frameIndex = 0;
    this.isBuilt = false;
    this.isRunning = false;
    this.isLooping = isLooping;
    this._isCompleted = false;
  }
  
  addFrame(animationFrame) {
    if (this.isBuilt) throw new Error('animation already built, no frames can be added');
    this.frames.push(animationFrame);
  }
  
  build() {
    if (this.isBuilt) return;
    this.isBuilt = true;
  }

  draw(context, position, isPaused=false, isDebug=false) {
    getNext = getNext.bind(this);
    reset = reset.bind(this);

    if (!this.isAnimating() || this._frameTicker + 1 >= this.frames[this.frameIndex].count) {
      const frameTriggers = this.frameTriggers.filter(x => x.frameIndex === this.frameIndex);
      for (let frameTrigger in frameTriggers) {
        frameTrigger.callback();
      }
    }

    let frame = getNext(isPaused);
    return frame.draw(context, this.spritesheet, position, isDebug);
  
    function getNext(isPaused) {
      let toReturn = this.frames[this.frameIndex];
      if (isPaused) return toReturn;

      this.isRunning = true;
      if (this._frameTicker >= this.frames[this.frameIndex].count) {
        if (this.frameIndex < this.frames.length-1) {
          this.frameIndex++;
        } else {
          this._isCompleted = !this.isLooping;
          reset();
        }
        this._frameTicker = 0;
      }

      this._frameTicker++;
      return toReturn;
    }
    
    function reset() {
      this._frameTicker = 0;
      this.frameIndex = 0;
      this.isRunning = false;
    }
  }

  reset() {
    this._isCompleted = false;
  }

  isAnimating() {
    return this.isRunning;
  }

  isCompleted() {
    return this._isCompleted || this._frameTicker >= this.frames[this.frameIndex].count && this.frameIndex >= this.frames.length;
  }
}

class AnimationFrame {
  constructor(spritesheetRect, isInterruptable=false, count=1) {
    //The values of this rect will be used as offsets to the current hitbox position of the object
    this.spritesheetRect = spritesheetRect;
    this.isInterruptable = isInterruptable;
    this.count = count;
  }
  draw(context, spritesheet, position, isDebug) {
    spritesheet.draw(
      context,
      new Rect(position, this.spritesheetRect.width, this.spritesheetRect.height),
      this.spritesheetRect);
  }
}

class HitboxFrame extends AnimationFrame {
  constructor(hitboxOffset, width, height, spritesheetRect, isInterruptable=false, count=1) {
    super(spritesheetRect, isInterruptable, count);
    this.hitboxOffset = hitboxOffset;
    this.width = width;
    this.height = height;
  }

  #getHitbox(position) {
    return new Rect(
      new Vector2d(
        position.x + this.hitboxOffset.x, 
        position.y + this.hitboxOffset.y),
      this.width,
      this.height);
  }

  draw(context, spritesheet, position, isDebug) {
    super.draw(context, spritesheet, position, isDebug);

    const hitbox = this.#getHitbox(position);
    if (isDebug) {
      context.strokeStyle = '#00ff00';
      context.lineWidth = 1;
      context.strokeRect(
        hitbox.position.x, 
        hitbox.position.y, 
        hitbox.width, 
        hitbox.height);
    }

    return hitbox;
  }
}

export {
  Animation,
  AnimationFrame,
  FrameTrigger,
  HitboxFrame,
  AnimationQueue
}