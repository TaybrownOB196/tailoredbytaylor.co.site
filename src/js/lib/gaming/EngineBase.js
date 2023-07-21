import { Point2d } from '../../lib/gaming/common';
import Rect from '../../lib/gaming/Rect';
import EngineRunnerBase from './EngineRunnerBase';
const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 150;
const GAME_CONTAINER_CLASS = 'tbt-game-container_v1';

class EngineBase extends EngineRunnerBase {
    constructor(name, containerID, canvasWidth=DEFAULT_CANVAS_WIDTH, canvasHeight=DEFAULT_CANVAS_HEIGHT, isFullscreen=false) {
        super(name);
        this.DEFAULT_CANVAS_WIDTH = DEFAULT_CANVAS_WIDTH;
        this.DEFAULT_CANVAS_HEIGHT = DEFAULT_CANVAS_HEIGHT;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = canvasWidth;
        this.canvas.style.height =  canvasHeight;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.isHorizontal = this.canvas.clientWidth > this.canvas.clientHeight;
        this.gameRect = new Rect(new Point2d(0, 0), this.canvas.style.width, this.canvas.style.height);
        this.context = this.canvas.getContext('2d');

        this.defaultContainer = document.getElementById(containerID);
        if (!this.defaultContainer) {
            console.log(`unable to load "${name}" game using "${containerID}"`);
            throw `unable to load "${name}" game using "${containerID}`;
        }

        this.isFullscreen = isFullscreen;
        this.fullscreenContainer = document.createElement('div');
        document.body.append(this.fullscreenContainer);
        
        if (this.isFullscreen) {
            this.fullscreenContainer.append(this.canvas);
            this.fullscreenContainer.classList.add(GAME_CONTAINER_CLASS);
        } else {
            this.defaultContainer.append(this.canvas);
        }
    }

    addKeyboardControls(keyboardListener) {
        if (keyboardListener) {
            keyboardListener.subscribe('keydown', (ev) => {
                this.toggleFullscreen();
            });
        }
    }
    
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.defaultContainer.append(this.canvas);
            this.fullscreenContainer.classList.remove(GAME_CONTAINER_CLASS);
        } else {
            this.fullscreenContainer.append(this.canvas);
            this.fullscreenContainer.classList.add(GAME_CONTAINER_CLASS);
        }
        this.isFullscreen = !this.isFullscreen;
    }

    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.onResize(width, height);
    }

    onResize(width, height) {}

    getMousePosition(x, y) {
        if (this.isFullscreen) {
            let fullscreenOffsetX = (this.fullscreenContainer.clientWidth-this.canvas.width)/2;
            let fullscreenOffsetY = (this.fullscreenContainer.clientHeight-this.canvas.height)/2;
            return new Point2d(
                x - fullscreenOffsetX,
                y - fullscreenOffsetY);
        } else {
            return new Point2d(
                x - this.defaultContainer.offsetLeft,
                y - this.defaultContainer.offsetTop);
        }
        
    }

    run() {
        super.run();
        this.context.clearRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

export default EngineBase;