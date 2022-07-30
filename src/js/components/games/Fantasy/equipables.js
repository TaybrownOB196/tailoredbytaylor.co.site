import { GridObject } from './entities';

class Equipable extends GridObject {
    constructor(name, power, rect, clipRect, spritesheet, value) {
        super(rect, clipRect, spritesheet);
        this.name = name;
        this.power = power;
        this.baseValue = value;
        this.value = value;
    }
    canWield(power) { return power >= this.power; }
    getValue() { return this.value; }
    unsetPosition(gridTile) {
        this.gridTile.unsetOccupant(this);
    }
}

class Weapon extends Equipable {
    constructor(name, power, rect, clipRect, spritesheet, damage) {
        super(name, power, rect, clipRect, spritesheet, damage);
    }
}

class Armor extends Equipable {
    constructor(name, power, rect, clipRect, spritesheet, defense) {
        super(name, power, rect, clipRect, spritesheet, defense);
    }
}

export {
    Equipable,
    Weapon,
    Armor
}