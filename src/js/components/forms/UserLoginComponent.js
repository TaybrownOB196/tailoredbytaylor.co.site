import React, { useState } from 'react';
import UserLogin from './Userlogin';
import InputField from './InputField';

import '../../../sass/forms.scss';


// import UserLoginComponent from 'forms/UserLoginComponent';
// <UserLoginComponent id='LoginForm' formID='LoginForm' submitUrl='https://jsonplaceholder.typicode.com/posts'/>

class UserLoginComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.form = new UserLogin(this.props.formID, this.props.submitUrl);
    }

    render() {
        return (
            <div className='userLoginContainer'>
                <form className='baseForm userLogin' id={this.props.formID}>
                <InputField LabelText='UserName' InputDefaultValue='username' InputID={`${this.props.formID}-UN`} ErrorMessage='Please enter username' />
                <InputField LabelText='Password' InputType='password' InputDefaultValue='password' InputID={`${this.props.formID}-PW`} ErrorMessage='Please enter password' />

                <input id={`${this.props.formID}-Submit`} type='submit' value='Login' />
            </form>
            </div>
        );
    }
}

export default UserLoginComponent;