class Animationcontroller {
    constructor() {
        this.STATE = 'idle';
        this.state = 'idle';
        this.stateMap = {};
    }

    setState(stateKey) {
        if (this.stateMap.hasOwnProperty(stateKey)) {
            this.state = stateKey;
        } else {
            this.state = this.STATE;
        }
    }

    getState() {
        return this.stateMap[this.state];
    }

    addState(stateKey, animationClip) {
        this.stateMap[stateKey] = animationClip;
    }
}


class Animationclip {
    constructor(spritesheet, clipRects, shouldLoop = false, frameDuration = 1) {
        this.isComplete = false;
        this.shouldLoop = shouldLoop;
        this._index = 0;
        this._frameCount = 0;
        this.frameDuration = frameDuration;
        this.spritesheet = spritesheet;
        this.clipRects = clipRects;
    }

    draw(context, rect) {
        if (this.isComplete)
            return;

        this.spritesheet.draw(context, rect, this.clipRects[this._index]);
        
        this._frameCount++;
        if (this._frameCount % this.frameDuration == 0) {
            this._index++;
        }
        
        if (this._index > this.clipRects.length - 1) {
            this._index = 0;
            this._frameCount = 0;
            if (!this.shouldLoop)
            this.isComplete = true;
        }
    }
}

export {
    Animationclip,
}