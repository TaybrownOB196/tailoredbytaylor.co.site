import Utility from './../Utility';
import Pubsub from './Pubsub';

class Keyboardhandler {
    constructor() {
        this.pubsub = new Pubsub();
        this.keyStateMap = { };

        // var keyUp = (ev) => { console.log(ev.key, ev); };
        // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('keyup', keyUp);
        window.addEventListener('keydown', (ev) => {
            if (this.keyStateMap[ev.key]) {
                return;
            }

            this.keyStateMap[ev.key] = true;
            this.pubsub.publish('keydown', ev);
        });

        window.addEventListener('keyup', (ev) => {
            this.keyStateMap[ev.key] = false;
            this.pubsub.publish('keyup', ev);
        });
    }
}

class Mousehandler {
    constructor() {
        this.pubsub = new Pubsub();
        this.isDown = false;
        // var keyUp = (ev) => { console.log(ev.key, ev); };
        // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('keyup', keyUp);
        window.addEventListener('mouseup', (ev) => {
            this.isDown = false;
            this.pubsub.publish('mouseup', ev);
        });

        window.addEventListener('mousedown', (ev) => {
            this.isDown = true;
            this.pubsub.publish('mousedown', ev);
        });

        window.addEventListener('click', (ev) => {
            this.pubsub.publish('click', ev);
        });

        window.addEventListener('dblclick', (ev) => {
            this.pubsub.publish('dblclick', ev);
        });
    }
}

class Pointerhandler {
    constructor() {
        this.pubsub = new Pubsub();
        this.isDown = false;
        // var keyUp = (ev) => { console.log('move', ev); };
        // // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('pointermove', keyUp);
        window.addEventListener('pointerup', (ev) => {
            this.isDown = false;
            this.pubsub.publish('pointerup', ev);
        });

        window.addEventListener('pointerdown', (ev) => {
            this.isDown = true;
            this.pubsub.publish('pointerdown', ev);
        });

        window.addEventListener('pointermove', (ev) => {
            this.pubsub.publish('pointermove', ev);
        });
    }
}

export {
    Keyboardhandler,
    Pointerhandler,
    Mousehandler
}
