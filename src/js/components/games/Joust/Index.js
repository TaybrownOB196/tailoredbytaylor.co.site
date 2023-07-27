import EngineBase from '../../../lib/gaming/EngineBase';
import { Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import Hud from '../../../lib/gaming/ui/Hud';
import { AudioController, AudioClip } from '../../../lib/gaming/audio/audio';
import {
    TextboxComponentSettings,
    UIContainerFactory,
    UIContainerSettings,
    ButtonComponentSettings
} from '../../../lib/gaming/ui/UIComponentFactory';
import { Barrier, Jouster, Mount, Rider } from './gameobjects';

import spritesheet from './../../../../png/joust_00.png';

import './../../../../sass/joust.scss';

const ISDEBUG = false;
const HUD_DIM = 64;
const PLYR_DIM = 96;
const SPRT_DIM = 64;

class Joust extends EngineBase {
    constructor() {
        super('Joust', 'JoustContainer', 854, 480);
        this.spritesheet = new Spritesheet(spritesheet);
        this.isGameOver = false;
        this.init(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    onResize(width, height) {
        this.init(width, height);
    }

    init(width, height) {
        const barrierWidth = width - (PLYR_DIM * 2);
        const barrierHeight = 128;
        const barrierX = (width - barrierWidth)/2;
        const barrierY = (height - barrierHeight * .2)/2;
        this.barrier = new Barrier(
            new Rect(
                new Vector2d(barrierX, barrierY), 
                barrierWidth, 
                barrierHeight));

        this.player = new Jouster(
            new Rect(new Vector2d(0,0), PLYR_DIM, PLYR_DIM),
            new Rect(new Vector2d(0,0), SPRT_DIM, SPRT_DIM),
            this.spritesheet,
            new Rider(),
            new Mount()
        );

        this.otherPlayer = new Jouster(
            new Rect(new Vector2d(this.canvas.clientWidth - PLYR_DIM,0), PLYR_DIM, PLYR_DIM),
            new Rect(new Vector2d(0,0), SPRT_DIM, SPRT_DIM),
            this.spritesheet,
            new Rider(),
            new Mount()
        );

        this.hud = new Hud(new Point2d(
            0, 0),
            HUD_DIM,
            HUD_DIM,
            { 
                fps: '', 
                mse: '', 
                kbi: '', 
            });

        this.modalWidth = this.canvas.clientWidth * .8;
        this.modalHeight = this.canvas.clientHeight * .8;
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

    startGame() {
        this.isGameOver = false;
        this.modal.toggle(false);
    }
    pauseGame() {
        this.isDriving = false;
        this.modal.toggle(true);
    }
    endGame() {
        this.isGameOver = true;
        this.modal.toggle(true);
    }
    update() {
        let fps = this.getFps();
        this.hud.update({fps: fps});
    }
    draw() {
        drawGameOver = drawGameOver.bind(this);
        if (this.isGameOver) {
            drawGameOver();
        }

        this.otherPlayer.draw(this.context);
        this.barrier.draw(this.context);
        this.player.draw(this.context);

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

export default Joust;