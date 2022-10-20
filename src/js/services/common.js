const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
            error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });
  
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

class JSONService {
    constructor(json) {
        this.data = JSON.stringify(json);
    }

    //NOTE: resolve(value) and reject(err) are the respective methods for returning a successful response object:value or a unsuccessful response object:err
    //NOTE: reject should always return a fetch API Error object
    //NOTE: then(result, error) takes two functions, one for handling successful result, and error for handling failed promise resolution, or you can just do then(result).catch(error)
    //NOTE: Adding .then/.catch/.finally to a resolved promise executes the handler immediatly
    async getData() {
        //Return a Promise that resolves to fetch API Response object, resolve is always called unless somehow and error is thrown
        return new Promise((resolve) => {
            let hdr = new Headers();
            hdr.append('Content-Type', 'application/json');
            resolve(new Response(this.data, {'status':200,'statusText':'OK', 'headers': hdr}));
        }, (reject) => {
            //Reject just gives back a string as an error, since this code should never fail
            reject(new Error('¯\\_(ツ)_/¯'));
        })
    }
}

class HttpService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get(resource) {
        return fetch(`${this.baseUrl}/${resource}`, { method:'get', credentials: 'include' })
            .then((body) => { return body.json(); })
            .catch(err => console.log(new Error(`¯\\_(ツ)_/¯   ${err}`)));
    }
}

export {
    JSONService,
    HttpService,
    makeCancelable
}