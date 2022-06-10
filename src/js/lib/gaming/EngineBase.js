import { Rect, Vector2d } from '../../lib/gaming/common'; 

class EngineBase {
    constructor(name, containerID) {
        this.container = document.getElementById(containerID);
        if (!this.container) {
            console.log(`unable to load "${name}" game`);
            throw `unable to load "${name}" game`;
        }
        this.name = name;
        this.DEFAULT_CANVAS_WIDTH = 300;
        this.DEFAULT_CANVAS_HEIGHT = 150;
        
        this.canvas = document.createElement('canvas');
        this.container.append(this.canvas);
        console.log(this.canvas.clientWidth, this.canvas.clientHeight);

        this.gameRect = new Rect(new Vector2d(0, 0), this.canvas.clientWidth, this.canvas.clientHeight);
        console.log(this.gameRect.width, this.gameRect.height);
        this.context = this.canvas.getContext('2d');

        this.ticks = new Date().getTime();
        this.tickDelta = 0;

        this.gameObjects = {};

        this.run = this.run.bind(this);
    }

    run() {
        let newTick = new Date().getTime();
        this.tickDelta = newTick - this.ticks;
        this.ticks = newTick;

        window.requestAnimationFrame(this.run);

        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}

export default EngineBase;