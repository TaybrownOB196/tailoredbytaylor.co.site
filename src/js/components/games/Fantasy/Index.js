import { Rect, Vector2d, Spritesheet } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Grid from '../../../lib/grid/Grid';
import EngineBase from '../../../lib/gaming/EngineBase';
import GridTile from './gridTile';
import Hud from './hud';
import { PlayerEntity, LivingEntity } from './entities';
import { Race } from './types';
import { Weapon, Armor, Equipable } from './equipables';

import charactersheet from './../../../../png/character_ss_1.png';
import tilesheet from './../../../../png/tiles_ss_0.png';
import '../../../../sass/fantasy.scss';

//Any trait above level 4 unlocks special skills within that trait
//Level 5 is the highest level for a trait
//Achieving level 4 in all 3 traits unlocks special capabilities
const HUMAN = new Race('HUMAN', 3,3,3);
const ELF = new Race('ELF', 4,1,4);
const ORC = new Race('ORC', 3,5,1);
const DWARF = new Race('DWARF', 3,4,2);
const LESSERDEMON = new Race('DEMON', 1, 1, 1);

class Fantasy extends EngineBase {
    constructor() {
        super('Fantasy', 'FantasyContainer');

        // let grid = new Grid(0, 10, 10);
        // grid.ExecuteGrid((row, column) => {
        //     if (row == 3 && column == 0) 
        //         return true;
        //     console.log(grid.Get(row, column));
        // });

        let tileWidth = 16;
        let tileGap = 2;

        this.tileSpritesheet = new Spritesheet(tilesheet);
        this.characterSpritesheet = new Spritesheet(charactersheet);

        this.gameObjects.player = new PlayerEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth),
            new Rect(new Vector2d(0, 384), 128, 128),
            this.characterSpritesheet,
            ELF);
            
        let EYEBALL = new LivingEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth), 
            new Rect(new Vector2d(0, 256), 128, 128),
            this.characterSpritesheet,
            LESSERDEMON);
        
        const LICHSWORD = new Weapon('lichsword', 5,
            new Rect(new Vector2d(0,0),tileWidth,tileWidth),
            new Rect(
                new Vector2d(256, 384), 
                128, 
                128),
            this.characterSpritesheet,
        5);
        const GREATSWORD = new Weapon('greatsword', 3, 
            new Rect(new Vector2d(0,0),tileWidth,tileWidth),
            new Rect(
                new Vector2d(384, 384), 
                128, 
                128),
            this.characterSpritesheet,
        4);
        const RUSTEDARMOR = new Armor('rustedarmor', 1,
            new Rect(new Vector2d(0,0),tileWidth,tileWidth),
            new Rect(
                new Vector2d(128, 384), 
                128, 
                128),
            this.characterSpritesheet,
        1);

        this.gameObjects.items = [];

        this.gameObjects.enemies = [];
        this.gameObjects.enemies.push(EYEBALL);

        this.backgroundGrid = new Grid(0, 7, 7);

        this.roomGrid = new Grid(0, 7, 7);
        // let _x = (6 * (tileWidth + tileGap)) / 2,
        //     _y = (6 * (tileWidth + tileGap)) / 2;
        let _x = 0,
            _y = 0;
        this.roomGrid.ExecuteGrid((row, column) => {
            let rectPosition = new Vector2d(
                column * (tileWidth + tileGap) + _x, 
                row * (tileWidth + tileGap) + _y);
            let rect = new Rect(
                rectPosition,
                tileWidth,
                tileWidth);

            let tile = new GridTile(new Vector2d(column, row), rect, new Rect(new Vector2d(0,0), 64, 64));
            this.roomGrid.Set(row, column, tile);

            if (row == 3 && column == 3) {
                EYEBALL.setPosition(rectPosition, tile);
            }

            if (row == 0 && column == 3) {
                this.gameObjects.player.setPosition(rectPosition, tile);
            }

            if (row == 0 && column == 0) {
                LICHSWORD.setPosition(rectPosition, tile);
            }
            if (row == 0 && column == 1) {
                RUSTEDARMOR.setPosition(rectPosition, tile);
            }
            if (row == 0 && column == 2) {
                GREATSWORD.setPosition(rectPosition, tile);
            }
        });

        let xOffset = 16;
        let yOffset = 16;
        let rect = new Rect(
            new Vector2d(this.roomGrid.Get(6,6).rect.position.x + this.roomGrid.Get(6,6).rect.width + xOffset, this.roomGrid.Get(0,6).rect.position.y + yOffset),
            this.gameRect.width/2 - xOffset,
            this.gameRect.height - yOffset*2);
        this.hud = new Hud(rect);

        this.keyboardhandler = new Keyboardhandler();
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

        this.pointerhandler = new Pointerhandler();
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let click = new Vector2d(
                (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));
            
            if (this.hud.rect.contains(click)) {
                this.hud.inventory.ExecuteGrid((row, column) => {
                    let tile = this.hud.inventory.Get(row, column);
                    if (tile.rect.contains(click)) {
                        if (tile.isOccupied()) {
                            if (tile.occupant.canWield(this.gameObjects.player.race.power)) {
                                if (tile.occupant instanceof Weapon) {
                                    this.gameObjects.player.equipWeapon(tile.occupant);
                                    tile.occupant.unsetPosition(tile);
                                } else if (tile.occupant instanceof Armor) {
                                    this.gameObjects.player.equipArmor(tile.occupant);
                                    tile.occupant.unsetPosition(tile);
                                }
                            }

                        }

                        return true;
                    }
                });
            } else {
                this.roomGrid.ExecuteGrid((row, column) => {
                    let tile = this.roomGrid.Get(row, column);
                    if (tile.rect.contains(click)) {
                        if (this.roomGrid.IsInRange(
                            this.gameObjects.player.gridTile.position.x, 
                            this.gameObjects.player.gridTile.position.y, 
                            column, 
                            row)
                        ) {
                            if (tile.isOccupied()) {
                                if (tile.occupant instanceof Equipable) {
                                    // console.log('picking up', tile.occupant.name);
                                    this.hud.addToInventory(tile.occupant);
                                    // console.log(tile.occupant);
                                    tile.occupant.setPosition(new Vector2d(tile.position, tile));
                                    tile.unsetOccupant(tile.occupant);
                                } else {
                                    this.gameObjects.player.attack(tile);
                                }
                                
                            } else {
                                this.gameObjects.player.setPosition(tile.rect.position, tile);
                            }
                        }

                        return true;
                    }
                });
            }
        });
    }

    run() {
        super.run();

        this.roomGrid.ExecuteGrid((row, column) => {
            let tile = this.roomGrid.Get(row, column);
            tile.draw(this.context);
        });

        this.hud.draw(this.context, this.characterSpritesheet, this.gameObjects.player);
        
        for (let item of this.gameObjects.items) {
            item.draw(this.context);
        }
        
        for(let enemy of this.gameObjects.enemies) {
            enemy.draw(this.context);
        }

        this.gameObjects.player.draw(this.context);
    }
}

export default Fantasy;