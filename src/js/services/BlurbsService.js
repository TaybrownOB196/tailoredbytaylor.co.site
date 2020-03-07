class BlurbsService {
    constructor() {
        this.url = 'https://jsonplaceholder.typicode.com/posts?_limit=20';
    }

    async getBlurbs() {
        return await fetch(this.url)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                console.log(json);
                return json;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default BlurbsService;