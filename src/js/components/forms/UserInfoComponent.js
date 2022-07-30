import React, { useState } from 'react';
import UserInfo from './Userinfo';
import InputField from './InputField';

import '../../../sass/forms.scss';

// import UserInfoComponent from 'forms/UserInfoComponent';
// <UserInfoComponent id='userInfoForm' formID='userInfoForm' submitUrl='https://jsonplaceholder.typicode.com/posts'/>

class UserInfoComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.form = new UserInfo(this.props.formID, this.props.submitUrl);
    }

    render() {
        return (
            <div className='userInfoContainer'>
                <form className='baseForm userInfo' id={this.props.formID}>
                <InputField LabelText='First Name' InputDefaultValue='first name' InputID={`${this.props.formID}-FN`} ErrorMessage='Please enter first name' />
                <InputField LabelText='Last Name' InputDefaultValue='last name' InputID={`${this.props.formID}-LN`} ErrorMessage='Please enter last name' />
                <InputField LabelText='Email Address' InputDefaultValue='email@address.com' InputID={`${this.props.formID}-EA`} ErrorMessage='Please enter valid email address' />
                <InputField LabelText='Phone Number' InputDefaultValue='(333)333-4444' InputID={`${this.props.formID}-PN`} ErrorMessage='Please enter valid phonenumber'/>
                <InputField LabelText='Address 1' InputDefaultValue='123 Street' InputID={`${this.props.formID}-A1`} ErrorMessage='Please enter valid street address'/>
                <InputField LabelText='Address 2' InputDefaultValue='Apt #1' InputID={`${this.props.formID}-A2`} />
                <InputField LabelText='Postal Code' InputDefaultValue='90210' InputID={`${this.props.formID}-PC`} ErrorMessage='Please enter valid postal code'/>

                <input id={`${this.props.formID}-Submit`} type='submit' value='Submit' />
            </form>
            </div>
        );
    }
}

export default UserInfoComponent;