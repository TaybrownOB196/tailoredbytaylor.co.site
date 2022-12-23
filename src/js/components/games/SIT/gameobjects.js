import { Gameobject } from '../../../lib/gaming/common';
import PhysicsRect2d from '../../../lib/gaming/PhysicsRect2d';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';

const VehicleDIM = {w: 32, h: 32};
const RoadDIM = {w: 192, h: 192};
const RoadPOS = {x: 60, y: 0};

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
        context.strokeStyle = '#00FF00';
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

class Road extends Gameobject {
    constructor(rect, laneCount=3, stripeWidth=8, stripeLength=16, stripeGap=16, stripeColor='#FFFFFF') {
        super();
        this.position = rect.position;
        this.laneCount = laneCount;
        this.stripeWidth = stripeWidth;
        this.stripeLength = stripeLength;
        this.stripeGap = stripeGap;
        this.stripeColor = stripeColor;

        this.rects = [];
        this.rects.push(rect);
        this.rects.push(new Rect(new Vector2d(rect.position.x, rect.position.y - rect.height), rect.width, rect.height));
        this.speedIndex = 4;
        // this.speeds = [0, 1, 2, 3, 4];
        this.speeds = [0, .5, 1, 1.5, 2];
        this.stripeYOffset = 0;
        this._offsetTick = 0;
        this.rectsIndex = 0;
    }

    update(delta) {
        let _height = this.rects[0].height;
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
            // let laneWidth = (this.getWidth()/2) / this.laneCount;
            for(let idx=0; idx<this.laneCount+1; idx++) {
                context.strokeStyle = this.stripeColor;
                context.lineWidth = this.stripeWidth;
                context.setLineDash([this.stripeLength, this.stripeGap]);
                context.beginPath();
                context.moveTo(
                    rect.position.x + (idx * laneWidth) - (this.stripeWidth/2), 
                    rect.position.y);
                context.lineTo(
                    rect.position.x + (idx * laneWidth) - (this.stripeWidth/2), 
                    rect.position.y + rect.height);
                context.stroke();
            }
        }
    }
    

    getSpeed() { return this.speeds[this.speedIndex]; }
    getHeight() { return this.rects[0].height; }
    getWidth() { return this.rects[0].width * .5; }

    increaseSpeed() { this.changeSpeed(this.speedIndex + 1); }
    decreaseSpeed() { this.changeSpeed(this.speedIndex - 1); }
    changeSpeed(speed) {
        if (speed == this.speedIndex || speed >= this.speeds.length || speed < 0)
            return;
        this.speedIndex = speed;
    }

    getLaneWidth() { return (this.getWidth() * .5) / this.laneCount; }
    getLane(pos) {
        let width = this.getWidth();
        let laneWidth = this.getLaneWidth();
        let idx = 1;
        if (pos.x < 0) {
            return null;
        }
        while(laneWidth * (idx-1) < width && idx <= this.laneCount) {
            console.log(`compare ${pos.x} [${laneWidth * (idx - 1)},${laneWidth * idx}]`);
            if (pos.x >= laneWidth * (idx - 1) && pos.x <= laneWidth * idx) {
                break;
            } else {
                idx++;
            }
        }

        return idx == 0 ? null : idx;
    }
}

export {
    Vehicle,
    Road, 
    RoadDIM, RoadPOS, VehicleDIM
}