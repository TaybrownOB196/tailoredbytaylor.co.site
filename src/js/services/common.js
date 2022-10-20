class JSONService {
    constructor(json) {
        this.data = JSON.stringify(json);
    }

    getData() {
        return new Promise((resolve) => {
            let hdr = new Headers();
            hdr.append('Content-Type', 'application/json');
            resolve(new Response(this.data, {'status':200,'statusText':'OK', 'headers': hdr}));
        }, (reject) => {
            reject('oops');
        })
    }
}

class HttpService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    get(resource) {
        return fetch(`${this.baseUrl}/${resource}`, { method:'get', credentials: 'include' })
            .then((body) => { return body.json() })
            .catch(err => console.log(`¯\_(ツ)_/¯   ${err}`));
    }
}

export {
    JSONService,
    HttpService,
}