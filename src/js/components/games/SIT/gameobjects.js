import { Gameobject } from '../../../lib/gaming/common';
import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Meter from '../../../lib/gaming/ui/Meter';
import { Animation, AnimationQueue, HitboxFrame } from '../../../lib/gaming/animation';

// this.driftAnimation.draw(this.context, this.player.rect, this.spritesheetAnimSS);

const LANE_CHANGE_FRAME_TICKER_COUNT = 5;
const LANE_CHANGE_SECONDS = 1000;
const LANE_CHANGE_COOLDOWN_SECONDS = 3000;

const DEBUG_GREEN = '#00ff00';

class Dashboard {
    constructor(rect, color) {
        this.rect = rect;
        this.color = color;
    }

    draw(context, spriteSheet) {
        context.fillStyle = this.color;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class Vehicle extends PhysicsRect2d {
    constructor(rect, clipRect, speed, lane = 1, laneChangeCooldown = LANE_CHANGE_COOLDOWN_SECONDS) {
        super(rect, 10, null);
        this.clipRect = clipRect;
        this.lane = lane;
        this.speedValue = speed;

        this.laneChangeCooldown = laneChangeCooldown;
        this.canChangeLaneTicks = laneChangeCooldown;
        this.targetLaneX = null;
        this.targetLaneTicks = 0;
        this.laneChangeDirection = null;
    }

    update(tickDelta, frameMultiplier) {
        let xMod = 1;
        if (this.laneChangeDirection === 'left') {
            xMod *= -1;
        }
        if (this.canChangeLaneTicks < this.laneChangeCooldown) {
            this.canChangeLaneTicks += tickDelta;
        }

        if (!this.targetLaneX) return;

        this.targetLaneTicks += tickDelta;

        if (this.targetLaneTicks >= LANE_CHANGE_SECONDS) {
            this.rect.position.x = this.targetLaneX;
            this.targetLaneX = null;
            this.laneChangeDirection = null;
            this.targetLaneTicks = 0;
        } else {
            this.rect.position.x = this.rect.position.x + (
                (this.targetLaneTicks / LANE_CHANGE_SECONDS) * Math.abs(this.rect.position.x - this.targetLaneX))
                * xMod;
        }
    }

    canChangeLane() {
        return this.canChangeLaneTicks >= this.laneChangeCooldown && !this.targetLaneX;
    }

    changeLane(lane, laneWidth) {
        if (isNaN(lane) || lane == this.lane) return;
        
        this.laneChangeDirection = lane > this.lane ? 'right' : 'left';
        if (this.laneChangeDirection == 'left') {
            laneWidth *= -1;
        }
        
        this.targetLaneX = this.rect.position.x + laneWidth;
        this.lane = lane;
        this.canChangeLaneTicks = 0;
    }

    draw(context, spriteSheet) {
        spriteSheet.draw(context, this.rect, this.clipRect);
        context.strokeStyle = DEBUG_GREEN;
        context.lineWidth = 1;
        context.setLineDash([1, 0]);
        context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class PlayerVehicle extends Vehicle {
    constructor(rect, clipRect, speed, lane, spriteSheet) {
        super(rect, clipRect, speed, lane, LANE_CHANGE_COOLDOWN_SECONDS);
        this.rageMeter = new Meter('#ff0000', 10, 10, 4, 10, '#000000');
        this.animQueue = new AnimationQueue();
        this.setAnimations(spriteSheet);
    }

    changeLane(lane, laneWidth, laneCount) {
        if (isNaN(lane) || lane == this.lane) return;
        super.changeLane(lane, laneWidth, laneCount);
        this.animQueue.setState(this.laneChangeDirection, true);
    }

    setAnimations(spriteSheet) {
        let idleAnim = new Animation(spriteSheet, 1, true);
        let turnLeftAnim = new Animation(spriteSheet, 10, false);
        let turnRightAnim = new Animation(spriteSheet, 10, false);
        
        idleAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(0,0), 64,64),
                true, 
                10));
        idleAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(64,0), 64,64),
                true, 
                10));

        turnLeftAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(128,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));
        turnLeftAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(192,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));
        turnLeftAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(256,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));

        turnRightAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(320,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));
        turnRightAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(384,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));
        turnRightAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(448,0), 64,64),
                true, 
                LANE_CHANGE_FRAME_TICKER_COUNT));
        
        this.animQueue.addState('idle', idleAnim);
        this.animQueue.addState('left', turnLeftAnim);
        this.animQueue.addState('right', turnRightAnim);
        this.animQueue.build();
    }

    draw(context) {
        this.animQueue.animate(context, this.rect);
        this.rageMeter.draw(context, 
            new Vector2d(this.rect.position.x, this.rect.position.y + this.rageMeter.height/2));
    }
}

class NpcVehicle extends Vehicle {
    constructor(rect, clipRect, speed, lane, timeToLive, isSpawnAbove) {
        super(rect, clipRect, speed, lane);
        this.initPosition = new Vector2d(rect.position.x, rect.position.y);
        this.health = true;
        this.canDespawn = false;
        this.timeToLive = timeToLive;
        this._ttlTicks = 0;
        this.isSpawnAbove = isSpawnAbove;
    }

