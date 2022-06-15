import Grid from '../../../lib/grid/Grid';
import Utility from '../../../lib/Utility';
import { Rect, Vector2d } from '../../../lib/gaming/common';

class Equipable {
    constructor(name, power, clipRect) {
        this.name = name;
        this.clipRect = clipRect;
        this.power = power;
    }
    canWield(power) { return power >= this.power; }
    getValue() { return 0; }
    
}

class InventoryItem extends Equipable {
    constructor(name, power, clipRect) {
        super(name, power, clipRect);
        this.gridEquipable = null;
    }
    setPosition(gridEquipable) {
        if (this.gridEquipable)
            this.gridEquipable.unsetEquipable(this);
        gridEquipable.setEquipable(this);
    }
}

class Weapon extends InventoryItem {
    constructor(name, power, clipRect, damage) {
        super(name, power, clipRect);
        this.baseDamage = damage;
        this.damage = damage;
    }

    getValue() { return damage; }
}

class Armor extends InventoryItem {
    constructor(name, power, clipRect, value) {
        super(name, power, clipRect);
        this.baseDefense = value;
        this.defense = value;
    }

    getValue() { return defense; }
}

class GridEquipable {
    constructor(gridPosition, rect, clipRect) {
        this.position = gridPosition;
        this.rect = rect;
        this.clipRect = clipRect;
        this.equipable = null;
    }

    draw(context, spritesheet) {
        if (this.isOccupied()) {
            spritesheet.draw(context, this.rect, this.equipable.clipRect); 
        }

        context.strokeRect(
            this.rect.position.x, 
            this.rect.position.y, 
            this.rect.width, 
            this.rect.height);
    }

    isOccupied() { return this.equipable !== null; }
    setEquipable(equipable) {
        if (this.isOccupied())
            return;

        this.equipable = equipable;
        equipable.gridEquipable = this;
    }
    unsetEquipable(equipable) {
        this.equipable = null;
        equipable.gridEquipable = null;
    }
}

const LICHSWORD = new Weapon('lichsword', 5, 
    new Rect(
        new Vector2d(256, 384), 
        128, 
        128), 
    5);
const GREATSWORD = new Weapon('greatsword', 3, 
    new Rect(
        new Vector2d(384, 384), 
        128, 
        128), 
    4);
const RUSTEDARMOR = new Armor('rustedarmor', 1, 
    new Rect(
        new Vector2d(128, 384), 
        128, 
        128), 
    1);

class Hud {
    constructor(rect) {
        this.rect = rect;
        this.columnCount = 3;
        this.rowCount = 3;
        let topHeight = this.rect.height * 1 * (1/3), 
        bottomHeight = this.rect.height * 1 * (2/3);
        let tileWidth = Math.min(
            this.rect.width * .9 / this.columnCount, 
            bottomHeight * .9 / this.rowCount);
        this.inventory = new Grid(null, this.columnCount, this.rowCount);
        this.inventory.ExecuteGrid((row, column) => {
            let fullWidth = tileWidth * this.columnCount;
            let fullHeight = tileWidth * this.rowCount;
            let xOffset = (this.rect.width - fullWidth) / 2, 
                yOffset = topHeight + ((bottomHeight - fullHeight) / 2);

            let rectPosition = new Vector2d(
                column * (tileWidth) + this.rect.position.x + xOffset, 
                row * (tileWidth) + this.rect.position.y + yOffset);
            let rect = new Rect(
                rectPosition,
                tileWidth,
                tileWidth);

            let gridEquipable = new GridEquipable(rect, new Rect(rectPosition, tileWidth, tileWidth));
            if (row == 0 && column == 0) {
                LICHSWORD.setPosition(gridEquipable);
            }
            if (row == 0 && column == 1) {
                RUSTEDARMOR.setPosition(gridEquipable);
            }
            if (row == 0 && column == 2) {
                GREATSWORD.setPosition(gridEquipable);
            }
            this.inventory.Set(row, column, gridEquipable);
        });
    }

    draw(context, spritesheet, player) {
        let topHeight = this.rect.height * 1 * (1/3), 
            bottomHeight = this.rect.height * 1 * (2/3);
        //border
        context.strokeStyle = '#FFFFFF';
        context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        
        //top section
        let fontSize = Math.round(topHeight / 4);
        context.font = `${fontSize}px times new`;
        
        let fullWidth = this.rect.width * .95;
        let textWidth = player.race.name.length * fontSize + 1;
        let _width = (fullWidth - (textWidth * .9) * 1);
        let _height = topHeight * .9;
        let characterBoxWidth = Math.min(_width, _height);
        let equipBoxWidth = characterBoxWidth/2;
        let trueWidth = textWidth + characterBoxWidth + equipBoxWidth;
        let xOffset = (fullWidth - trueWidth) / 2, 
            yOffset = 0;
        
        //race
        context.strokeText(`${player.race.name}`, this.rect.position.x + xOffset, this.rect.position.y + fontSize + yOffset);
        //lifespan
        context.strokeText(`${player.race.lifeSpan}`, this.rect.position.x + xOffset, this.rect.position.y + fontSize*2 + yOffset);
        //power
        context.strokeText(`${player.race.power}`, this.rect.position.x + xOffset, this.rect.position.y + fontSize*3 + yOffset);
        //intelligence
        context.strokeText(`${player.race.intelligence}`, this.rect.position.x + xOffset, this.rect.position.y + fontSize*4 + yOffset);

        //character box
        context.strokeRect(this.rect.position.x + xOffset + textWidth, this.rect.position.y + yOffset, characterBoxWidth, characterBoxWidth);
        spritesheet.draw(context, 
            new Rect(
                new Vector2d(this.rect.position.x + xOffset + textWidth + 1, this.rect.position.y + yOffset + 1),
                characterBoxWidth - 1, 
                characterBoxWidth - 1), 
            new Rect(
                new Vector2d(0, 384), 
                128, 
                128/2));

        //weapon box
        context.strokeRect(
            this.rect.position.x + xOffset + textWidth + characterBoxWidth, 
            this.rect.position.y + yOffset, 
            equipBoxWidth, 
            equipBoxWidth);
        if (player.hasWeaponEquipped()) {
            spritesheet.draw(context, 
                new Rect(
                    new Vector2d(
                        this.rect.position.x + xOffset + textWidth + characterBoxWidth + 1, 
                        this.rect.position.y + yOffset + 1),
                    equipBoxWidth - 1, 
                    equipBoxWidth - 1), 
                new Rect(
                    new Vector2d(256, 384), 
                    128, 
                    128));
        }

        //armor box
        context.strokeRect(
            this.rect.position.x + xOffset + textWidth + characterBoxWidth, 
            this.rect.position.y  + yOffset + equipBoxWidth, 
            equipBoxWidth, 
            equipBoxWidth);
        if (player.hasArmorEquipped()) {
            spritesheet.draw(context, 
                new Rect(
                    new Vector2d(this.rect.position.x + xOffset + textWidth + characterBoxWidth + 1, 
                        this.rect.position.y  + yOffset + equipBoxWidth + 1),
                        equipBoxWidth - 1, 
                        equipBoxWidth - 1), 
                new Rect(
                    new Vector2d(128, 384), 
                    128, 
                    128));
        }

        //inventory
        this.inventory.ExecuteGrid((row, column) => {
            let tile = this.inventory.Get(row, column);
            tile.draw(context, spritesheet);
        });
    }
}

export default Hud;