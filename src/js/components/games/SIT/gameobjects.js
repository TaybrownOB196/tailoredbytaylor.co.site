import { Gameobject } from '../../../lib/gaming/common';
import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import BarMeter from '../../../lib/gaming/ui/BarMeter';
import { Animation, AnimationQueue, HitboxFrame } from '../../../lib/gaming/animation';
import NeedleMeter from '../../../lib/gaming/ui/NeedleMeter';
import Pubsub from '../../../lib/gaming/Pubsub';
import Transformation2d from '../../../lib/gaming/Transformation2d';
import Utility from '../../../lib/Utility';

const MAXSPEED = 5;
const MINSPEED = 1;

const LANE_CHANGE_FRAME_TICKER_COUNT = 5;
const COLLISION_FRAME_TICKER_COUNT = 5;

const LANE_CHANGE_SECONDS = 1000;
const LANE_CHANGE_COOLDOWN_SECONDS = 500;
const COLLISION_COOLDOWN_SECONDS = 4000;

const DEBUG_GREEN = '#00ff00';

const NpcVehicleTypes = {
    SEMI: 'SEMI',
    COP: 'COP',
    SHEEP: 'SHEEP',
};

class SpeedOMeter extends NeedleMeter {
    constructor(position, radius, fontSize, max, init) {
        super(position, radius, max, init);
        this.fontSize = fontSize;
    }

    draw(context) {
        let radians = (this.value/this.maxValue * Math.PI);
        let v0 = Vector2d.pointsToVector(
            {x:this.position.x, y:this.position.y}, 
            {x:this.position.x - this.radius, y:this.position.y});

        //draw ticks

        //draw numbers
        let numberCount = 3;
        context.lineWidth = 1;
        context.font = `${this.fontSize}px Arial`;
        for (let idx=0; idx<=numberCount; idx++) {
            let text = Math.floor(idx/numberCount * this.maxValue);
            let textMetrics = context.measureText(text);
            let textWidth = textMetrics.width;
            let textHeight = textMetrics.fontBoundingBoxAscent;

            if (idx == 0) {
                context.strokeText(
                    text, 
                    this.position.x - this.radius + textWidth, 
                    this.position.y - textHeight/2);
            } else if (idx == numberCount) {
                context.strokeText(
                    text, 
                    this.position.x + this.radius - textWidth * 2, 
                    this.position.y - textHeight/2);
            } else {
                context.strokeText(
                    text, 
                    this.position.x - textWidth/2, 
                    this.position.y - this.radius + textHeight);
            }

            // draw arc
            context.lineWidth = 3;
            context.setLineDash([]);
            context.strokeStyle = this.color;
            context.beginPath();
            context.arc(this.position.x,this.position.y, this.radius, Math.PI, 0);
            context.stroke();
        }

        //draw needle
        context.setLineDash([]);
        context.strokeStyle = this.needleColor;
        context.beginPath();
        context.moveTo(this.position.x - context.lineWidth, this.position.y - context.lineWidth);
        let res = Transformation2d.rotateVector2dAroundPoint(v0, radians, {x:this.position.x,y:this.position.y});
        context.lineTo(
            res.x,
            res.y);
        context.stroke();

        //draw needle center
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.dotSize, Math.PI, 0);
        context.fill();
    }
}

class Dashboard {
    constructor(rect, color) {
        this.rect = rect;
        this.color = color;

        let fontSize = 8;
        let radius = this.rect.height * .33;
        this.collisions = 0;
        this.time = 0;

        let x = this.rect.position.x + (this.rect.width - radius /4)/2;
        let y = this.rect.position.y + (this.rect.height - radius/8) / 2;

        this.speedOMeter = new SpeedOMeter(new Vector2d(x,y), radius, fontSize, 5, 0);
    }

    addHit() {
        this.collisions++;
    }

    update(speed, time) {
        this.speedOMeter.updateValue(speed);
        this.time = time;
    }

    draw(context) {
        drawText = drawText.bind(this);
        context.fillStyle = this.color;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);

        drawText();
        this.speedOMeter.draw(context);
        
