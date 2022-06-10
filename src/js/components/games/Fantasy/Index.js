import { Rect, Vector2d, Physics2d, Sprite, Spritesheet, IDGenerator, Gameobject } from '../../../lib/gaming/common';
import { Keyboardhandler, Pointerhandler } from './../../../lib/gaming/input';
import enemysheet from './../../../../png/enemy_ss_1.png';
import tilesheet from './../../../../png/tiles_ss_0.png';
import '../../../../sass/fantasy.scss';
import Utility from '../../../lib/Utility';
import Grid from '../../../lib/grid/Grid';
import GridCell from './../../../lib/grid/Gridcell';
import Pathfinder from '../../../lib/grid/Pathfinder';
import EngineBase from '../../../lib/gaming/EngineBase';

class Race {
    constructor(name, lifeSpan, power, intelligence) {
        this.name = name;
        this.lifeSpan = lifeSpan;
        this.power = power;
        this.intelligence = intelligence;
    }
}

class Weapon {
    constructor(name, damage) {
        this.name = name;
        this.baseDamage = damage;
        this.damage = damage;
    }

    canWield() {
        return true;
    }
}

class Armor {
    constructor(name, value) {
        this.name = name;
        this.defense = value;
    }

    canWield() {
        return true;
    }
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';
const YELLOW = '#FFFF00';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#0000FF';

const tileWidth = 16;
const tileGap = 2;
const SPEED = 10;
const HEALTH_MOD = 25;
const POWER_MOD = 2;

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

    draw(context, spritesheet) {
        spritesheet.draw(context, this.rect, this.clipRect);
    }
}

class GridObject extends Gameobject {
    constructor(rect, clipRect) {
        super(rect.position);
        this.rect = rect;
        this.clipRect = clipRect;
        this.gridTile = null;
    }

    setPosition(position, gridTile) {
        super.setPosition(position);
        this.rect.position = position;

        if (this.gridTile)
            this.gridTile.unsetEntity(this);
        gridTile.setEntity(this);
    }

    draw(context, spritesheet) {
        spritesheet.draw(context, this.rect, this.clipRect);
    }
}


class GridEntity extends GridObject {
    constructor(rect, clipRect, health) {
        super(rect, clipRect);
        this.baseHealth = health;
        this.health = health;
        this.isAlive = true;
    }

    updateHealth(deltaValue) {
        let tempValue = this.health + deltaValue;
        if (tempValue <= 0) {
            this.isAlive = false;
            this.health = 0;
        } else {
            this.health = tempValue;
        }
    }

    defend(damage) {
        this.updateHealth(damage);
    }
}

class LivingEntity extends GridEntity {
    constructor(rect, clipRect, race) {
        super(rect, clipRect, HEALTH_MOD * race.lifeSpan);
        this.race = race;
    }

    draw(context, spritesheet) {
        if (!this.isAlive)
            return;
        super.draw(context, spritesheet);

        context.fillStyle = '#D03733';
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, 2);
        
        context.fillStyle = '#33B23B';
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width * this.health/this.baseHealth, 2);
    }

    attack(gridTile) {
        gridTile.entity.defend(POWER_MOD * this.race.power);
    }
}

class PlayerEntity extends LivingEntity {
    constructor(rect, clipRect, race) {
        super(rect, clipRect, race);
        this.weapon = null;
    }

    equipWeapon(weapon) {
        this.weapon = weapon;
    }

    equipArmor(armor) {
        this.armor = armor;
    }

    defend(damage) {
        if (this.armor !== null) {
            damage += Utility.getRandomIntInclusive(0, this.armor.defense);
            if (damage <= 0) {
                this.updateHealth(damage);
            }
        } else {
            this.updateHealth(damage);
        }
    }

    canAttack(gridTile) {
        return true;
    }

    getDamage() {
        if (this.weapon !== null)
            return (POWER_MOD * this.race.power) + Utility.getRandomIntInclusive(0, this.weapon.damage);
        else
            return POWER_MOD * this.race.power;
    }

    attack(gridTile) {
        gridTile.entity.defend(-this.getDamage())
    }
}

class Fantasy extends EngineBase {
    constructor() {
        super('Fantasy', 'FantasyContainer');

        this.tileSpritesheet = new Spritesheet(tilesheet);
        this.enemySpritesheet = new Spritesheet(enemysheet);

        this.gameObjects.player = new PlayerEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth),
            new Rect(new Vector2d(0,0), 128, 128), 
            HUMAN);
            
        let EYEBALL = new LivingEntity(
            new Rect(new Vector2d(0,0), tileWidth, tileWidth), 
            new Rect(new Vector2d(256, 256), 128, 128), 
            LESSERDEMON);
        
        this.gameObjects.enemies = [];
        this.gameObjects.enemies.push(EYEBALL);

        this.backgroundGrid = new Grid(0, 7, 7);

        this.roomGrid = new Grid(0, 7, 7);
        this.roomGrid.ExecuteGrid((row, column) => {
            let rectPosition = new Vector2d(column * (tileWidth + tileGap), row * (tileWidth + tileGap));
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
            // console.log(ev);
            // console.log(ev.x, ev.y);
            // console.log(this.canvas.offsetTop, this.canvas.offsetLeft);
            this.roomGrid.ExecuteGrid((row, column) => {
                let tile = this.roomGrid.Get(row, column);
                if (tile.rect.contains(
                    new Vector2d(
                        (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                        (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT)))) {

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
        });
    }

    run() {
        super.run();

        this.roomGrid.ExecuteGrid((row, column) => {
            let tile = this.roomGrid.Get(row, column);
            tile.draw(this.context, this.tileSpritesheet);
        });

        this.gameObjects.player.draw(this.context, this.enemySpritesheet);
        for(let enemy of this.gameObjects.enemies) {
            enemy.draw(this.context, this.enemySpritesheet);
        }
    }
}

export default Fantasy;