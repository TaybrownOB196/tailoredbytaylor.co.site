import { Rect, Vector2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from '../../../lib/gaming/input';
import EngineBase from '../../../lib/gaming/EngineBase';
import { ParallaxX, ParallaxY } from '../../../lib/gaming/parallax';

import '../../../../sass/olympian.scss';
import detroitSkyline from '../../../../png/detroit_skyline_0.png'

class Olympian extends EngineBase {
    constructor() {
        super('Olympian', 'OlympianContainer');
        this.gameObjects.player = {};            

        this.detroitSkylineSheet = new Spritesheet(detroitSkyline);

        this.pBackground1 = new ParallaxX(
            this.detroitSkylineSheet,
            new Rect(new Vector2d(0,0), 128, 64),
            new Rect(new Vector2d(0,0), 128, 64),
            .1);

        this.keyboardhandler = new Keyboardhandler(window);
        this.keyboardhandler.pubsub.subscribe('keydown', (ev) => {
            switch (ev.key) {
                case 'w':
                break;

                case 'a':
                break;

                case 's':
                break;

                case 'd':
                break;
            }
        });

        this.keyboardhandler.pubsub.subscribe('keyup', (ev) => { 
            switch (ev.key) {
                case 'w':
                break;

                case 'a':
                break;
                
                case 's':
                break;

                case 'd':
                break;
            }
        });

        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            // let click = new Vector2d(
            //     (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
            //     (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));
            
            // if (this.hud.rect.contains(click)) {
            //     this.hud.inventory.ExecuteGrid((row, column) => {
            //         let tile = this.hud.inventory.Get(row, column);
            //         if (tile.rect.contains(click)) {
            //             if (tile.isOccupied()) {
            //                 if (tile.occupant.canWield(this.gameObjects.player.race.power)) {
            //                     if (tile.occupant instanceof Weapon) {
            //                         this.gameObjects.player.equipWeapon(tile.occupant);
            //                         tile.occupant.unsetPosition(tile);
            //                     } else if (tile.occupant instanceof Armor) {
            //                         this.gameObjects.player.equipArmor(tile.occupant);
            //                         tile.occupant.unsetPosition(tile);
            //                     }
            //                 }

            //             }

            //             return true;
            //         }
            //     });
            // } else {
            //     this.roomGrid.ExecuteGrid((row, column) => {
            //         let tile = this.roomGrid.Get(row, column);
            //         if (tile.rect.contains(click)) {
            //             if (this.roomGrid.IsInRange(
            //                 this.gameObjects.player.gridTile.position.x, 
            //                 this.gameObjects.player.gridTile.position.y, 
            //                 column, 
            //                 row)
            //             ) {
            //                 if (tile.isOccupied()) {
            //                     if (tile.occupant instanceof Equipable) {
            //                         // console.log('picking up', tile.occupant.name);
            //                         this.hud.addToInventory(tile.occupant);
            //                         // console.log(tile.occupant);
            //                         tile.occupant.setPosition(new Vector2d(tile.position, tile));
            //                         tile.unsetOccupant(tile.occupant);
            //                     } else {
            //                         this.gameObjects.player.attack(tile);
            //                     }
                                
            //                 } else {
            //                     this.gameObjects.player.setPosition(tile.rect.position, tile);
            //                 }
            //             }

            //             return true;
            //         }
            //     });
            // }
        });
    }

    run() {
        super.run();
        this.pBackground1.draw(this.context);
        this.pBackground1.update(this.tickDelta);
        // this.gameObjects.player.draw(this.context);
    }
}

export default Olympian;