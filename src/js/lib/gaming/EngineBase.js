import { Point2d } from '../../lib/gaming/common';
import Rect from '../../lib/gaming/Rect';
import EngineRunnerBase from './EngineRunnerBase';
const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 150;

class EngineBase extends EngineRunnerBase {
    constructor(name, containerID, canvasWidth=DEFAULT_CANVAS_WIDTH, canvasHeight=DEFAULT_CANVAS_HEIGHT) {
        super(name, containerID);
        this.DEFAULT_CANVAS_WIDTH = DEFAULT_CANVAS_WIDTH;
        this.DEFAULT_CANVAS_HEIGHT = DEFAULT_CANVAS_HEIGHT;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = canvasWidth;
        this.canvas.style.height =  canvasHeight;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.container.append(this.canvas);
        this.isHorizontal = this.canvas.clientWidth > this.canvas.clientHeight;
        this.gameRect = new Rect(new Point2d(0, 0), this.canvas.style.width, this.canvas.style.height);
        this.context = this.canvas.getContext('2d');
    }

    getMousePosition(x, y) {
        //May have to take styling into account
        return new Point2d(
            Math.round(x - this.container.offsetLeft),
            Math.round(y - this.container.offsetTop));
    }

    run() {
        super.run();
        this.context.clearRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

export default EngineBase;