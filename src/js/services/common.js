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

export {
    JSONService
}