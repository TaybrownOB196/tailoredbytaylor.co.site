import { Rect, Vector2d, Physics2d, Sprite, Spritesheet, IDGenerator, Gameobject } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import Grid from '../../../lib/grid/Grid';
import EngineBase from '../../../lib/gaming/EngineBase';
import Hud from './hud';
import { PlayerEntity, LivingEntity } from './entities';

import charactersheet from './../../../../png/character_ss_1.png';
import tilesheet from './../../../../png/tiles_ss_0.png';
import '../../../../sass/fantasy.scss';

class Race {
    constructor(name, lifeSpan, power, intelligence) {
        this.name = name;
        this.lifeSpan = lifeSpan;
        this.power = power;
        this.intelligence = intelligence;
    }
}

//Any trait above level 4 unlocks special skills within that trait
//Level 5 is the highest level for a trait
//Achieving level 4 in all 3 traits unlocks special capabilities

const HUMAN = new Race('HUMAN', 3,3,3);
const ELF = new Race('ELF', 4,1,4);
const ORC = new Race('ORC', 3,5,1);
const DWARF = new Race('DWARF', 3,4,2);
const LESSERDEMON = new Race('DEMON', 1, 1, 1);

class GridTile {
    constructor(gridPosition, rect, clipRect) {
        this.position = gridPosition;
        this.rect = rect;
        this.clipRect = clipRect;
        this.entity = null;
    }

    draw(context, spritesheet) { spritesheet.draw(context, this.rect, this.clipRect); }
    isOccupied() { return this.entity !== null; }
    setEntity(entity) {
        if (this.isOccupied())
            return;

        this.entity = entity;
        entity.gridTile = this;
    }
    unsetEntity(entity) {
        this.entity = null;
        entity.gridTile = null;
    }
}

class Fantasy extends EngineBase {
    constructor() {
        super('Fantasy', 'FantasyContainer');

        let tileWidth = 16;
        let tileGap = 2;

        this.tileSpritesheet = new Spritesheet(tilesheet);
        this.characterSpritesheet = new Spritesheet(charactersheet);

        this.gameObjects.player = new PlayerEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth),
            new Rect(new Vector2d(0, 384), 128, 128), 
            HUMAN);
            
        let EYEBALL = new LivingEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth), 
            new Rect(new Vector2d(0, 256), 128, 128), 
            LESSERDEMON);
        
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
                            console.log(tile.equipable);
                            if (tile.equipable.canWield(this.gameObjects.player.race.power)) {
                                console.log('can wield');
                                // this.gameObjects.player
                            }
                        }
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
                                this.gameObjects.player.attack(tile);
                            } else {
                                this.gameObjects.player.setPosition(tile.rect.position, tile);
                            }
                        }
                    }
                });
            }
        });
    }

    run() {
        super.run();

        this.roomGrid.ExecuteGrid((row, column) => {
            let tile = this.roomGrid.Get(row, column);
            tile.draw(this.context, this.tileSpritesheet);
        });

        this.hud.draw(this.context, this.characterSpritesheet, this.gameObjects.player);
        this.gameObjects.player.draw(this.context, this.characterSpritesheet);
        for(let enemy of this.gameObjects.enemies) {
            enemy.draw(this.context, this.characterSpritesheet);
        }
    }
}

export default Fantasy;