        //TODO: Add cooldown meter for lane changing here
        function drawText() {
            let text = `Hits: ${this.collisions}`
            let text2 = `Time: ${Math.round(this.time)}`;
            context.font = '15px Arial';
            context.fillStyle = DEBUG_GREEN;
            let textMetrics = context.measureText(text);
            let textMetrics2 = context.measureText(text2);
            let textHeight = textMetrics.actualBoundingBoxDescent || textMetrics.actualBoundingBoxAscent;
            let textHeight2 = textMetrics2.actualBoundingBoxDescent || textMetrics.actualBoundingBoxAscent;
            
            let offsetY = (this.rect.height + textHeight)/2;
            context.fillText(
                text, 
                this.speedOMeter.position.x + this.speedOMeter.radius, 
                this.rect.position.y + offsetY);

                context.fillText(
                    text2, 
                    this.speedOMeter.position.x + this.speedOMeter.radius, 
                    this.rect.position.y + offsetY + textHeight2);
        }
    }
}

class Vehicle extends PhysicsRect2d {
    constructor(rect, clipRect, speed, lane, spriteSheet, laneChangeCooldown = LANE_CHANGE_COOLDOWN_SECONDS, collisionCooldown = COLLISION_COOLDOWN_SECONDS) {
        super(rect, 10, null);
        this.clipRect = clipRect;
        this.lane = lane;
        this.speedValue = speed;

        this.laneChangeCooldown = laneChangeCooldown;
        this.canChangeLaneTicks = laneChangeCooldown;
        this.targetLaneX = null;
        this.targetLaneTicks = 0;
        this.laneChangeDirection = null;

        this.collisionCooldown = collisionCooldown;
        this.collisionCooldownTicks = 0;
        this.spriteSheet = spriteSheet;
    }

    update(tickDelta, frameMultiplier) {
        changingLane = changingLane.bind(this);
        let xMod = 1;
        if (this.laneChangeDirection === 'left') {
            xMod *= -1;
        }
        if (this.canChangeLaneTicks < this.laneChangeCooldown) {
            this.canChangeLaneTicks += tickDelta;
        }
        this.collisionCooldownTicks += tickDelta;

        changingLane();

        function changingLane() {
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

    draw(context) {
        this.spriteSheet.draw(context, this.rect, this.clipRect);
        context.strokeStyle = DEBUG_GREEN;
        context.lineWidth = 1;
        context.setLineDash([1, 0]);
        context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class PlayerVehicle extends Vehicle {
    constructor(rect, clipRect, speed, lane, spriteSheet) {
        super(rect, clipRect, speed, lane, spriteSheet, LANE_CHANGE_COOLDOWN_SECONDS);
        this.rageMeter = new BarMeter('#ff0000', 10, 10, 4, 10, '#000000');
        this.animQueue = new AnimationQueue();
        this.pubsub = new Pubsub();
        this.setAnimations();
    }

    collision(direction) {
        if (this.collisionCooldownTicks >= this.collisionCooldown) {
            this.animQueue.setState(direction, false);
            this.collisionCooldownTicks = 0;
            this.pubsub.publish('collision');
        }
    }

    changeLane(lane, laneWidth, laneCount) {
        if (isNaN(lane) || lane == this.lane) return;
        super.changeLane(lane, laneWidth, laneCount);
        this.animQueue.setState(this.laneChangeDirection, true);
    }

    setAnimations() {
        let idleAnim = new Animation(this.spriteSheet, 1, true);
        let turnLeftAnim = new Animation(this.spriteSheet, 10, false);
        let turnRightAnim = new Animation(this.spriteSheet, 10, false);
        let frontCollisionAnim = new Animation(this.spriteSheet, 5, false);
        let rearCollisionAnim = new Animation(this.spriteSheet, 5, false);

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
        
        frontCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(512,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));
        frontCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(576,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));
        frontCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(640,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));

        rearCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(704,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));
        rearCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(768,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));
        rearCollisionAnim.addFrame(
            new HitboxFrame(
                new Rect(new Vector2d(0,0), 0,0), 
                new Rect(new Vector2d(832,0), 64,64),
                true, 
                COLLISION_FRAME_TICKER_COUNT));

