import EngineBase from '../../../lib/gaming/EngineBase';
import { Gameobject, Text, Point2d } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Vector2d from '../../../lib/gaming/Vector2d';
import Rect from '../../../lib/gaming/Rect';
import './../../../../sass/punchykicky.scss';

import { Player, Platform } from './gameobjects';

class PunchyKicky extends EngineBase {
    constructor() {
        super('PunchyKicky', 'PunchyKickyContainer');
        this.player = new Player(new Rect(
            new Point2d(66,16), 16, 16), 
            '#ff00ff',
            20,
            1);
        this.platform = new Platform(new Rect(
            new Point2d(50,100), 100, 18), 
            '#000fff');
        this.platform2 = new Platform(new Rect(
            new Point2d(200,75), 100, 18),
            '#000fff');
        
        this.pointerText = new Text('( , )');
        this.frameRateText = new Text('');

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let click = this.getClick(ev.offsetX, ev.y);
            this.pointerText.value = `(${click.x},${click.y})`;

            this.player.setPosition(click);
        });
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            let click = this.getClick(ev.offsetX, ev.y);
            this.pointerText.value = `(${click.x},${click.y})`;
            this.player.setPosition(click);

        });
        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.pointerText.value = '( , )';
        });

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
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
    
    handleCollisions(player, colliders) {
        if (!colliders || colliders.length < 1) return;
        player.isGrounded = false;
        for (let collider of colliders) {
            let result = player.rect.checkCollision(collider.rect);
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
        }
    }

    run() {
        super.run();
        let fps = this.getFps();
        this.platform.draw(this.context);
        this.platform2.draw(this.context);
        
        this.player.update(fps/1000);
        this.handleCollisions(this.player, [this.platform, this.platform2]);
        this.player.draw(this.context);
        
        this.frameRateText.value = fps;
        this.frameRateText.draw(this.context,
            new Point2d(
                this.DEFAULT_CANVAS_WIDTH - 75, 
                this.DEFAULT_CANVAS_HEIGHT - 24));

        this.pointerText.draw(this.context, 
            new Point2d(
                this.DEFAULT_CANVAS_WIDTH - 75, 
                this.DEFAULT_CANVAS_HEIGHT - 10));
    }
}

export default PunchyKicky;