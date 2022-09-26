import Utility from './../Utility';
import Pubsub from './Pubsub';

class Keyboardhandler {
    constructor(target) {
        this.pubsub = new Pubsub();
        this.keyStateMap = { };

        // var keyUp = (ev) => { console.log(ev.key, ev); };
        // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('keyup', keyUp);
        target.addEventListener('keydown', (ev) => {
            if (this.keyStateMap[ev.key]) {
                return;
            }

            this.keyStateMap[ev.key] = true;
            this.pubsub.publish('keydown', ev);
        });

        target.addEventListener('keyup', (ev) => {
            this.keyStateMap[ev.key] = false;
            this.pubsub.publish('keyup', ev);
        });
    }
}

class Mousehandler {
    constructor(target) {
        this.pubsub = new Pubsub();
        this.isDown = false;
        // var keyUp = (ev) => { console.log(ev.key, ev); };
        // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('keyup', keyUp);
        target.addEventListener('mouseup', (ev) => {
            this.isDown = false;
            this.pubsub.publish('mouseup', ev);
        });

        target.addEventListener('mousedown', (ev) => {
            this.isDown = true;
            this.pubsub.publish('mousedown', ev);
        });

        target.addEventListener('click', (ev) => {
            this.pubsub.publish('click', ev);
        });

        target.addEventListener('dblclick', (ev) => {
            this.pubsub.publish('dblclick', ev);
        });
    }
}

class Pointerhandler {
    constructor(target) {
        this.pubsub = new Pubsub();
        this.isDown = false;
        // var keyUp = (ev) => { console.log('move', ev); };
        // // this.pubsub.subscribe('keydown', keyUp);
        // this.pubsub.subscribe('pointermove', keyUp);
        target.addEventListener('pointerup', (ev) => {
            this.isDown = false;
            this.pubsub.publish('pointerup', ev);
        });

        target.addEventListener('pointerdown', (ev) => {
            this.isDown = true;
            this.pubsub.publish('pointerdown', ev);
        });

        target.addEventListener('pointermove', (ev) => {
            this.pubsub.publish('pointermove', ev);
        });
        
        target.addEventListener('pointerenter', (ev) => {
            this.pubsub.publish('pointerenter', ev);
        });

        target.addEventListener('pointerleave', (ev) => {
            this.pubsub.publish('pointerleave', ev);
        });
    }
}

export {
    Keyboardhandler,
    Pointerhandler,
    Mousehandler
}
