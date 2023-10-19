import { Point2d } from '../../lib/gaming/common';
import Rect from '../../lib/gaming/Rect';
import EngineRunnerBase from './EngineRunnerBase';
const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 150;

class EngineBase extends EngineRunnerBase {
    constructor(name, containerID, canvasWidth=DEFAULT_CANVAS_WIDTH, canvasHeight=DEFAULT_CANVAS_HEIGHT) {
        super(name);
        this.ISDEBUG = false;
        this.DEFAULT_CANVAS_WIDTH = DEFAULT_CANVAS_WIDTH;
        this.DEFAULT_CANVAS_HEIGHT = DEFAULT_CANVAS_HEIGHT;
        this.canvas = document.createElement('canvas');
        this.sizeCanvas(canvasWidth, canvasHeight);
        this.isHorizontal = this.canvas.clientWidth > this.canvas.clientHeight;
        this.context = this.canvas.getContext('2d');

        this.prevWidth = canvasWidth;
        this.prevHeight = canvasHeight;

        this.defaultContainer = document.getElementById(containerID);
        if (!this.defaultContainer) {
            console.log(`unable to load "${name}" game using "${containerID}"`);
            throw `unable to load "${name}" game using "${containerID}`;
        }

        this.defaultContainer.append(this.canvas);
        this.isFullscreen = false;
    }

    addKeyboardControls(keyboardListener) {
        if (keyboardListener) {
            keyboardListener.subscribe('keydown', (ev) => {
                this.toggleFullscreen();
            });
        }
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            this.isFullscreen = false;
            return document.exitFullscreen();
        } else {
            return this.defaultContainer
                .requestFullscreen()
                .then(_ => this.isFullscreen = true)
        }
    }

    sizeCanvas(width, height) {
        this.prevWidth = this.canvas.width;
        this.prevHeight = this.canvas.height;
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width =  width;
        this.canvas.style.height =  height;

        this.gameRect = new Rect(new Point2d(0, 0), width, height);
    }

    getMousePosition(x, y) {
        if (this.isFullscreen) {
            return new Point2d(x, y);
        } else {
            return new Point2d(
                x - this.defaultContainer.offsetLeft,
                y - this.defaultContainer.offsetTop);
        }        
    }

    getMousePositionV2(event) {
        if (this.isFullscreen) {
            return new Point2d(
                Math.round(event.offsetX),
                Math.round(event.offsetY));
        } else {
            return new Point2d(
                Math.round(event.layerX - this.defaultContainer.offsetLeft),
                Math.round(event.layerY - this.defaultContainer.offsetTop));
        }        
    }

    run() {
        super.run();
        this.context.clearRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

export default EngineBase;