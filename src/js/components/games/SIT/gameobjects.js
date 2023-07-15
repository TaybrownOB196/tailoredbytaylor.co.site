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

const VEHICLE_COLLISION_RAYCAST_LENGTH = 32;

const LANE_CHANGE_FRAME_TICKER_COUNT = 5;
const COLLISION_FRAME_TICKER_COUNT = 5;

const LANE_CHANGE_SECONDS = 1000;
const LANE_CHANGE_COOLDOWN_SECONDS = 500;
const COLLISION_COOLDOWN_SECONDS = 1200;

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

    draw(context, isDebug) {
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
        }
        
        // draw arc
        context.lineWidth = 3;
        context.setLineDash([]);
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.position.x,this.position.y, this.radius, Math.PI, 0);
        context.stroke();

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
        this.score = 0;
        this.drivingElapsed = 0;

        let x = this.rect.position.x + (this.rect.width - radius /4)/2;
        let y = this.rect.position.y + (this.rect.height - radius/8)/2;

        this.speedOMeter = new SpeedOMeter(new Vector2d(x,y), radius, fontSize, 5, 0);
    }

    addScore(value) {
        this.score += value;
    }

    addHit() {
        this.collisions++;
        this.drivingElapsed = 0;
    }

    update(speed, tickDelta) {
        this.drivingElapsed += tickDelta;
        this.speedOMeter.updateValue(speed);
    }

    draw(context, isDebug) {
        drawText = drawText.bind(this);
        context.fillStyle = this.color;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        let text = [
            `Hits: ${this.collisions}`, 
            `Time: ${Math.round(this.drivingElapsed/1000)}`, 
            `Score ${this.score}`,
        ];
        drawText();
        this.speedOMeter.draw(context, isDebug);
        
        //TODO: Add cooldown meter for lane changing here
        function drawText() {            
            //Divided by 2 due to the canvas stretching
            let font = Math.floor(this.rect.height / text.length / 2);
            context.font = `${font}px Arial`;
            context.fillStyle = '#ff0f00';
            let cnt = 1;
            let offsetX = 16;
            for (let line of text) {
                let textMetrics = context.measureText(line);
                let offsetY = this.rect.position.y + font * (cnt/text.length) * text.length;
                context.fillText(
                    line, 
                    this.speedOMeter.position.x + this.speedOMeter.radius + offsetX, 
                    offsetY);
                cnt++;
            }
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
        this.collisionCooldownTicks = collisionCooldown;
        this.spriteSheet = spriteSheet;
    }

    update(tickDelta) {
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

    canChangeLane(lane) {
        return !isNaN(lane) && lane !== this.lane && this.canChangeLaneTicks >= this.laneChangeCooldown && !this.targetLaneX;
    }

    changeLane(lane, laneWidth) {        
        this.laneChangeDirection = lane > this.lane ? 'right' : 'left';
        if (this.laneChangeDirection == 'left') {
            laneWidth *= -1;
        }
        
        this.targetLaneX = this.rect.position.x + laneWidth;
        this.lane = lane;
        this.canChangeLaneTicks = 0;
    }

    draw(context, isDebug) {
        this.spriteSheet.draw(context, this.rect, this.clipRect);
        if (!isDebug) return;
        context.strokeStyle = DEBUG_GREEN;
        context.lineWidth = 1;
        context.setLineDash([1, 0]);
        context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }
}

class PlayerVehicle extends Vehicle {
    constructor(rect, clipRect, speed, lane, spriteSheet, audioController) {
        super(rect, clipRect, speed, lane, spriteSheet, LANE_CHANGE_COOLDOWN_SECONDS);
        this.rageMeter = new BarMeter('#ff0000', 10, 10, 4, 10, '#000000');
        this.animQueue = new AnimationQueue();
        this.pubsub = new Pubsub();
        this.audioCtrl = audioController;
        this.setAnimations();
    }

    collision(direction) {
        if (this.collisionCooldownTicks >= this.collisionCooldown) {
            this.pubsub.publish('collision');
            // this.pubsub.publish('score', -20);
            this.animQueue.setState(direction, false);
            this.collisionCooldownTicks = 0;
        }
    }

    changeLane(lane, laneWidth, laneCount) {
        super.changeLane(lane, laneWidth, laneCount);
        this.animQueue.setState(this.laneChangeDirection, true);
        this.audioCtrl.playClip('swerve');
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

    draw(context, isPaused, isDebug) {
        this.animQueue.animate(context, this.rect, isPaused);
        this.rageMeter.draw(context, 
            new Vector2d(this.rect.position.x, this.rect.position.y + this.rageMeter.height/2));
    }
}

class NpcVehicle extends Vehicle {
    constructor(rect, 
            clipRect, 
            speed, 
            lane, 
            spriteSheet, 
            timeToLive, 
            isSpawnAbove, 
            reactionDistanceRange={min: Math.round(VEHICLE_COLLISION_RAYCAST_LENGTH/2), max: VEHICLE_COLLISION_RAYCAST_LENGTH}) {
        super(rect, clipRect, speed, lane, spriteSheet);
        this.initPosition = new Vector2d(rect.position.x, rect.position.y);
        this.health = true;
        this.canDespawn = false;
        this.timeToLive = timeToLive;
        this._ttlTicks = 0;
        this.isSpawnAbove = isSpawnAbove;
        this.spriteSheet = spriteSheet;
        this.reactionDistance = Utility.getRandomIntInclusive(reactionDistanceRange.min, reactionDistanceRange.max);
        this.isTrafficJammed = false;
        this.collision_rect = new Rect(
            new Vector2d(
                this.rect.position.x, 
                this.rect.position.y - this.reactionDistance),
            this.rect.width,
            this.reactionDistance);
    }

    update(tickDelta, roadSpeed) {
        if (this._ttlTicks < this.timeToLive) {
            this._ttlTicks += tickDelta;
        } else {
            this.canDespawn = true;
        }

        let yMod = 1;
        if (roadSpeed == this.speedValue)
            yMod = 0;
        else if (roadSpeed < this.speedValue) {
            yMod *= -1;
        }
        this.rect.position.y += this.speedValue * yMod;

        super.update(tickDelta);//currently holds lane changing logic
        this.collision_rect.position.y = this.rect.position.y - this.reactionDistance;
    }

    draw(context, isDebug) {
        super.draw(context, isDebug);
        this.spriteSheet.draw(context, this.rect, this.clipRect);
        if (!isDebug) return;

        context.strokeStyle = DEBUG_GREEN;
        context.lineWidth = 1;
        context.setLineDash([1, 0]);
        context.strokeRect(
            this.collision_rect.position.x, 
            this.collision_rect.position.y, 
            this.collision_rect.width, 
            this.collision_rect.height);
    }

    isExpired() { return this.canDespawn; }
    isAlive() { return this.health; }
}

class VehiclesOrchestrator {
    constructor(maxCarCount, maxSemiCount, spritesheet, maxSpeed=5, minSpeed=1) {
        this.maxSemiCount = maxSemiCount;
        this._semiCount = 0;
        this.maxCarCount = maxCarCount;
        this._carCount = 0;

        this.spritesheet = spritesheet;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
        this.vehicles = [];
    }

    updateVehicles(tickDelta, road) {
        canDespawnOffscreen = canDespawnOffscreen.bind(this);
        
        for (let vehicle of this.vehicles) {
            vehicle.update(tickDelta, road.speedValue);
        }
        
        let newVehicles = Utility.RemoveAll(this.vehicles, (vehicle) => { return canDespawnOffscreen(vehicle) && vehicle.isAlive() });
        this.vehicles = newVehicles;
        let vehiclesByLane = this.vehicles.reduce((pv, cv) => {
            pv[cv.lane - 1] = pv[cv.lane - 1] || [];
            pv[cv.lane - 1].push(cv);
            return pv;
        }, []);

        for (let laneVehicles of vehiclesByLane) {
            if (!laneVehicles || laneVehicles.length <= 1) continue;
            
            laneVehicles = laneVehicles.sort((a,b) => { 
                return a.rect.position.y > b.rect.position.y ? 1 : a.rect.position.y == b.rect.position.y ? 0 : -1
            });
            let [vehicle, ...otherVehicles] = laneVehicles;
            handleTrafficJam(vehicle, otherVehicles)
        }

        //TODO: fix this
        function handleTrafficJam(vehicle, otherVehicles) {
            if (otherVehicles.length < 1) return;
            for (let otherVehicle of otherVehicles) {
                if (otherVehicle && 
                    // !vehicle.isTrafficJammed && 
                    vehicle.rect.checkCollision(otherVehicle.collision_rect) !== null) {
                    let speed = Math.min(vehicle.speedValue, otherVehicle.speedValue);
                    vehicle.speedValue = speed;
                    otherVehicle.speedValue = speed;
                    vehicle.isTrafficJammed = true;
                }
            }
        }

        function canDespawnOffscreen(vehicle) {
            if (vehicle.isExpired() && 
                (vehicle.rect.position.y + vehicle.rect.height < road.position.y || 
                vehicle.rect.position.y >= road.position.y + road.rects[0].height)) {
                return false;
            }
    
            return true;
        }
    }

    drawVehicles(context, isDebug) {
        for (let vehicle of this.vehicles) {
            vehicle.draw(context, isDebug);
        }
    }

    spawnVehicle(playerVehicle, road, isDriving) {
        if (!isDriving || this.vehicles.length >= this.maxSemiCount + this.maxCarCount) return;

        getLane_By1 = getLane_By1.bind(this);
        getLane_ByPlayer = getLane_ByPlayer.bind(this);
        getLane_ByLeastVehicles = getLane_ByLeastVehicles.bind(this);
        getLane_ByPlayerVehicle = getLane_ByPlayerVehicle.bind(this);

        //Fix logic to return one of the 3 or nothing
        let vehicleType = Utility.getTrueOrFalse() || (this._semiCount < this.maxSemiCount && this._carCount >= this.maxCarCount) ?
            NpcVehicleTypes.SEMI :
                Utility.getTrueOrFalse() ?
                    NpcVehicleTypes.SHEEP :
                    NpcVehicleTypes.COP;
        let width = 0, height = 0;
        switch(vehicleType) {
            case NpcVehicleTypes.SEMI:
                width = 64;
                height = 128;
                this._semiCount++;
            break;
                
            case NpcVehicleTypes.SHEEP:
            case NpcVehicleTypes.COP:
            default:
                width = 64;
                height = 64;
                this._carCount++;
            break;
        }
        let speed = 0;
        let startY = 0;
        let isSpawnAbove = Utility.getTrueOrFalse();
        if (isSpawnAbove) {
            speed = Utility.getRandomIntInclusive(this.minSpeed, this.maxSpeed/2);
            startY = road.position.y - height * 2;
        } else {
            speed = Utility.getRandomIntInclusive(this.maxSpeed/2, this.maxSpeed-2);
            startY = road.rects[0].height;
        }
        
        // let lane = getLane_By1();
        let lane = getLane_ByLeastVehicles();
        let startX = road.position.x + road.getLaneWidth() * (lane) - width - road.stripeWidth;
            
        this.vehicles.push(
            NpcVehicleFactory.create(
                vehicleType,
                new Vector2d(startX, startY), 
                new Vector2d(width, height),
                speed,
                lane,
                this.spritesheet,
                isSpawnAbove));

        function getLane_By1() {
            return 1;
        }
        function getLane_ByPlayer() {
            return playerVehicle.lane;
        }
        function getLane_ByLeastVehicles() {
            if (this.vehicles.length > 1) {
                let t = Utility.fillRange(0, road.laneCount);
                for (let vehicle of this.vehicles) {
                    t[vehicle.lane - 1]++;
                }
                t[playerVehicle.lane - 1]--;
                return t.indexOf(Math.min(...t)) + 1;
            }

            return Utility.getRandomIntInclusive(1, road.laneCount);          
        }
        function getLane_ByPlayerVehicle() {
            if (this.vehicles.length > 1) {
                let t = Utility.fillRange(0, road.laneCount);
                for (let vehicle of this.vehicles) {
                    t[vehicle.lane - 1]++;
                }
            }

            //If the player's current lane has the most number of cars,
            //then place the vehicle in the lane next to the player
            if (playerVehicle.lane == t.indexOf(Math.max(...t))) {
                if (playerVehicle.lane >= road.laneCount) {
                    return playerVehicle.lane - 1;
                } else {
                    return playerVehicle.lane + 1;
                }
            }

            return playerVehicle.lane;
        }
    }
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
                    speed,
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
    constructor(rect, maxSpeed, laneCount=3, stripeWidth=8, stripeLength=16, stripeGap=16, stripeColor='#ffffff') {
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

        this.maxSpeed = this.speedSectionCount = maxSpeed;
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

    draw(context, isDebug) {
        drawLanes = drawLanes.bind(this);
        drawSpeedSections = drawSpeedSections.bind(this);
        getSpeedSectionHeight = getSpeedSectionHeight.bind(this);

        context.fillStyle = 'black';
        context.fillRect(this.position.x-2, this.position.y, this.rects[0].width+8, this.rects[0].height)
        drawLanes(context, this.rects[0]);
        drawLanes(context, this.rects[1]);

        if (isDebug) {
            drawSpeedSections(context);
        }

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
    VehiclesOrchestrator,
    NpcVehicleTypes
}