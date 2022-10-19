import React from 'react';

export default class ObjectValueArrayComponent extends React.Component {
    constructor(props) {
        super(props);
        this.array = props.array;
    }

    render() {
        return <div className='valueArray'>
            {this.array.map((item, index) =>
                <p key={index}>{item}</p>
            )}
        </div>
    }
}