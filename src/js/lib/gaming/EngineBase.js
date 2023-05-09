import { Point2d } from '../../lib/gaming/common';
import Rect from '../../lib/gaming/Rect';
import EngineRunnerBase from './EngineRunnerBase';

class EngineBase extends EngineRunnerBase {
    constructor(name, containerID, canvasWidth=300, canvasHeight=150) {
        super(name, containerID);
        this.DEFAULT_CANVAS_WIDTH = canvasWidth;
        this.DEFAULT_CANVAS_HEIGHT = canvasHeight;
        
        this.canvas = document.createElement('canvas');
        this.container.append(this.canvas);
        console.log(this.canvas.clientWidth, this.canvas.clientHeight);
        this.isHorizontal = this.canvas.clientWidth > this.canvas.clientHeight;
        this.gameRect = new Rect(new Point2d(0, 0), this.canvas.clientWidth, this.canvas.clientHeight);
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