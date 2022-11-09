import { Baseform } from './form';

class UserInfo extends Baseform {
    constructor(elementID, submitUrl) {
        super(elementID, submitUrl);
        this.firstName = document.getElementById(`${this.ID}-FN`);
        this.lastName = document.getElementById(`${this.ID}-LN`);
        this.emailAddress = document.getElementById(`${this.ID}-EA`);
        this.phoneNumber = document.getElementById(`${this.ID}-PN`);
        this.postalCode = document.getElementById(`${this.ID}-PC`);
        this.address1 = document.getElementById(`${this.ID}-A1`);
        this.address2 = document.getElementById(`${this.ID}-A2`);
    }

    GetPayload() {
        return {
            firstName: this.fieldValueOrNull('firstName'),
            lastName: this.fieldValueOrNull('lastName'),
            emailAddress: this.fieldValueOrNull('emailAddress'),
            phoneNumber: this.fieldValueOrNull('phoneNumber'),
            postalCode: this.fieldValueOrNull('postalCode'),
            address1: this.fieldValueOrNull('address1'),
            address2: this.fieldValueOrNull('address2')
        };
    }

    OnSucess(res) {
        alert(
`${this.fieldValueOrNull('firstName')}, Thank You for your submission!
DISCLAIMER: No data has been captured, purely for simulation`); 
    }
}

export default UserInfo;