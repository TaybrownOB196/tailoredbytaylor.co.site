class EngineRunnerBase {
    constructor(name, fps=30) {
        this.name = name;
        this.tickDelta = 0;
        this.ticks = 0;
        this.frameMultiplier = 1;
        this.gameObjects = {};
        this.fps = fps;
        this.isRunning = false;
        this.run = this.run.bind(this);
    }

    getFps() {
        return this.fps;
    }

    run() {
        if (!this.isRunning) {
            this.ticks = performance.now();
            this.isRunning = true;
        }
        
        let newTicks = performance.now();
        this.tickDelta = newTicks - this.ticks;
        this.frameMultiplier = this.tickDelta / (1000 / this.fps);
        this.ticks = newTicks;
        
        window.requestAnimationFrame(this.run);
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.run);
    }
}

export default EngineRunnerBase;