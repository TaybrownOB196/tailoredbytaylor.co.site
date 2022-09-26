import { Rect, Vector2d, Fillobject, Text, Gameobject } from '../../../lib/gaming/common';
import { Pointerhandler } from './../../../lib/gaming/input';
import EngineBase from '../../../lib/gaming/EngineBase';
import Utility from '../../../lib/Utility';
import { Alphabetpad, Key } from '../../../lib/grid/keypad';
import { WordGuess } from '../../../lib/gaming/wordgames';

const FILL_HEX = '#000000';

const FONT_SIZE = 8;
const FONT_COLOR = 'white';

const TILE_SIZE = 24;

class Letterkey extends Key {
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

class GTW extends EngineBase {
    constructor() {
        super('GTW', 'GTWContainer');
        this.canvas.style.backgroundColor = 'white';
        
        this.WordGuess = new WordGuess(new Vector2d(0,200), '', 24);
        this.isWordInPlay = false;

        this.words = ['PIZZA', 'CHICKEN', 'RICE', 'EGG', 'APPLE'];

        this.Alphabetpad = new Alphabetpad(new Vector2d(0, 0), 128, 128);

        this.held = null;

        //D&D Controls
        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            document.body.style.cursor = 'grabbing';
            let click = new Vector2d(
                (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));

            let key = this.Alphabetpad.getAt(click);
            if (key) {

                this.held = new Letterkey(
                    new Vector2d(click.x - TILE_SIZE/2, click.y - TILE_SIZE/2), 
                    key.value, 
                    TILE_SIZE);
            }
        });

        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            if (!this.held) return;

            let click = new Vector2d(
                (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));             
                
            this.held.setPosition(new Vector2d(click.x - TILE_SIZE/2, click.y - TILE_SIZE/2));
        });

        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
            if (!this.held) return;

            let click = new Vector2d(
                (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));             
            //console.log(this.canvas, this.canvas.offsetLeft);
            let wordSlot = this.WordGuess.getAt(click);
            if (wordSlot) {
                console.log(wordSlot);
                if (this.held.value == wordSlot.value) {
                    // console.log(`${this.held.value} match ${this.wordSlots[idx].value}`);
                    wordSlot.match();
                } else {
                    // console.log(`${this.held.value} don\'t match ${this.wordSlots[idx].value}`);
    
                }
            }

            this.held = null;
            document.body.style.cursor = 'grab';

            if (this.WordGuess.isComplete()) {
                console.log('You Win!');
            }
        });
        
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            document.body.style.cursor = 'grab';      
        });

        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.held = null;
            document.body.style.cursor = 'auto';
        });

        this.setupWord = this.setupWord.bind(this);
    }

    setupWord() {
        this.isWordInPlay = true;

        let word = this.words[Utility.GetRandomInt(this.words.length)];
        this.WordGuess = new WordGuess(new Vector2d(0, TILE_SIZE * 4), word, TILE_SIZE);
    }

    run() {
        super.run();

        // for (let idx=0; idx<this.tiles.length; idx++) {
        //     this.tiles[idx].draw(this.context);
        // }

        this.Alphabetpad.draw(this.context);

        if (!this.isWordInPlay) return;
        ////////////////////////////////////////////////////////////
        this.WordGuess.draw(this.context);
        
        if (this.held) {
            this.held.draw(this.context)
        }
    }
}

export default GTW;