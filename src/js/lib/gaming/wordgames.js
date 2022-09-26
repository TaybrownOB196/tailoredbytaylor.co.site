import { Key } from '../grid/keypad';
import { Vector2d } from '../gaming/common';

const FONT_TYPE = 'arial';
const FONT_SIZE = 16;
const FONT_COLOR = 'black';

const TILE_HEX = '#ff00ff';

class Wordslot extends Key {
    constructor(position, value, size, isVisible=false, fillHex=TILE_HEX, fontSize=FONT_SIZE, font=FONT_TYPE, color=FONT_COLOR) {
        super(position, value, size, isVisible, fillHex, fontSize, font, color);
    }
    
    draw(context) {
        if (this.isVisible) {
            super.draw(context);
        } else {
            context.strokeStyle = this.fontColor;
            context.strokeRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        }
    }

    match() {
        this.isVisible = true;
    }
}

class WordGuess {
    constructor(position, word, tileSize) {
        this.position = position;
        this.wordSlots = [];
        
        for (let idx=0; idx<word.length; idx++) {
            this.wordSlots.push(
                new Wordslot(
                    new Vector2d(idx*tileSize, position.y), 
                    word[idx], 
                    tileSize)
            );
        }
    }
    
    getAt(position) {
        for (let idx=0; idx<this.wordSlots.length; idx++) {
            if (this.wordSlots[idx].rect.contains(position)) {
                return this.wordSlots[idx];
            }
        }
    }

    draw(context) {
        for (let idx=0; idx<this.wordSlots.length; idx++) {
            this.wordSlots[idx].draw(context);
        }
    }

    isComplete() {
        return this.wordSlots.filter((wordSlot) => wordSlot.isVisible).length == this.wordSlots.length;
    }
}

export {
    WordGuess
}