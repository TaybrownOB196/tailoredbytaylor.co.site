import { Rect, Vector2d } from '../../lib/gaming/common'; 
import EngineRunnerBase from './EngineRunnerBase';

class EngineBase extends EngineRunnerBase {
    constructor(name, containerID) {
        super(name, containerID);
        this.DEFAULT_CANVAS_WIDTH = 300;
        this.DEFAULT_CANVAS_HEIGHT = 150;
        
        this.canvas = document.createElement('canvas');
        this.container.append(this.canvas);
        console.log(this.canvas.clientWidth, this.canvas.clientHeight);
        this.isHorizontal = this.canvas.clientWidth > this.canvas.clientHeight;
        this.gameRect = new Rect(new Vector2d(0, 0), this.canvas.clientWidth, this.canvas.clientHeight);
        console.log(this.gameRect.width, this.gameRect.height);
        this.context = this.canvas.getContext('2d');
    }

    run() {
        super.run();
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}

export default EngineBase;