import EngineBase from '../../../lib/gaming/EngineBase';
import { Gameobject, Text, Point2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Hud from '../../../lib/gaming/ui/Hud';
import Rect from '../../../lib/gaming/Rect';
import Utility from '../../../lib/Utility';

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
        console.log(this.player);
        this.hud = new Hud(new Point2d(
            this.gameRect.width - 128, 
            this.gameRect.height - 75),
            100,
            100,
            { fps: '', mse: '', kbi: ''});


        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            // let click = this.getMousePosition(ev.layerX, ev.layerY);
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
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
    }
}

export default Ronin;