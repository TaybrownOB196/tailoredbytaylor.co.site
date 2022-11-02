import EngineBase from '../../../lib/gaming/EngineBase';
import { Gameobject, Text, Point2d } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Hud from '../../../lib/gaming/ui/Hud';
import Rect from '../../../lib/gaming/Rect';
import Utility from '../../../lib/Utility';

import './../../../../sass/sandbox.scss';

import { Player, Platform, Cursor } from './gameobjects';

//    cursor: none;
//    cursor: wait;
class Sandbox extends EngineBase {
    constructor() {
        super('Sandbox', 'SandboxContainer');
        
        this.projectiles = [];
        this.cursor = new Cursor(new Rect(new Point2d(0,0), 16, 16), '#00ff00');
        this.hud = new Hud(new Point2d(
            this.DEFAULT_CANVAS_WIDTH - 75, 
            this.DEFAULT_CANVAS_HEIGHT - 24),
            50,
            50,
            { fps: '', mse: '', kbi: ''});
        this.player = new Player(new Rect(
            new Point2d(66,16), 16, 16), 
            '#ff00ff',
            20);
        this.platform = new Platform(new Rect(
            new Point2d(50,100), 100, 18), 
            '#000fff');
        this.platform2 = new Platform(new Rect(
            new Point2d(200,75), 100, 18),
            '#000fff');
        
        this.pointerText = new Text('( , )');
        this.frameRateText = new Text('');

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let click = this.getMousePosition(ev.layerX, ev.layerY);
            this.projectiles.push(this.player.attack(click));
        });
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let msePos = this.getMousePosition(ev.layerX, ev.layerY);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
            // this.player.setPosition(msePos);
            this.cursor.setPosition(msePos);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let msePos = this.getMousePosition(ev.x, ev.y);
            this.hud.update({mse: `(${msePos.x},${msePos.y})`});
            // this.player.setPosition(msePos);
            this.cursor.setPosition(msePos);
        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.hud.update({mse: '( , )'});
            this.cursor.setPosition(new Point2d(-10000, -10000));
        });

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            this.hud.update({kbi: ev.key});
            switch (ev.key) {
                case 'w':
                    this.player.jump();
                break;

                case 'a':
                    this.player.run(-1);
                break;
                
                case 's':
                    
                break;
                
                case 'd':
                    this.player.run(1);
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                    
                break;

                case 'a':
                    this.player.stop();
                break;

                case 's':
                    
                break;

                case 'd':
                    this.player.stop();
                break;
            }
        });
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

    run() {
        super.run();
        let fps = this.getFps();
        this.platform.draw(this.context);
        this.platform2.draw(this.context);
        
        this.player.update(fps/1000);
        this.handleCollisions(
            this.player, 
            [this.platform, this.platform2],
            (result, player, collider) => {
                if (result) {
                    player.rect.position.x -= result.normal.x * result.depth;
                    player.rect.position.y -= result.normal.y * result.depth;
                    if (player.rect.height + player.rect.position.y >= collider.rect.position.y) {
                        player.isGrounded = true;
                    }
                    collider.colorHex = '#ffffff';
                } else {
                    collider.colorHex = '#000fff';
                }
            });
        this.player.draw(this.context);
        this.hud.update({fps: fps});
        this.hud.draw(this.context);

        this.cursor.draw(this.context);
        this.handleCollisions(
            this.cursor, 
            this.projectiles,
            (result, main, collider) => {
                if (result) {
                    collider.ticks = collider.speed;
                    main.takeDamage(-20);
                }
            });

        let newProjectiles = [];
        for (let proj of this.projectiles) {
            proj.update(this.tickDelta);            
            proj.draw(this.context);
            if (proj.isAlive()) {
                newProjectiles.push(proj);
            }
        }
        this.projectiles = newProjectiles;
    }
}

export default Sandbox;