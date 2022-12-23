import EngineBase from '../../../lib/gaming/EngineBase';
import { Text, Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Hud from '../../../lib/gaming/ui/Hud';
import Rect from '../../../lib/gaming/Rect';

import { RoadPOS, RoadDIM, VehicleDIM, Vehicle, Road } from './gameobjects';

import './../../../../sass/sit.scss';
import spritesheet from './../../../../png/cars.png'

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer');
        this.scaleW = this.DEFAULT_CANVAS_WIDTH/this.canvas.clientWidth;
        this.scaleH = this.DEFAULT_CANVAS_HEIGHT/this.canvas.clientHeight;

        this.isDriving = false;
        this.speedIndex = 0;
        this.spritesheet = new Spritesheet(spritesheet);
        let startHeight = RoadDIM.h * this.scaleH - VehicleDIM.h * this.scaleH;
        this.xOffset = RoadPOS.x;
        this.yOffset = 0;
        this.player = new Vehicle(
            new Rect(
                new Vector2d(RoadPOS.x, startHeight), 
                VehicleDIM.w * this.scaleW, 
                VehicleDIM.h * this.scaleH),
            new Rect(
                new Vector2d(0,192), 
                64,
                64));
        this.road = new Road(
            new Rect(
                new Vector2d(RoadPOS.x, RoadPOS.y), 
                RoadDIM.w * this.scaleW, 
                RoadDIM.h * this.scaleH));

        console.log(`scale ${this.scaleW} X ${this.scaleH}`);
        this.vehicles = [];
        this.maxVehicles = 5;
        this.hud = new Hud(new Point2d(
            this.DEFAULT_CANVAS_WIDTH - 75, 
            this.DEFAULT_CANVAS_HEIGHT - 24),
            50,
            50,
            { fps: '', mse: '', kbi: '', spd: this.road.speedIndex});
        
        this.pointerText = new Text('( , )');
        this.frameRateText = new Text('');

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.isDriving = true;
        });
        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.isDriving = false;
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});

            if (!this.isDriving) return;
            this.road.changeSpeed(this.getSpeedSection(msePos));
            this.hud.update({spd: this.road.speedIndex});
            if (this.player.canChangeLane()) {
                this.changeLane(msePos, this.player, this.road);
            }
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
        });
    }
    
    getSpeedSectionHeight() { return this.road.getHeight() / this.road.speeds.length; }
    getSpeedSection(pos) {
        //TODO: Fix scaling here
        let speedSectionHeight = this.getSpeedSectionHeight() * 2;
        let index = this.road.speeds.length;
        for (let idx=0; idx<this.road.speeds.length; idx++) {
            if (pos.y >= speedSectionHeight * idx && pos.y <= speedSectionHeight * (idx + 1)) {
                return index;
            }

            index--;
        }

        return 0;
    }
    drawSpeedSections() {
        this.context.strokeStyle = '#00FF00';
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

    changeLane(msePos, vehicle, road) {
        let pos = new Vector2d(msePos.x, msePos.y);
        pos.x -= RoadPOS.x * .5;
        let lane = road.getLane(pos);
        // console.log(lane);
        // console.log(`compare ${lane}:${vehicle.lane} mseX ${msePos.x}`);
        if (!lane || lane == vehicle.lane) return;
        
        let side = lane > vehicle.lane ? 'right' : 'left';
        let laneWidth = road.getLaneWidth() * 2;
        console.log(`${vehicle.lane} -> ${lane}`)
        if (side == 'left' && vehicle.lane > 1) {
            laneWidth *= -1;
            vehicle.changeLane(lane, laneWidth);
        } else if (side == 'right' && vehicle.lane < road.laneCount) {
            vehicle.changeLane(lane, laneWidth);
        }
    }

    handleCollisions(player, colliders, resolution) {
        if (!colliders || colliders.length < 1) return;
        player.isGrounded = false;
        for (let collider of colliders) {
            let result = player.rect.checkCollision(collider.rect);
            if (resolution) {
                resolution(result, player, collider);
            }
        }
    }

    spawnVehicle() {
        if (this.vehicles.length >= this.maxVehicles) return;

        this.vehicles.push(new Vehicle(
            new Rect(
                new Vector2d(RoadPOS.x, startHeight), 
                VehicleDIM.w * this.scaleW, 
                VehicleDIM.h * this.scaleH),
            new Rect(
                new Vector2d(0,256), 
                64,
                64)));
    }

    run() {
        super.run();
        let fps = this.getFps();
        
        // this.handleCollisions(
        //     this.player, 
        //     [this.platform, this.platform2],
        //     (result, player, collider) => {
        //         if (result) {
        //             player.rect.position.x -= result.normal.x * result.depth;
        //             player.rect.position.y -= result.normal.y * result.depth;
        //             if (player.rect.height + player.rect.position.y >= collider.rect.position.y) {
        //                 player.isGrounded = true;
        //             }
        //             collider.colorHex = '#ffffff';
        //         } else {
        //             collider.colorHex = '#000fff';
        //         }
        //     });
        this.hud.update({fps: fps});
        this.hud.draw(this.context);
        // this.handleCollisions(
        //     this.cursor, 
        //     this.projectiles,
        //     (result, main, collider) => {
        //         if (result) {
        //             collider.ticks = collider.speed;
        //             main.takeDamage(-20);
        //         }
        //     });

        this.road.draw(this.context);
        this.player.draw(this.context, this.spritesheet, {w:this.scaleW, h:this.scaleH});
        for (let vehicle of this.vehicles) {
            vehicle.draw(this.context);
        }
        
        if (this.isDriving) {
            this.road.update(this.tickDelta);
            this.player.update(this.tickDelta);
            for (let vehicle of this.vehicles) {
                vehicle.update(this.tickDelta);
            }
        }

        this.drawSpeedSections();
    }
}

export default SIT;