    update(tickDelta, frameMultiplier, road) {
        super.update(tickDelta);
        let yMod = 1;
        // if (road.speedValue == this.speedValue)
        if (road.speedValue == this.speedValue)
            yMod = 0;
        else if (road.speedValue < this.speedValue) {
            yMod *= -1;
        }

        this.rect.position.y += this.speedValue * yMod;
        if (this._ttlTicks < this.timeToLive) {
            this._ttlTicks += tickDelta;
        } else {
            this.canDespawn = true;
        }
    }

    isExpired() { return this.canDespawn; }
    isAlive() { return this.health; }
}

class Road extends Gameobject {
    constructor(rect, laneCount=3, stripeWidth=8, stripeLength=16, stripeGap=16, stripeColor='#ffffff') {
        super();
        this.position = new Vector2d(rect.position.x, rect.position.y);
        this.laneCount = laneCount;
        this.stripeWidth = stripeWidth;
        this.stripeLength = stripeLength;
        this.stripeGap = stripeGap;
        this.stripeColor = stripeColor;

        this.rects = [];
        this.rects.push(rect);
        this.rects.push(new Rect(new Vector2d(rect.position.x, rect.position.y - rect.height), rect.width, rect.height));

        this.speedSectionCount = 5;
        this.speedValue = 0;

        this.stripeYOffset = 0;
        this._offsetTick = 0;
        this.rectsIndex = 0;
    }

    update(delta) {
        const _height = this.getHeight();
        const otherIndex = this.rectsIndex == 0 ? 1 : 0;
        if (this.rects[this.rectsIndex].position.y > _height) {
            this.rects[this.rectsIndex].position.y = this.rects[otherIndex].position.y - _height;
            this.rectsIndex = otherIndex;
            // this.rects[otherIndex].position.y += this.getSpeed();
            this.rects[otherIndex].position.y += this.speedValue;
        } else {
            // this.rects[this.rectsIndex].position.y += this.getSpeed();
            this.rects[this.rectsIndex].position.y += this.speedValue;
            this.rects[otherIndex].position.y = this.rects[this.rectsIndex].position.y - this.rects[otherIndex].height;
        }
    }

    draw(context) {
        drawLanes = drawLanes.bind(this);
        drawSpeedSections = drawSpeedSections.bind(this);
        getSpeedSectionHeight = getSpeedSectionHeight.bind(this);

        drawLanes(context, this.rects[0]);
        drawLanes(context, this.rects[1]);

        drawSpeedSections(context);

        function drawLanes(context, rect) {
            let laneWidth = this.getWidth() / this.laneCount;
            for(let idx=0; idx<this.laneCount+1; idx++) {
                context.strokeStyle = this.stripeColor;
                context.lineWidth = this.stripeWidth;
                context.setLineDash([this.stripeLength, this.stripeGap]);
                context.beginPath();
                context.moveTo(
                    rect.position.x + (idx * laneWidth) - (this.stripeWidth), 
                    rect.position.y);
                context.lineTo(
                    rect.position.x + (idx * laneWidth) - (this.stripeWidth), 
                    rect.position.y + rect.height);
                context.stroke();
            }
        }

        function drawSpeedSections(context) {
            context.strokeStyle = DEBUG_GREEN;
            let speedSectionHeight = getSpeedSectionHeight();
            for (let idx=0; idx<this.speedSectionCount; idx++) {
                context.lineWidth = 1;
                context.setLineDash([1,0]);
                context.beginPath();
                context.moveTo(
                    this.position.x, 
                    speedSectionHeight * idx);
                context.lineTo(
                    this.position.x + this.getWidth(), 
                    speedSectionHeight * idx);
                context.stroke();
            }
        }

        function getSpeedSectionHeight() { return this.getHeight() / this.speedSectionCount; }  
    }


    setSpeed(speed) { return this.speedValue = speed; }
    getSpeed() { return this.speedValue; }
    getHeight() { return this.rects[0].height; }
    getWidth() { return this.rects[0].width; }

    getLaneWidth() { return this.getWidth() / this.laneCount; }
    getLane(posX) {
        let width = this.getWidth();
        let laneWidth = this.getLaneWidth();
        let idx = 1;
        if (posX < 0) {
            return null;
        }
        while(laneWidth * (idx-1) < width && idx <= this.laneCount) {
            // console.log(`compare ${posX} [${laneWidth * (idx - 1)},${laneWidth * idx}]`);
            if (posX >= laneWidth * (idx - 1) && posX <= laneWidth * idx) {
                break;
            } else {
                idx++;
            }
        }

        return idx == 0 ? null : idx > this.laneCount ? this.laneCount : idx;
    }
}

export {
    Dashboard,
    Road, 
    Vehicle, NpcVehicle, PlayerVehicle
}