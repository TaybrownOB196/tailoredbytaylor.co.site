import { Rect, Vector2d, Physics2d, Sprite, Spritesheet, IDGenerator, Gameobject } from '../../../lib/gaming/common';

const HEALTH_MOD = 25;
const POWER_MOD = 2;

class GridObject extends Gameobject {
    constructor(rect, clipRect) {
        super(rect.position);
        this.rect = rect;
        this.clipRect = clipRect;
        this.gridTile = null;
    }

    draw(context, spritesheet) { spritesheet.draw(context, this.rect, this.clipRect); }
    setPosition(position, gridTile) {
        super.setPosition(position);
        this.rect.position = position;

        if (this.gridTile)
            this.gridTile.unsetEntity(this);
        gridTile.setEntity(this);
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
        this.armor = null;
    }

    hasArmorEquipped() { return this.armor === true; }
    hasWeaponEquipped() { return this.weapon === true; }

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

export {
    PlayerEntity,
    LivingEntity
}