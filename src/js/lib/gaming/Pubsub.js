class Pubsub {
    constructor() {
      this.events = {};
    }
  
    subscribe(eventName, func) {
        if (this.events[eventName]) {
            this.events[eventName].push(func);
        } else {
            this.events[eventName] = [func];
        }
    }

    unsubscribe(eventName, func) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter((sub) => sub !== func);
        }
    }  
  
    publish(eventName, ...args) {
        const funcs = this.events[eventName];
        if (Array.isArray(funcs)) {
            funcs.forEach((func) => {
                if (func) {
                    func.apply(null, args);
                }
            });
        }
    }
}

export default Pubsub;