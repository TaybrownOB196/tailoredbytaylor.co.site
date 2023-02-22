import EngineBase from '../../../lib/gaming/EngineBase';
import { Gameobject, Text, Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Hud from '../../../lib/gaming/ui/Hud';
import Rect from '../../../lib/gaming/Rect';
import Utility from '../../../lib/Utility';
import { UIContainerSettings,
    UIContainerFactory } from '../../../lib/gaming/ui/UIContainerFactory';
import { TextboxComponentSettings,
    ButtonComponentSettings } from '../../../lib/gaming/ui/UIComponentFactory';
    
import './../../../../sass/ronin.scss';
import _spritesheet from './../../../../png/ronin_ss_.png';

import { Player, Platform, Npc } from './gameobjects';

const RIGHT = 1;
const LEFT = -1;

class Ronin extends EngineBase {
    constructor() {
        super('Ronin', 'RoninContainer', 854, 480);
        this.scaleX = this.gameRect.width / this.DEFAULT_CANVAS_WIDTH;
        this.scaleY = this.gameRect.height / this.DEFAULT_CANVAS_HEIGHT;
        this.spritesheet = new Spritesheet(_spritesheet);
        this.player = new Player(
            new Rect(
                new Point2d(16, 16), 
                80, 
                128), 
            100, this.spritesheet, true);
        this.hud = new Hud(new Point2d(
            this.gameRect.width - 128,
            this.gameRect.height - 75),
            100,
            100,
            { fps: '', mse: '', kbi: ''});

        let modalWidth = this.gameRect.width * .33;
        let modalHeight = this.gameRect.height * .75;
        this.modal = UIContainerFactory.createContainer(new UIContainerSettings(
            'modal',
            modalWidth,
            modalHeight,
            '#000fff', 
            '#fff000', 
            '2',
            'vertical', 10, 10, 10));
        this.modal.addComponent('menuHeaderTxt', new TextboxComponentSettings(
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
        this.modal.addComponent('settingsBtn', new ButtonComponentSettings(
            '#0f0f0f', 
            '#fff', 
            1, 
            'SETTINGS', 
            '16px Arial',
            '#fff', 
            () => {
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
            },
            '#000',
            '#000'
        ));
        this.modal.build();
        this.modal.toggle(false);

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            let resumeBtn = this.modal.getComponent('resumeBtn');
            if (resumeBtn.contains(msePos)) {
                resumeBtn.handleClick();
            }
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
            let resumeBtn = this.modal.getComponent('resumeBtn');
            if (resumeBtn.contains(msePos)) {
                resumeBtn.isHover = true;
            } else {
                
                resumeBtn.isHover = false;
            }
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePosition(ev.x, ev.y);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
        });

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            this.hud.update({kbi: ev.key});
            switch (ev.key) {
                case 'w':
                case 'ArrowUp':
                    this.player.jump();
                break;
                
                case 's':
                case 'ArrowDown':
                break;
                
                case 'a':
                case 'ArrowLeft':
                    if (!this.keyboardhandler.keyStateMap['d'] 
                        && !this.keyboardhandler.keyStateMap['ArrowRight']) {
                        this.player.sprint(LEFT);
                    }
                break;
                
                case 'e':
                    this.player.attack();
                break;

                case 'd':
                case 'ArrowRight':
                    if (!this.keyboardhandler.keyStateMap['a'] 
                    && !this.keyboardhandler.keyStateMap['ArrowLeft']) {
                    this.player.sprint(RIGHT);
                }
                break;

                case '$':
                    console.log(this.player);
                break;

                case 'Escape':
                    this.modal.toggle(true);
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                case 'ArrowUp':
                break;
                
                case 's':
                case 'ArrowDown':
                break;

                case 'a':
                case 'ArrowLeft':
                    this.player.halt();
                break;
                
                case 'd':
                case 'ArrowRight':
                    this.player.halt();
                break;
            }
        });

        this.context.scale(1/this.scaleX, 1/this.scaleY);
    }

    run() {
        super.run();
        let fps = this.getFps();

        this.player.update();
        this.player.handleCollisions([], this.gameRect);
        this.player.draw(this.context);
        this.hud.update({fps: fps});
        this.hud.draw(this.context);

        let modalPos = new Vector2d(
            (this.gameRect.width - this.modal.settings.width)/2, 
            (this.gameRect.height - this.modal.settings.height)/2);
        this.modal.draw(this.context, modalPos);
    }
}

export default Ronin;