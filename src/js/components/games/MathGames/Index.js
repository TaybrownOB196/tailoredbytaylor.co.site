import { Rect, Vector2d, Fillobject, Text, Gameobject } from '../../../lib/gaming/common';
import { Pointerhandler } from './../../../lib/gaming/input';
import EngineBase from '../../../lib/gaming/EngineBase';
import Utility from '../../../lib/Utility';
import { Numpad } from '../../../lib/grid/keypad';
import { SimpleEquationSolver, Numkey } from '../../../lib/gaming/mathgames';

const TILE_SIZE = 24;

class MathGames extends EngineBase {
    constructor() {
        super('MathGames', 'MathGamesContainer');
        this.canvas.style.backgroundColor = 'white';
        
        this.Equation = new SimpleEquationSolver(new Vector2d(0,200), 0, 0, '+', 24, 'SOLVE')
        this.isInPlay = false;

        this.Numpad = new Numpad(new Vector2d(0, 0), 128, 128);

        this.held = null;

        //D&D Controls
        this.pointerhandler = new Pointerhandler(this.canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            document.body.style.cursor = 'grabbing';
            let click = new Vector2d(
                (ev.x - this.canvas.offsetLeft)/(this.gameRect.width/this.DEFAULT_CANVAS_WIDTH), 
                (ev.y - this.canvas.offsetTop)/(this.gameRect.height/this.DEFAULT_CANVAS_HEIGHT));

            let num = this.Numpad.getAt(click);
            if (num) {

                this.held = new Numkey(
                    new Vector2d(click.x - TILE_SIZE/2, click.y - TILE_SIZE/2), 
                    num.value, 
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

            let key = this.Equation.getAt(click);
            if (key) {
                if (this.Equation.isComplete(this.held.value)) {
                } else {
                    alert('wrong answer');
                }
            }

            this.held = null;
            document.body.style.cursor = 'grab';
        });
        
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => {
            document.body.style.cursor = 'grab';      
        });

        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            this.held = null;
            document.body.style.cursor = 'auto';
        });

        this.setup = this.setup.bind(this);
    }

    setup() {
        let value1 = Utility.GetRandomInt(10);
        this.isInPlay = true;
        this.Equation = new SimpleEquationSolver(
            new Vector2d(0, TILE_SIZE * 4), 
            value1,
            Math.abs(value1 - Utility.GetRandomInt(10)),
            '+',
            TILE_SIZE,
            'SOLVE');
    }

    run() {
        super.run();

        this.Numpad.draw(this.context);

        if (!this.isInPlay) return;
        ////////////////////////////////////////////////////////////
        this.Equation.draw(this.context);
        
        if (this.held) {
            this.held.draw(this.context)
        }
    }
}

export default MathGames;