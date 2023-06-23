class Baseform {
    constructor(elementID, submitUrl, options={method:'POST', headers: { 'Content-Type': 'application/json' }}) {
        this.ID = elementID;
        this.submitUrl = submitUrl;
        this.options = options;
        
        this.form = document.getElementById(this.ID);
        this.submitButton = document.getElementById(`${this.ID}-Submit`);

        if (this.submitButton) {
            this.form.onsubmit = (event) => {
                event.preventDefault();
                
                this.Submit();
            }
        }
        
        this.Submit = this.Submit.bind(this);
    }

    fieldValueOrNull(fieldName) {
        if (this.hasOwnProperty(fieldName) && this[fieldName]) {
            return this[fieldName].value;
        }

        return null;
    }

    GetPayload() { return null; }

    Submit() {
        let payload = this.GetPayload();
        if (payload) {
            //Concrete logic goes here for basic submission
            this.options.body = JSON.stringify(payload);
            console.log(this.options);
            fetch(this.submitUrl, this.options)
                .then((res) => this.OnSucess(res))
                .catch((err) => this.OnError(err));
        }
    }
    
    //Add virtual functions for successcallback and errorcallback
    OnSucess(res) { }
    OnError(err) { console.log(err); }
}

export {
    Baseform
} 