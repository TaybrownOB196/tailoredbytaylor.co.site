import { Rect, Vector2d, Gameobject, LayeredCanvas, Spritesheet, Rgb } from '../../../lib/gaming/common';
import { Pointerhandler } from './../../../lib/gaming/input';
import EngineRunnerBase from '../../../lib/gaming/EngineRunnerBase';

class Hotplate extends Gameobject {
    constructor(rect, sheet) {
        super(rect.position);
        this.rect = rect;
        this.sheet = sheet;
        this.clipRect = new Rect(new Vector2d(0, 0), 128, 128);
    }

    setPosition(position) {
        this.position = position;
        this.rect.position = position;
    }

    draw(context) {
        this.sheet.draw(context, this.rect, this.clipRect);
    }
}

class Beaker extends Gameobject {
    constructor(rect, sheet, color) {
        super(rect.position);
        this.prevPosition = new Vector2d(0,0);
        this.color = color;
        this.rect = rect;
        this.sheet = sheet;
        this.clipRect = new Rect(new Vector2d(0, 512), 128, 128);
    }

    resetPosition() {
        this.setPosition(this.prevPosition);
    }

    setPosition(position, rectPosition=null) {
        this.prevPosition = this.position;
        this.position = position;
        this.rect.position = rectPosition || position;
    }

    draw(context) {
        this.drawFill(context);
        this.drawOutline(context);
    }

    drawOutline(context) {
        context.globalCompositeOperation = "source-over";
        this.sheet.draw(context, this.rect, this.clipRect);
    }

    drawFill(context) {
        context.fillStyle = this.color.toRgbString();
        context.fillRect(this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
        context.globalCompositeOperation = "destination-in";
        this.sheet.draw(context, this.rect, new Rect(new Vector2d(0,256), 128, 128));
    }
        
    mix(beaker) {
        console.log(`mixing rgb(${this.color.r},${this.color.g},${this.color.b}) w/ rgb(${beaker.color.r},${beaker.color.g},${beaker.color.b})`);
        beaker.color = beaker.color.mix(this.color);
        console.log(`made rgb(${beaker.color.r},${beaker.color.g},${beaker.color.b})`);
    }
}

class MLC extends EngineRunnerBase {
    constructor() {
        super('MLC', 'MLCContainer');
        this.canvas = new LayeredCanvas('MLCContainer', 3);
        let widthHeight = this.canvas.getWidthHeight();
        this.isHorizontal = widthHeight.width > widthHeight.height;
        this.gameRect = new Rect(new Vector2d(0, 0), widthHeight.width, widthHeight.height);
        this.heldBeaker = null;

        this.load = this.load.bind(this);
    }

    load() {
        let spritesheetPng = document.getElementById('MLC_SS_1');
        let spritesheet = new Spritesheet(null, spritesheetPng);

        this.beaker1 = new Beaker(new Rect(new Vector2d(0,0), 128,128), spritesheet, new Rgb(255,12,0));
        this.beaker2 = new Beaker(new Rect(new Vector2d(32,0), 128,128), spritesheet, new Rgb(23,0,255));

        this.hotplate = new Hotplate(new Rect(new Vector2d(32,32), 128,128), spritesheet);
        
        this.pointerhandler = new Pointerhandler(this.canvas.canvases[2].canvas);
        this.pointerhandler.pubsub.subscribe('pointerdown', (ev) => {
            let widthHeight = this.canvas.getWidthHeight();
            let offsetTopLeft = this.canvas.getOffsetTopLeft();
            let click = new Vector2d(
                (ev.x - offsetTopLeft.left)/(this.gameRect.width/widthHeight.width), 
                (ev.y - offsetTopLeft.top)/(this.gameRect.height/widthHeight.height));
                
            if (this.beaker1.rect.contains(click)) {
                console.log('beaker1 click');
                this.heldBeaker = this.beaker1;
                document.body.style.cursor = 'grabbing';
            } else if (this.beaker2.rect.contains(click)) {
                console.log('beaker2 click');
                this.heldBeaker = this.beaker2;
                document.body.style.cursor = 'grabbing';                
            }
        });

        this.pointerhandler.pubsub.subscribe('pointermove', (ev) => {
            let offsetTopLeft = this.canvas.getOffsetTopLeft();
            let widthHeight = this.canvas.getWidthHeight();
            let click = new Vector2d(
                (ev.x - offsetTopLeft.left)/(this.gameRect.width/widthHeight.width), 
                (ev.y - offsetTopLeft.top)/(this.gameRect.height/widthHeight.height));
            
            if (this.heldBeaker) {
                this.heldBeaker.setPosition(click, new Vector2d(click.x - 64, click.y - 64));
            }
        });

        this.pointerhandler.pubsub.subscribe('pointerup', (ev) => {
            let offsetTopLeft = this.canvas.getOffsetTopLeft();
            let widthHeight = this.canvas.getWidthHeight();
            let click = new Vector2d(
                (ev.x - offsetTopLeft.left)/(this.gameRect.width/widthHeight.width), 
                (ev.y - offsetTopLeft.top)/(this.gameRect.height/widthHeight.height));
            

            if (this.heldBeaker === this.beaker1) {
                if (this.beaker2.rect.contains(click)) {
                    this.beaker2.mix(this.beaker1);
                }
            }
            
            if (this.heldBeaker === this.beaker2) {
                if (this.beaker1.rect.contains(click)) {
                    this.beaker1.mix(this.beaker2);
                }
            }

            this.heldBeaker = null;
            document.body.style.cursor = 'grab';
        });
        
        this.pointerhandler.pubsub.subscribe('pointerenter', (ev) => document.body.style.cursor = 'grab');

        this.pointerhandler.pubsub.subscribe('pointerleave', (ev) => {
            if (this.heldBeaker) {
                this.heldBeaker.resetPosition();
            }

            document.body.style.cursor = 'auto';
        });
    }

    run() {
        super.run();
        let ctx0 = this.canvas.getContext(0);
        let ctx1 = this.canvas.getContext(1);
        let ctx2 = this.canvas.getContext(2);

        this.hotplate.draw(ctx0);

        this.beaker2.draw(ctx2);
        
        this.beaker1.draw(ctx1);
    }
}

export default MLC;