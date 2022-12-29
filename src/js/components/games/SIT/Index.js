import EngineBase from '../../../lib/gaming/EngineBase';
import { Text, Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Hud from '../../../lib/gaming/ui/Hud';
import Rect from '../../../lib/gaming/Rect';

import { Dashboard, Road, Vehicle, NpcVehicle } from './gameobjects';

import './../../../../sass/sit.scss';
import spritesheet from './../../../../png/cars.png'

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer');
        this.scaleW = this.DEFAULT_CANVAS_WIDTH/this.canvas.clientWidth;
        this.scaleH = this.DEFAULT_CANVAS_HEIGHT/this.canvas.clientHeight;

        let roadW = this.canvas.clientWidth * .7;
        let roadH = this.canvas.clientHeight * .8;
        let stripeWidth = 8;
        let laneCount = 3;
        this.xOffset = Math.ceil(this.canvas.clientWidth - roadW);

        this.isDriving = false;
        this.speedIndex = 0;
        this.spritesheet = new Spritesheet(spritesheet);
        this.road = new Road(
            new Rect(
                new Vector2d(this.xOffset, 0), 
                roadW * this.scaleW, 
                roadH * this.scaleH), 
            laneCount, 
            stripeWidth);
        
        this.vehicleDim = Math.ceil(this.road.getLaneWidth()) - stripeWidth;
        // let startX = ((this.canvas.clientWidth - roadW) * this.scaleW) - stripeWidth;
        let lane = 1;
        let startX = this.xOffset * this.scaleW + 
            this.road.getLaneWidth() * this.scaleW * (lane - 1) - 
            (this.vehicleDim / 2) * this.scaleW - 
            stripeWidth * this.scaleW;
        let startY = roadH * this.scaleH - this.vehicleDim * this.scaleH;
        this.player = new Vehicle(
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
                '#0F00F0');

        this.vehicles = [];
        this.maxVehicles = 3;

        this.hud = new Hud(new Point2d(
            this.DEFAULT_CANVAS_WIDTH - 75, 
            this.DEFAULT_CANVAS_HEIGHT - 24),
            50,
            50,
            { fps: '', mse: '', kbi: '', spd: this.road.speedIndex});

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
            if (!this.isDriving) return;
            switch (ev.key) {
                case 'e':
                    this.spawnVehicle();
                break;
            }
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

    changeLane(mseX, vehicle, road) {
        let lane = road.getLane(mseX);
        if (!lane || lane == vehicle.lane) return;
        
        let side = lane > vehicle.lane ? 'right' : 'left';
        let laneWidth = road.getLaneWidth();
        console.log(`${vehicle.lane} -> ${lane}`)
        if (side == 'left' && vehicle.lane > 1) {
            laneWidth *= -1;
            vehicle.changeLane(lane, laneWidth);
        } else if (side == 'right' && vehicle.lane < road.laneCount) {
            vehicle.changeLane(lane, laneWidth);
        }
    }

    handleMove(msePos) {
        if (!this.isDriving) return;

        this.road.changeSpeed(this.getSpeedSection(msePos));
        if (this.road.speedIndex == 0) {
            this.isDriving = false;
        } else {
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

        console.log('spawn vehicle');
        let lane = 1;
        let speed = 2;
        let startX = this.xOffset * this.scaleW + 
            this.road.getLaneWidth() * this.scaleW * (lane - 1) - 
            (this.vehicleDim / 2) * this.scaleW - 
            this.road.stripeWidth * this.scaleW;
        this.vehicles.push(new NpcVehicle(
            new Rect(
                new Vector2d(startX, 60), 
                this.vehicleDim * this.scaleW, 
                this.vehicleDim * this.scaleH),
            new Rect(
                new Vector2d(0,256), 
                64,
                64),
            lane, speed));
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
        this.player.draw(this.context, this.spritesheet);
        for (let vehicle of this.vehicles) {
            vehicle.draw(this.context, this.spritesheet);
        }

        if (this.isDriving) {
            this.road.update(this.tickDelta);
            this.player.update(this.tickDelta);
            for (let vehicle of this.vehicles) {
                vehicle.update(this.tickDelta, this.road);
            }
        }

        this.dashboard.draw(this.context);

        this.drawSpeedSections();
        this.hud.update({fps: fps});
        this.hud.draw(this.context);
    }
}

export default SIT;