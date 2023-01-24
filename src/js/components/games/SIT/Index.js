import EngineBase from '../../../lib/gaming/EngineBase';
import Utility from '../../../lib/Utility';
import { Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';

import Hud from '../../../lib/gaming/ui/Hud';
import { Dashboard, Road, PlayerVehicle, NpcVehicle } from './gameobjects';

import './../../../../sass/sit.scss';
import spritesheet from './../../../../png/cars.png'

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer');
        this.scaleW = this.DEFAULT_CANVAS_WIDTH/this.canvas.clientWidth;
        this.scaleH = this.DEFAULT_CANVAS_HEIGHT/this.canvas.clientHeight;

        this.spawnVehicle = this.spawnVehicle.bind(this);
        let roadW = this.canvas.clientWidth * .7;
        let roadH = this.canvas.clientHeight * .8;
        let stripeWidth = 4;
        let laneCount = 3;
        this.xOffset = Math.ceil((this.canvas.clientWidth - roadW * this.scaleW) / 2);
        this.spawnTimerIntervalCallback = setInterval(this.spawnVehicle, 5000);
        this.isDriving = false;
        this.speedIndex = 0;
        this.spritesheet = new Spritesheet(spritesheet);
        this.road = new Road(
            new Rect(
                new Vector2d(this.xOffset, 0), 
                roadW * this.scaleW, 
                roadH * this.scaleH), 
            laneCount,
            stripeWidth * this.scaleW);
        
        this.vehicleDim = Math.ceil(this.road.getLaneWidth()) - this.road.stripeWidth;
        let lane = 1;
        let startX = this.xOffset + 
            this.road.getLaneWidth() * this.scaleW * (lane) - 
            this.vehicleDim * this.scaleW - 
            this.road.stripeWidth;
        let startY = roadH * this.scaleH - this.vehicleDim * this.scaleH;
        this.player = new PlayerVehicle(
            new Rect(
                new Vector2d(startX, startY), 
                this.vehicleDim * this.scaleW, 
                this.vehicleDim * this.scaleH),
            new Rect(
                new Vector2d(0,192), 
                64,
                64), lane);
        
        this.dashboard = new Dashboard(
            new Rect(
                new Vector2d(this.xOffset, this.road.getHeight()),
                roadW * this.scaleW, 
                (this.canvas.clientHeight - roadH) * this.scaleH),
                '#8f563b');

        this.vehicles = [];
        this.maxVehicles = laneCount;

        this.hud = new Hud(new Point2d(
            this.xOffset, this.road.getHeight()),
            50,
            50,
            { fps: '', mse: '', kbi: '', spd: this.road.speedIndex});

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.isDriving = true;
            this.handleMove(msePos);
        });
        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.isDriving = false;
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});

            this.handleMove(msePos);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
        });

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            this.hud.update({kbi: ev.key});
        });
    }

    getMousePosition(x, y) {
        let t = super.getMousePosition(x,y);
        return new Point2d(t.x * this.scaleW, t.y * this.scaleH);
    }
    getSpeedSectionHeight() { return this.road.getHeight() / this.road.speeds.length; }
    getSpeedSection(pos) {
        //TODO: Fix scaling here
        let speedSectionHeight = this.getSpeedSectionHeight();
        let index = this.road.speeds.length-1;
        for (let idx=0; idx<this.road.speeds.length; idx++) {
            if (pos.y >= speedSectionHeight * idx && pos.y <= speedSectionHeight * (idx + 1)) {
                return index;
            }

            index--;
        }

        return 0;
    }
    drawSpeedSections() {
        this.context.strokeStyle = '#00ff00';
        let speedSectionHeight = this.getSpeedSectionHeight();
        for (let idx=0; idx<this.road.speeds.length; idx++) {
            this.context.lineWidth = 1;
            this.context.setLineDash([1,0]);
            this.context.beginPath();
            this.context.moveTo(
                this.road.position.x, 
                speedSectionHeight * idx);
            this.context.lineTo(
                this.road.position.x + this.road.getWidth(), 
                speedSectionHeight * idx);
            this.context.stroke();
        }
    }
    changeLane(mseX, vehicle, road) {
        let lane = road.getLane(mseX);
        if (!lane || lane == vehicle.lane) return;
        
        let side = lane > vehicle.lane ? 'right' : 'left';
        let laneWidth = road.getLaneWidth();
        if (side == 'left') {
            laneWidth *= -1;
            vehicle.changeLane(vehicle.lane - 1, laneWidth);
        } else if (side == 'right' && vehicle.lane < road.laneCount) {
            vehicle.changeLane(vehicle.lane + 1, laneWidth);
        }
    }
    handleMove(msePos) {
        if (!this.isDriving) return;

        this.road.changeSpeed(this.getSpeedSection(msePos));
        if (this.road.speedIndex != 0) {
            this.isDriving = true;
        }
        this.hud.update({spd: this.road.speedIndex});

        let mseY = msePos.y - this.player.rect.height * this.scaleH;
        if (mseY >= 0 && mseY <= this.road.getHeight() - this.player.rect.height) {
            this.player.rect.position.y = mseY;
        }

        if (this.player.canChangeLane()) {
            let mseX = msePos.x - this.xOffset;
            this.changeLane(mseX, this.player, this.road);
        }
    }
    handleCollisions(player, vehicles, resolution) {
        if (!vehicles || vehicles.length < 1) return;
        for (let vehicle of vehicles) {
            let result = player.rect.checkCollision(vehicle.rect);
            if (resolution) {
                resolution(result, player, vehicle);
            }
        }
    }
    spawnVehicle() {
        if (this.vehicles.length >= this.maxVehicles || !this.isDriving) return;

        let timeToLive = 2000;
        let spawnAbove = Utility.getTrueOrFalse();
        let lane = Utility.getRandomIntInclusive(1, this.road.laneCount);
        let speed = 0;
        let startX = this.xOffset + 
            this.road.getLaneWidth() * this.scaleW * (lane) - 
            this.vehicleDim * this.scaleW - 
            this.road.stripeWidth;
        let startY = 0;
        if (spawnAbove) {
            speed = Utility.getRandomIntInclusive(1, 1);
            startY = this.road.position.y - this.vehicleDim * this.scaleH;
        } else {
            speed = Utility.getRandomIntInclusive(this.road.speeds.length/2, this.road.speeds.length-1);
            startY = this.road.position.y + this.road.rects[0].height;
        }
        this.vehicles.push(new NpcVehicle(
            new Rect(
                new Vector2d(startX, startY),
                this.vehicleDim * this.scaleW, 
                this.vehicleDim * this.scaleH),
            new Rect(
                new Vector2d(0,256),
                64,
                64),
            lane,
            speed,
            timeToLive,
            spawnAbove));
    }
    canDespawnOffscreen(vehicle) {
        if (vehicle.isExpired() && 
            (vehicle.rect.position.y + vehicle.rect.height < this.road.position.y || 
            vehicle.rect.position.y >= this.road.position.y + this.road.rects[0].height)) {
            console.log('despawn vehicle', this.vehicles);
            return false;
        }

        return true;
    }
    update() {
        let fps = this.getFps();
        this.hud.update({fps: fps});

        if (!this.isDriving) return;
        this.road.update(this.tickDelta);
        this.player.update(this.tickDelta);
        for (let vehicle of this.vehicles) {
            vehicle.update(this.tickDelta, this.road);
        }

        this.handleCollisions(
            this.player, 
            this.vehicles,
            (result, player, vehicle) => {
                if (result) {
                    let vCenter = vehicle.rect.center();
                    let pCenter = player.rect.center();
                    console.log(`${ vCenter.x < pCenter.x > 0 ? 'left' : 'right'}`);
                    console.log(`${ vCenter.y < pCenter.y > 0 ? 'down' : 'up'}`);
                    player.rect.position.x -= result.normal.x * result.depth;

                    vehicle.health = false;
                }
            }
        );

        this.vehicles = Utility.RemoveAll(this.vehicles, (vehicle) => { return !vehicle.isAlive() || this.canDespawnOffscreen(vehicle) });
    }
    draw() {
        //this.hud.draw(this.context);

        for (let vehicle of this.vehicles) {
            vehicle.draw(this.context, this.spritesheet);
        }        
        this.road.draw(this.context);
        this.player.draw(this.context, this.spritesheet);
        this.dashboard.draw(this.context);

        this.drawSpeedSections();
    }
    run() {
        super.run();
        this.update();
        this.draw();
    }
}

export default SIT;