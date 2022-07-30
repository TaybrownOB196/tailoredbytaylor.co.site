import { Baseform } from './form';

class UserLogin extends Baseform {
    constructor(elementID, submitUrl) {
        super(elementID, submitUrl);
        this.userName = document.getElementById(`${this.ID}-UN`);
        this.password = document.getElementById(`${this.ID}-PW`);
    }

    GetPayload() {
        return {
            userName: this.fieldValueOrNull('userName'),
            password: this.fieldValueOrNull('password')
        };
    }

    OnSucess(res) { console.log(res); }
}

export default UserLogin;