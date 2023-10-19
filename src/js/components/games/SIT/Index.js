import EngineBase from '../../../lib/gaming/EngineBase';
import { Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Hud from '../../../lib/gaming/ui/Hud';
import { AudioController, AudioClip } from '../../../lib/gaming/audio/audio';
import { 
    Dashboard,
    PlayerVehicle,
    Road,
    VehiclesOrchestrator
} from './gameobjects';
import {
    TextboxComponentSettings,
    UIContainerFactory,
    UIContainerSettings,
    ButtonComponentSettings
} from '../../../lib/gaming/ui/UIComponentFactory';

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
const SCORE_INCREMENT_SECCONDS = 100;
const ISDEBUG = false;
const START_LANE = 1;
const LANECOUNT = 3;
const ROAD_WIDTH_MULTIPLIER = .7;
const ROAD_HEIGHT_MULTIPLIER = .8;

class SIT extends EngineBase {
    constructor() {
        super('SIT', 'SITContainer', 360, 640);
        this.spritesheet = new Spritesheet(spritesheet);
        this.mainCarSS = new Spritesheet(mainCarSS);
        //TODO: Move audio logic into player vehicle class
        this.audio = new Audio();
        this.audioCtrl = new AudioController(document.getElementById('SITAudio_0'));
        this.audioCtrl.setClip('swerve', new AudioClip(.5, .6));

        this.init(this.canvas.clientWidth, this.canvas.clientHeight);        
        this.drivingScore = 0;
        this.scoreCooldown = 0;
        this.isDriving = false;
        this.isGameOver = false;
        this.vehiclesOrchestrator = new VehiclesOrchestrator(8, 0, this.spritesheet, MAXSPEED, MINSPEED);

        this.spawnTimerIntervalCallback = setInterval(
            () => {
                if (!this.isGameOver && this.isDriving) {
                    this.vehiclesOrchestrator.spawnVehicle(
                        this.player, 
                        this.road, 
                        this.isDriving);
                }
            }, VEHICLE_SPAWN_SECONDS);
        this.incrementScoreCallback = setInterval(
            () => {
                if (!this.isGameOver && this.isDriving) {
                    let score = Math.floor(this.road.speedValue * this.dashboard.drivingElapsed/1000);
                    this.dashboard.addScore(score);
                }
            }, SCORE_INCREMENT_SECCONDS);
                
        this.player.pubsub.subscribe('collision', () => {
            this.drivingScore = this.dashboard.drivingElapsed;
            this.dashboard.addHit();
            this.endGame();
        });

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let msePos = this.getMousePositionV2(ev);
            if (this.modal.isShowing) {
                this.isDriving = false;
                this.modal.handleClick(msePos);
            } else {
                this.isDriving = true;
                this.handleMove(msePos);
            }
        });
        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
            this.isDriving = false;
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePositionV2(ev);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
            
            this.handleMove(msePos);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePositionV2(ev);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
        });
        
        this.keyboardhandler = new Keyboardhandler(window);
        // this.addKeyboardControls(this.keyboardhandler.pubsub);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            this.hud.update({kbi: ev.key});
            switch (ev.key) {
                case 'd':
                    if (ISDEBUG) {
                        this.endGame();
                    }
                    break;
                case 'f':
                    this.toggleFullscreen()
                        .then(_ => {
                            if (this.isFullscreen) {
                                this.sizeCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
                            } else {
                                this.sizeCanvas(this.prevWidth, this.prevHeight);
                            }
                            this.init(this.canvas.clientWidth, this.canvas.clientHeight);
                        });
                    break;
                case '0':
                    this.pauseGame();
                    break;
            }
        });
    }

    init(width, height) {
        console.log(width)
        let roadW = width * ROAD_WIDTH_MULTIPLIER;
        let roadH = height * ROAD_HEIGHT_MULTIPLIER;
        let stripeWidth = 4;
        let laneCount = LANECOUNT;
        this.xOffset = (width - roadW) / 2;
        this.road = new Road(
            new Rect(
                new Vector2d(this.xOffset, 0), 
                roadW, 
                roadH),
            MAXSPEED,
            laneCount,
            stripeWidth);
        this.vehicleDim = VEHICLE_DIM;
        let startX = this.xOffset + this.road.getLaneWidth() *
            (START_LANE) - this.vehicleDim - this.road.stripeWidth;
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
            0,
            START_LANE,
            this.mainCarSS, 
            this.audioCtrl);
        this.dashboard = new Dashboard(
            new Rect(
                new Vector2d(0, this.road.getHeight()),
                width, 
                (height - roadH)),
                '#8f563b');
                
        this.hud = new Hud(new Point2d(
            this.xOffset, this.road.getHeight()),
            VEHICLE_DIM,
            VEHICLE_DIM,
            {
                fps: '', 
                mse: '', 
                kbi: '',
                fs: false,
                spd: this.road.speedIndex
            });

        this.modalWidth = width * .8;
        this.modalHeight = height * .8;
        this.modal = UIContainerFactory.createContainer(new UIContainerSettings(
            'modal',
            this.modalWidth,
            this.modalHeight,
            '#000fff', 
            '#fff000', 
            '2',
            'vertical', 10, 10, 10));
        this.modal.addComponent('headerTxt', new TextboxComponentSettings(
            '#f0f0f0', 
            '#000', 
            1, 
            'PAUSED', 
            '20px Arial',
            '#fff'));
        this.modal.addComponent('resumeBtn', new ButtonComponentSettings(
            '#0f0f0f', 
            '#fff', 
            1, 
            'RESUME', 
            '16px Arial',
            '#fff', 
            () => {
                this.modal.toggle(false);
            },
            '#000',
            '#000'
        ));
        this.modal.addComponent('restartBtn', new ButtonComponentSettings(
            '#0f0f0f', 
            '#fff', 
            1, 
            'RESTART', 
            '16px Arial',
            '#fff', 
            () => {
                this.startGame();
            },
            '#000',
            '#000'
        ));
        this.modal.addComponent('quitBtn', new ButtonComponentSettings(
            '#0f0f0f', 
            '#fff', 
            1, 
            'QUIT', 
            '16px Arial',
            '#fff', 
            () => {
                this.endGame();
            },
            '#000',
            '#000'
        ));
        this.modal.build();
        this.modal.toggle(false);
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
            this.player.rect.position.y = mseY+(this.player.rect.height/2);
        }

        let mseX = msePos.x - this.xOffset;
        let lane = this.road.getLane(mseX);
        if (this.player.canChangeLane(lane)) {
            this.player.changeLane(lane, this.road.getLaneWidth());
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
    startGame() {
        this.isGameOver = false;
        this.modal.toggle(false);
        this.dashboard.resetScore();
        let roadH = this.canvas.clientHeight * ROAD_HEIGHT_MULTIPLIER;
        let startX = this.xOffset + this.road.getLaneWidth() *
            (START_LANE) - this.vehicleDim - this.road.stripeWidth;
        let startY = roadH - this.vehicleDim;
        this.player.rect.position = new Vector2d(startX, startY);
        this.vehiclesOrchestrator.clearVehicles();
    }
    pauseGame() {
        this.isDriving = false;
        this.modal.toggle(true);
    }
    endGame() {
        this.isDriving = false;
        this.isGameOver = true;
        //this.modal.toggle(true);
    }
    update() {
        let fps = this.getFps();
        this.hud.update({fps: fps, fs: this.isFullscreen});

        if (!this.isDriving) return;
        this.dashboard.update(this.road.speedValue, this.tickDelta);
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

                    vehicle.health = false;
                }
            }
        );
    }
    draw() {
        drawGameOver = drawGameOver.bind(this);
        this.road.draw(this.context, ISDEBUG);
        this.vehiclesOrchestrator.drawVehicles(this.context, ISDEBUG);       
        this.player.draw(this.context, !this.isDriving, ISDEBUG);
        this.dashboard.draw(this.context, ISDEBUG);
        if (this.isGameOver) {
            drawGameOver();
        }

        this.hud.draw(this.context);
        this.modal.draw(this.context, 
            new Vector2d(
                (this.canvas.clientWidth-this.modalWidth)/2,
                (this.canvas.clientHeight-this.modalHeight)/2));

        function drawGameOver() {
            this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
            this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

            let text = [
                'GAME OVER',
                `Time: ${Math.floor(this.drivingScore/1000)}`, 
                `Score: ${this.dashboard.score}`,
            ];
            let goHeight = this.canvas.clientHeight/3;
            let font = Math.floor(goHeight / text.length / 2);
            this.context.font = `${font}px Arial`;
            this.context.fillStyle = '#000fff';

            let cnt = 1;
            for (let line of text) {
                let textMetrics = this.context.measureText(line);
                let offsetY = this.gameRect.position.y + goHeight + font * (cnt/text.length) * text.length;
                this.context.fillText(
                    line, 
                    (this.canvas.clientWidth/2) - (Math.ceil(textMetrics.width)/2), 
                    offsetY);
                cnt++;
            }
        }
    }
    run() {
        super.run();
        this.update();
        this.draw();
    }
}

export default SIT;