import { JSONService } from './common';

import json from '../data/blurbs.json'

class BlurbsService {
    constructor() {
        this.service = new JSONService(json);
        // this.data = JSON.stringify(json);
    }

    getBlurbs() {
        return this.service.getData();
    }
}

export default BlurbsService;