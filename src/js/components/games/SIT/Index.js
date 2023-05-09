import EngineBase from '../../../lib/gaming/EngineBase';
import Utility from '../../../lib/Utility';
import { Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Hud from '../../../lib/gaming/ui/Hud';

import { 
    Dashboard, 
    Road, 
    PlayerVehicle, 
} from './gameobjects';

import { MAXSPEED, MINSPEED, NpcVehicleFactory, NpcVehicleTypes } from './gameobjects';

import './../../../../sass/sit.scss';

import spritesheet from './../../../../png/cars.png';
import mainCarSS from './../../../../png/main_car_ss.png';

//TODO: Implement different car types that have varying performance based on:
    //Acceleration: How quickly vehicle can catch up to the cursor
    //Control: How quickly a vehicle can switch lanes
    //Size: How large vehicle is (hitbox)
//Vehicle specs

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer');
        this.scaleW = this.DEFAULT_CANVAS_WIDTH/this.canvas.clientWidth;
        this.scaleH = this.DEFAULT_CANVAS_HEIGHT/this.canvas.clientHeight;
        this.spawnVehicle = this.spawnVehicle.bind(this);
        let roadW = this.canvas.clientWidth * .7 * this.scaleW;
        let roadH = this.canvas.clientHeight * .8 * this.scaleH;
        let stripeWidth = 4;
        let laneCount = 3;
        this.xOffset = (this.canvas.clientWidth - roadW) / 2;
        this.spawnTimerIntervalCallback = setInterval(this.spawnVehicle, 2000);
        this.isDriving = false;
        this.spritesheet = new Spritesheet(spritesheet);
        this.mainCarSS = new Spritesheet(mainCarSS);
        this.road = new Road(
            new Rect(
                new Vector2d(this.xOffset/2, 0), 
                roadW, 
                roadH), 
            laneCount,
            stripeWidth * this.scaleW);
        this.audio = new Audio();
        this.vehicleDim = 64;
        let lane = 1;
        let speed = 0;//TODO: initial speed will be calculated based upon start height
        let startX = this.xOffset + 
            this.road.getLaneWidth() * this.scaleW * (lane) - 
            this.vehicleDim * this.scaleW - 
            this.road.stripeWidth;
        let startY = roadH - this.vehicleDim * this.scaleH;
        this.player = new PlayerVehicle(
            new Rect(
                new Vector2d(startX, startY), 
                this.vehicleDim, 
                this.vehicleDim),
            new Rect(
                new Vector2d(0,192), 
                64,
                64),
                speed,
                lane,
                this.mainCarSS);
        
        this.dashboard = new Dashboard(
            new Rect(
                new Vector2d(0, this.road.getHeight()),
                this.canvas.clientWidth, 
                (this.canvas.clientHeight - roadH) * this.scaleH),
                '#8f563b');

        this.player.pubsub.subscribe('collision', () => {
            this.dashboard.addHit();
        });

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
            // let msePos = this.getMousePosition(ev.layerX, ev.layerY);
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

            switch (ev.key) {
                case 'd':
                break;
            }
        });
    }

    getMousePosition(x, y) {
        let t = super.getMousePosition(x,y);
        return new Point2d(t.x * this.scaleW, t.y * this.scaleH);
    }
    handleMove(msePos) {
        if (!this.isDriving) return;

        let roadHeight = this.road.getHeight();
        this.road.setSpeed((roadHeight - msePos.y)/roadHeight * MAXSPEED);
        if (this.road.speedValue > 0) {
            this.isDriving = true;
        }
        this.hud.update({spd: this.road.speedValue});

        let mseY = msePos.y - this.player.rect.height * this.scaleH;
        if (mseY >= 0 && mseY <= this.road.getHeight() - this.player.rect.height) {
            this.player.rect.position.y = mseY;
        }

        if (this.player.canChangeLane()) {
            let mseX = msePos.x - this.xOffset;
            this.player.changeLane(this.road.getLane(mseX), this.road.getLaneWidth());
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
        let lane = Utility.getRandomIntInclusive(1, this.road.laneCount);
        if (this.vehicles.length > 1) {
            let t = Utility.fillRange(0,this.road.laneCount);
            for (let vehicle of this.vehicles) {
                t[vehicle.lane - 1]++;
            }

            lane = t.indexOf(Math.min(t));
        }
        let speed = 0;
        let startX = this.xOffset + 
            this.road.getLaneWidth() * this.scaleW * (lane) - 
            this.vehicleDim * this.scaleW - 
            this.road.stripeWidth;
        let startY = 0;
        let isSpawnAbove = Utility.getTrueOrFalse();
        if (isSpawnAbove) {
            speed = Utility.getRandomIntInclusive(MINSPEED, MAXSPEED/2);
            startY = this.road.position.y - this.vehicleDim * this.scaleH;
        } else {
            speed = Utility.getRandomIntInclusive(MAXSPEED/2, MAXSPEED-2);
            startY = this.road.position.y + this.road.rects[0].height;
        }
        let npc = NpcVehicleFactory.create(
            Utility.getTrueOrFalse() // SEMI or COUPE
                ? NpcVehicleTypes.SEMI 
                : Utility.getTrueOrFalse() // COUPE variants
                    ? NpcVehicleTypes.SHEEP
                    : NpcVehicleTypes.COP,
            new Vector2d(startX, startY), 
            new Vector2d(this.vehicleDim * this.scaleW, this.vehicleDim * this.scaleH),
            speed,
            lane,
            this.spritesheet,
            isSpawnAbove);

        this.vehicles.push(npc);
    }
    update() {
        canDespawnOffscreen = canDespawnOffscreen.bind(this);
        let fps = this.getFps();
        this.hud.update({fps: fps});

        if (!this.isDriving) return;
        this.dashboard.update(this.road.speedValue)
        this.road.update(this.tickDelta);
        this.player.update(this.tickDelta, this.frameMultiplier);
        for (let vehicle of this.vehicles) {
            vehicle.update(this.tickDelta, this.frameMultiplier, this.road);
        }

        this.handleCollisions(
            this.player, 
            this.vehicles,
            (result, player, vehicle) => {
                if (result) {
                    let vCenter = vehicle.rect.center();
                    let pCenter = player.rect.center();
                    let direction = vCenter.y < pCenter.y > 0 ? 'rear' : 'front';
                    player.collision(direction);
                    player.rect.position.x -= result.normal.x * result.depth;

                    vehicle.health = false;
                }
            }
        );

        this.vehicles = Utility.RemoveAll(this.vehicles, (vehicle) => { return !vehicle.isAlive() || canDespawnOffscreen(vehicle) });
    
        function canDespawnOffscreen(vehicle) {
            if (vehicle.isExpired() && 
                (vehicle.rect.position.y + vehicle.rect.height < this.road.position.y || 
                vehicle.rect.position.y >= this.road.position.y + this.road.rects[0].height)) {
                return false;
            }
    
            return true;
        }
    }
    draw() {
        for (let vehicle of this.vehicles) {
            vehicle.draw(this.context);
        }        
        this.road.draw(this.context);
        this.player.draw(this.context);
        this.dashboard.draw(this.context);
    }
    run() {
        super.run();
        this.update();
        this.draw();
    }
}

export default SIT;