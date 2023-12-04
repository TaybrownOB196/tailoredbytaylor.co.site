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


class Casters extends EngineBase {
    constructor() {
        super('Casters', 'CastersContainer', 360, 640);
        //TODO: Move audio logic into player vehicle class
        this.audio = new Audio();

        this.init(this.canvas.clientWidth, this.canvas.clientHeight);
        this.isGameOver = false;
        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let msePos = this.getMousePositionV2(ev);
        });
        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePositionV2(ev);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePositionV2(ev);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
        });
        
        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            this.hud.update({kbi: ev.key});
            switch (ev.key) {
                case 'e':
                    if (this.ISDEBUG) {
                        this.endGame();
                    }
                    break;
                case 'f':
                    this.toggleFullscreen()
                        .then(_ => {
                            let width = 0, height = 0;
                            if (this.isFullscreen) {
                                width = this.canvas.clientWidth;
                                height = this.canvas.clientHeight;
                            } else {
                                width = this.prevWidth;
                                height = this.prevHeight;
                            }
                            this.sizeCanvas(width, height);
                            this.init(width, height);
                        });
                    break;
                case '0':
                    this.pauseGame();
                    break;
                case 'd':
                    this.ISDEBUG = !this.ISDEBUG;
                    break;
            }
        });
    }

    init(width, height) {
        this.hud = new Hud(new Point2d(
            this.xOffset, this.road.getHeight()),
            64,
            64,
            {
                fps: '', 
                mse: '', 
                kbi: '',
                fs: false,
                spd: this.road.speedIndex
            });

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
    }
    pauseGame() {
        this.modal.toggle(true);
    }
    endGame() {
        this.isGameOver = true;
        //this.modal.toggle(true);
    }
    update() {
        let fps = this.getFps();
        this.hud.update({fps: fps, fs: this.isFullscreen});
    }
    draw() {
        drawGameOver = drawGameOver.bind(this);
        if (this.isGameOver) {
            drawGameOver();
        }

        this.modal.draw(this.context, 
            new Vector2d(
                (this.canvas.clientWidth-this.modalWidth)/2,
                (this.canvas.clientHeight-this.modalHeight)/2));

        if (this.ISDEBUG) {
            this.hud.draw(this.context);
        }

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