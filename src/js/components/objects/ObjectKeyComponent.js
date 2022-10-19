import React from 'react';

export default class ObjectKeyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.value = props.value;
    }

    render() {
        return <div className='key'>{this.value}</div>;
    }
}