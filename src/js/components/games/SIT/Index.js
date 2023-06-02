import EngineBase from '../../../lib/gaming/EngineBase';
import { Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Hud from '../../../lib/gaming/ui/Hud';

import { 
    Dashboard,
    PlayerVehicle,
    Road,
    VehiclesOrchestrator
} from './gameobjects';

import './../../../../sass/sit.scss';

import spritesheet from './../../../../png/cars.png';
import mainCarSS from './../../../../png/main_car_ss.png';

//TODO: Implement different vehicle types that have varying performance based on:
    //Acceleration: How quickly vehicle can catch up to the cursor
    //ReactionRange: The distance that a vehicle can see a car infront of it and adjust speed
    //Control: How quickly a vehicle can switch lanes
    //Size: How large vehicle is (hitbox)

const VEHICLE_DIM = 64; 
const MAXSPEED = 5;
const MINSPEED = 1;
const VEHICLE_SPAWN_SECONDS = 2000;

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer', 360, 640);
        let roadW = this.canvas.clientWidth * .7;
        let roadH = this.canvas.clientHeight * .8;
        let laneWidth = 4;
        let startLane = 1;
        let startSpeed = 0;
        let laneCount = 3;
        
        this.xOffset = (this.canvas.clientWidth - roadW) / 2;
        this.isDriving = false;
        this.drivingTimer = 0;
        this.spritesheet = new Spritesheet(spritesheet);
        this.mainCarSS = new Spritesheet(mainCarSS);
        this.vehiclesOrchestrator = new VehiclesOrchestrator(laneCount * 2 - 1, laneCount + 1, this.spritesheet, MAXSPEED, MINSPEED);
        this.road = new Road(
            new Rect(
                new Vector2d(this.xOffset, 0), 
                roadW, 
                roadH),
            MAXSPEED,
            laneCount,
            laneWidth);
        this.audio = new Audio();
        this.vehicleDim = VEHICLE_DIM;
        let startX = this.xOffset + this.road.getLaneWidth() *
            (startLane) - this.vehicleDim - this.road.stripeWidth;
        let startY = roadH - this.vehicleDim;
        this.player = new PlayerVehicle(
            new Rect(
                new Vector2d(startX, startY), 
                this.vehicleDim, 
                this.vehicleDim),
                new Rect(
                new Vector2d(0,192), 
                VEHICLE_DIM,
                VEHICLE_DIM),
                startSpeed,
                startLane,
                this.mainCarSS);
                
        this.spawnTimerIntervalCallback = setInterval(() => this.vehiclesOrchestrator.spawnVehicle(this.player, this.road), VEHICLE_SPAWN_SECONDS);
        this.dashboard = new Dashboard(
            new Rect(
                new Vector2d(0, this.road.getHeight()),
                this.canvas.clientWidth, 
                (this.canvas.clientHeight - roadH)),
                '#8f563b');

        this.player.pubsub.subscribe('collision', () => {
            this.dashboard.addHit();
        });

        this.hud = new Hud(new Point2d(
            this.xOffset, this.road.getHeight()),
            VEHICLE_DIM,
            VEHICLE_DIM,
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
        return new Point2d(t.x, t.y);
    }
    handleMove(msePos) {
        if (!this.isDriving) return;

        let roadHeight = this.road.getHeight();
        this.road.setSpeed((roadHeight - msePos.y)/roadHeight * MAXSPEED);
        if (this.road.speedValue > 0) {
            this.isDriving = true;
        }
        this.hud.update({spd: this.road.speedValue});

        let mseY = msePos.y - this.player.rect.height;
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
    update() {
        let fps = this.getFps();
        this.hud.update({fps: fps});

        if (!this.isDriving) return;
        this.drivingTimer += this.tickDelta;
        this.dashboard.update(this.road.speedValue, this.drivingTimer/1000);
        this.vehiclesOrchestrator.updateVehicles(this.tickDelta, this.road);
        this.road.update(this.tickDelta);
        this.player.update(this.tickDelta, this.frameMultiplier);

        this.handleCollisions(
            this.player, 
            this.vehiclesOrchestrator.vehicles,
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
    }
    draw() {
        this.road.draw(this.context);
        this.vehiclesOrchestrator.drawVehicles(this.context);       
        this.player.draw(this.context, !this.isDriving);
        this.dashboard.draw(this.context);
    }
    run() {
        super.run();
        this.update();
        this.draw();
    }
}

export default SIT;