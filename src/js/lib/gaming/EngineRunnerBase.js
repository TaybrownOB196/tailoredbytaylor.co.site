class EngineRunnerBase {
    constructor(name, containerID) {
        this.container = document.getElementById(containerID);
        if (!this.container) {
            console.log(`unable to load "${name}" game using "${containerID}"`);
            throw `unable to load "${name}" game using "${containerID}`;
        }

        this.name = name;
        this.ticks = new Date().getTime();
        this.tickDelta = 0;

        this.gameObjects = {};

        this.run = this.run.bind(this);
    }

    getFps() {
        return Math.round(1/(this.tickDelta/1000));
    }

    run() {
        let newTick = new Date().getTime();
        this.tickDelta = newTick - this.ticks;
        this.ticks = newTick;

        window.requestAnimationFrame(this.run);
    }

    stop() {
        cancelAnimationFrame(this.run);
    }
}

export default EngineRunnerBase;