import React from 'react';

export default class ObjectValueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.value = props.value;
    }

    render() {
        return <div className='value'>{this.value}</div>;
    }
}