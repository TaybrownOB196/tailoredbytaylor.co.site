import { Vector2d, Rect } from '../gaming/common'
import Grid from './Grid';

class Key {
    constructor(position, value, size, isVisible = true, fillHex='#000000', fontSize=16, font='arial', color='white') {
        this.position = position;
        this.size = size;
        this.fillHex = fillHex;
        this.fontSize = fontSize;
        this.font = `${fontSize} ${font}`;
        this.fontColor = color;
        this.rect = new Rect(position, this.size + 1, this.size + 1);
        this.value = value;
        this.isVisible = isVisible;
    }

    draw(context, position=null) {
        context.fillStyle = this.fillHex;
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);

        if (!this.isVisible) return;
        
        context.font = this.font;
        context.fillStyle = this.fontColor;
        let textMetrics = context.measureText(this.value);
        let textWidth = textMetrics.width;
        let textHeight = textMetrics.actualBoundingBoxDescent;

        if (!position) {
            position = this.rect.position;
        }
        context.fillText(
            this.value,
            position.x + ((this.rect.width/4) - (textWidth/4)), 
            position.y + ((this.rect.height/2) - (textHeight)));
    }

    updateValue(value) {
        this.value = value;
    }

    toggleVisibility(isVisible) {
        this.isVisible = isVisible;
    }
}

class Keypad extends Grid {
    constructor(position, columnCount, rowCount, width, height, values, fillHex='#000000', fontSize=16, font='arial', color='white') {
        super('', columnCount, rowCount);
        this.tileSize = Math.min(
            width/columnCount, 
            height/rowCount);

        let index = 0;
        this.ExecuteGridR((row, column) => {
            if (index >= values.length) 
                return true;
            
            let key = new Key(
                new Vector2d(
                    column * this.tileSize + position.x, 
                    row * this.tileSize + position.y), 
                values[index], 
                this.tileSize, 
                true, fillHex, fontSize, font, color);
            this.SetR(row, column, key);

            index++;
        });
    }

    getAt(click) {
        let toReturn = null;
        this.ExecuteGrid((row, column) => {
            let key = this.GetR(row, column);
            if (key && key.rect.contains(click)) {
                toReturn = key;
                return true;
            }
        });

        return toReturn;
    }

    draw(context) {
        this.ExecuteGrid((row, column) => {
            let key = this.GetR(row, column);
            if (key) key.draw(context);
        });
    }
}

class Alphabetpad extends Keypad {
    constructor(position, width, height, columnCount=7, rowCount=4, fillHex='#FFFFFF', fontSize=16, font='arial', color='black') {
        super(position, columnCount, rowCount, width, height, 
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 
            fillHex, fontSize, font, color
        );
    }
}

class Numpad extends Keypad {
    constructor(position, width, height, columnCount=3, rowCount=5, fillHex='#000000', fontSize=16, font='arial', color='white') {
        super(position, columnCount, rowCount, width, height, [1,2,3,4,5,6,7,8,9,0], 
            fillHex, fontSize, font, color);
    }
}

export {
    Alphabetpad,
    Numpad,
    Key
}