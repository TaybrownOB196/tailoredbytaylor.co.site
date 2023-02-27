class Animation {
    constructor(order=0) {
        this._frameTicker = 0;

        this.order = order;
        this.frames = [];
        this.frameIndex = 0;
        this.isBuilt = false;

        this.isStarted = false;
    }

    build() {
        this.isBuilt = true;
    }

    addFrame(animationFrame) {
        if (this.isBuilt) throw new Error('animation already built, no frames can be added');
        this.frames.push(animationFrame);
    }

    getNext() {
        this.isStarted = true;
        let toReturn = this.frames[this.frameIndex];
        if (this._frameTicker > toReturn.count) {
            this.frameIndex++;
            this._frameTicker = 0;
        }
        
        if (this.frameIndex >= this.frames.length) {
            this.reset();
        }
        
        this._frameTicker++;
        return toReturn;
    }

    getCurrent() { this.frames[this.frameIndex]; }

    reset() {
        this._frameTicker = 0;
        this.frameIndex = 0;
        this.isStarted = false;
    }

    isAnimating() {
        return this.isStarted;
    }
}

class AnimationFrame {
    constructor(hitboxOffsetRect, hurtboxOffsetRect=null, spritesheetRect=null, isInterruptable=false, count=1) {
        //The values of this rect will be used as offsets to the current hitbox position of the object
        this.hitboxOffsetRect = hitboxOffsetRect;
        this.spritesheetRect = spritesheetRect;
        this.hurtboxOffsetRect = hurtboxOffsetRect;
        
        this.isInterruptable = isInterruptable;
        this.count = count;
    }
}

export {
    Animation,
    AnimationFrame
}