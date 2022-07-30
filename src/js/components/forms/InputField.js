import React from 'react';

class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.InputType || 'text';
    }

    render() {
        return (
            <React.Fragment>
                <label>{this.props.LabelText}</label>
                <span id={`${this.props.InputID}-ERR`} style={errorMessageStyle}>{this.props.ErrorMessage}</span>
                <input id={this.props.InputID} type={this.type} defaultValue={this.props.InputDefaultValue} />
            </React.Fragment>
        );
    }
}

const errorMessageStyle = {
    color: 'red',
    fontWeight: 'bold',
    display: 'none',
}

export default InputField;