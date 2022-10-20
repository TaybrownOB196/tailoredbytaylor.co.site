import { HttpService } from './common';

class BlurbsService {
    constructor() {
        this.service = new HttpService('https://localhost:7022');
    }

    getBlurbs() {
        return this.service.get('api/blurb/get');
    }
}

export default BlurbsService;