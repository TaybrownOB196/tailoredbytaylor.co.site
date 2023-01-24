import { Gameobject } from '../../../lib/gaming/common';
import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Meter from '../../../lib/gaming/ui/Meter';
import { urlToHttpOptions } from 'url';

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
    constructor(rect, clipRect, lane = 1, laneChangeCooldown = 1000) {
        super(rect, 10, null);
        this.clipRect = clipRect;
        this.lane = lane;
        this.laneChangeCooldown = laneChangeCooldown;
        this.laneChangeTicks = laneChangeCooldown;
    }

    update(tickDelta) {
        super.update(tickDelta);
        if (this.laneChangeTicks >= this.laneChangeCooldown) return;
        this.laneChangeTicks += tickDelta;
    }

    draw(context, spriteSheet) {
        spriteSheet.draw(context, this.rect, this.clipRect);
        context.strokeStyle = '#00ff00';
        context.lineWidth = 1;
        context.setLineDash([1, 0]);
        context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
    }

    changeLane(lane, laneWidth) {
        this.lane = lane == null ? this.lane : lane;
        this.rect.position.x += laneWidth;
        this.laneChangeTicks = 0;
    }

    canChangeLane() {
        return this.laneChangeTicks >= this.laneChangeCooldown;
    }
}

class PlayerVehicle extends Vehicle {
    constructor(rect, clipRect) {
        super(rect, clipRect, 1, 1000);
        this.rageMeter = new Meter('#ff0000', 10, 10, 4, 10, '#000000');
    }

    draw(context, spritesheet) {
        super.draw(context, spritesheet);
        this.rageMeter.draw(context, 
            new Vector2d(this.rect.position.x, this.rect.position.y + this.rageMeter.height/2));
    }
}

class NpcVehicle extends Vehicle {
    constructor(rect, clipRect, lane, speed, timeToLive, isSpawnAbove) {
        super(rect, clipRect, lane);
        this.initPosition = new Vector2d(rect.position.x, rect.position.y);
        this.speedIndex = speed;
        this.health = true;
        this.canDespawn = false;
        this.timeToLive = timeToLive;
        this._ttlTicks = 0;
        this.isSpawnAbove = isSpawnAbove;
    }

    update(tickDelta, road) {
        super.update(tickDelta);
        let yMod = road.speeds[this.speedIndex];
        if (road.speedIndex < this.speedIndex)
            yMod *= -1;
        else if (road.speedIndex == this.speedIndex)
            yMod = 0;

        this.rect.position.y += yMod;
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
        this.speedIndex = 1;
        // this.speeds = [0, 1, 2, 3, 4];
        this.speeds = [0, .5, 1, 1.5, 2];
        this.stripeYOffset = 0;
        this._offsetTick = 0;
        this.rectsIndex = 0;
    }

    update(delta) {
        let _height = this.getHeight();
        let otherIndex = this.rectsIndex == 0 ? 1 : 0;
        if (this.rects[this.rectsIndex].position.y > _height) {
            this.rects[this.rectsIndex].position.y = this.rects[otherIndex].position.y - _height;
            this.rectsIndex = otherIndex;
            this.rects[otherIndex].position.y += this.getSpeed();
        } else {
            this.rects[this.rectsIndex].position.y += this.getSpeed();
            this.rects[otherIndex].position.y = this.rects[this.rectsIndex].position.y - this.rects[otherIndex].height;
        }
    }

    draw(context) {
        drawLanes = drawLanes.bind(this);

        drawLanes(context, this.rects[0]);
        drawLanes(context, this.rects[1]);

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
    }
    

    getSpeed() { return this.speeds[this.speedIndex]; }
    getHeight() { return this.rects[0].height; }
    getWidth() { return this.rects[0].width; }

    increaseSpeed() { this.changeSpeed(this.speedIndex + 1); }
    decreaseSpeed() { this.changeSpeed(this.speedIndex - 1); }
    changeSpeed(speed) {
        if (speed == this.speedIndex || speed >= this.speeds.length || speed < 0)
            return;
        this.speedIndex = speed;
    }

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