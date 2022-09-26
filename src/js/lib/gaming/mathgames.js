import { Key } from '../grid/keypad';
import { Vector2d, Rect } from '../gaming/common';

const FILL_HEX = '#000000';

const FONT_SIZE = 8;
const FONT_COLOR = 'white';

const TILE_SIZE = 24;

class Numkey extends Key {
    constructor(position, value, size, fillHex=FILL_HEX, fontSize=FONT_SIZE, color=FONT_COLOR) {
        super(position, value, size, true, fillHex, fontSize, 'arial', color);
        this.rect = new Rect(position, size, size);
    }
    setPosition(position) {
        this.rect.position = this.position = position;
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
            position.y + ((this.rect.height/2) - (textHeight/2)));
    }
}

// this.EquationGame = new SimpleEquationSolver(new Vector2d(0, 120), 10, 10, '*', 16);
class SimpleEquationSolver {
    //SOLVE
    //SOLVE_FOR_A
    //SOLVE_FOR_B
    constructor(position, value1, value2, operator, size, mode='') {
        this.equation = new SimpleEquation(position, value1, value2, operator, size);
        this.mode = mode;
        switch(mode) {
            case 'SOLVE_FOR_A':
                this.equation.equationKeys.value1.toggleVisibility(false);
            break;

            case 'SOLVE_FOR_B':
                this.equation.equationKeys.value2.toggleVisibility(false);
            break;

            case 'SOLVE_FOR_B':
                this.equation.equationKeys.value2.toggleVisibility(false);
            break;

            case 'SOLVE':
                this.equation.equationKeys.answer.toggleVisibility(false);
            break;
        }
    }

    draw(context) {
        this.equation.draw(context);
    }

    resetAnswer() {
        this.equation.equationKeys.answer.updateValue('');
    }

    getAt(click) {
        for (let equationKey in this.equation.equationKeys) {
            if (this.equation.equationKeys[equationKey].rect.contains(click)) {
                return this.equation.equationKeys[equationKey];
            }
        }
    }

    isComplete(value) {
        let result = false;
        switch(this.mode) {
            case 'SOLVE_FOR_A':
                result = this.equation.equationKeys.value1.value == value;
                this.equation.equationKeys.value1.toggleVisibility(result);
            break;

            case 'SOLVE_FOR_B':
                result = this.equation.equationKeys.value2.value == value;
                this.equation.equationKeys.value2.toggleVisibility(result);
            break;

            case 'SOLVE':
                console.log(this.equation.equationKeys.answer.value, value);
                result = this.equation.equationKeys.answer.value == value;
                this.equation.equationKeys.answer.toggleVisibility(result);
            break;
        }

        return result;
    }
}

class SimpleEquation {
    constructor(position, value1, value2, operator, size, ) {
        this.position = position;
        this.value1 = value1;
        this.value2 = value2;
        this.operator = operator;
        this.size = size;

        this.equationKeys = {
            value1: new Numkey(
                new Vector2d(0 * this.size + this.position.x, position.y), this.value1, this.size),
            operator: new Numkey(
                new Vector2d(1 * this.size + this.position.x, position.y), this.operator, this.size),
            value2: new Numkey(
                new Vector2d(2 * this.size + this.position.x, position.y), this.value2, this.size),
            equal: new Numkey(
                new Vector2d(3 * this.size + this.position.x, position.y), '=', this.size),
            answer: new Numkey(
                new Vector2d(4 * this.size + this.position.x, position.y), '', this.size)
        };
        this.calculateAnswer();
    }

    setOperator(operator) {
        switch(operator) {
            case '-': 
            case '/':
            case 'x':
            case '+': 
                this.operator = operator; 
            break;
        }

        this.equationKeys.operator.updateValue(this.operator);
    }

    calculateAnswer() {
        let answer = 0;
        switch(this.operator) {
            case '+': answer = this.value1 + this.value2; break;
            case '-': answer = this.value1 - this.value2; break;
            case '/': answer = this.value1 / this.value2; break;
            case 'x':
            case 'X':
            case '*':
                answer = this.value1 * this.value2; 
            break;
        }

        this.equationKeys.answer.updateValue(answer);
    }

    draw(context) {
        let idx = 0;
        for (let equationKey in this.equationKeys) {
            this.equationKeys[equationKey].draw(context);
            // this.equationKeys[equationKey].draw(context, new Vector2d(this.position.x + idx * this.size, this.position.y));
            idx++;
        }
    }
}

export {
    SimpleEquationSolver,
    Numkey
}