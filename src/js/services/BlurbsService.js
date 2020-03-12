class BlurbsService {
    constructor() {
        this.url = 'https://localhost:5001/blurbs';
    }

    async getBlurbs() {
        return await fetch(this.url)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                return json;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default BlurbsService;