        this.animQueue.addState('idle', idleAnim);
        this.animQueue.addState('left', turnLeftAnim);
        this.animQueue.addState('right', turnRightAnim);
        this.animQueue.addState('front', frontCollisionAnim);
        this.animQueue.addState('rear', rearCollisionAnim);
        this.animQueue.build();
    }

    draw(context, isPaused) {
        this.animQueue.animate(context, this.rect, isPaused);
        this.rageMeter.draw(context, 
            new Vector2d(this.rect.position.x, this.rect.position.y + this.rageMeter.height/2));
    }
}

class NpcVehicle extends Vehicle {
    constructor(rect, clipRect, speed, lane, spriteSheet, timeToLive, isSpawnAbove) {
        super(rect, clipRect, speed, lane, spriteSheet);
        this.initPosition = new Vector2d(rect.position.x, rect.position.y);
        this.health = true;
        this.canDespawn = false;
        this.timeToLive = timeToLive;
        this._ttlTicks = 0;
        this.isSpawnAbove = isSpawnAbove;
        this.spriteSheet = spriteSheet;
    }

    update(tickDelta, frameMultiplier, road) {
        super.update(tickDelta);
        let yMod = 1;
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

class NpcVehicleFactory {
    static create(type, startPos, dim, speed, lane, spritesheet, isSpawnAbove) {
        switch (type) {
            case NpcVehicleTypes.COP:
                return new NpcVehicle(
                    new Rect(
                        new Vector2d(startPos.x, startPos.y),
                        dim.x, 
                        dim.y),
                    new Rect(
                        new Vector2d(0,0),
                        64,
                        64),
                    speed,
                    lane,
                    spritesheet,
                    2000,
                    isSpawnAbove);

            case NpcVehicleTypes.SEMI:
                return new NpcVehicle(
                    new Rect(
                        new Vector2d(startPos.x, startPos.y),
                        dim.x, 
                        dim.y * 2),
                    new Rect(
                        new Vector2d(0,64),
                        64,
                        128),
                    Utility.getRandomIntInclusive(MINSPEED, MAXSPEED/2),
                    lane, 
                    spritesheet,
                    10000,
                    isSpawnAbove);

            default:
            case NpcVehicleTypes.SHEEP:
                return new NpcVehicle(
                    new Rect(
                        new Vector2d(startPos.x, startPos.y),
                        dim.x, 
                        dim.y),
                    new Rect(
                        new Vector2d(0,192),
                        64,
                        64),
                    speed,
                    lane,
                    spritesheet,
                    2000,
                    isSpawnAbove);
        }
    }
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
        this.rects.push(
            new Rect(
                new Vector2d(rect.position.x, rect.position.y - rect.height), 
                rect.width, 
                rect.height)
        );

        this.maxSpeed = this.speedSectionCount = 5;
        this.minSpeed = this.speedValue = 0

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

        context.fillStyle= ' black';
        context.fillRect(this.position.x-2, this.position.y, this.rects[0].width+8, this.rects[0].height)
        drawLanes(context, this.rects[0]);
        drawLanes(context, this.rects[1]);

        // drawSpeedSections(context);

        function drawLanes(context, rect) {
            let laneWidth = this.getWidth() / this.laneCount;
            for(let idx=0; idx<this.laneCount+1; idx++) {
                context.strokeStyle = this.stripeColor;
                context.lineWidth = this.stripeWidth;
                context.setLineDash([this.stripeLength, this.stripeGap]);
                context.beginPath();
                context.moveTo(
                    rect.position.x + (idx * laneWidth) + (this.stripeWidth/2), 
                    rect.position.y);
                context.lineTo(
                    rect.position.x + (idx * laneWidth) + (this.stripeWidth/2), 
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


    setSpeed(speed) {
        if (speed < this.minSpeed) {
            speed = this.minSpeed;
        } else if (speed > this.maxSpeed) {
            speed = this.maxSpeed;
        }
        this.speedValue = speed; 
    }
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
    NpcVehicle,
    NpcVehicleFactory,
    PlayerVehicle,
    NpcVehicleTypes,
    MAXSPEED,
    MINSPEED
}