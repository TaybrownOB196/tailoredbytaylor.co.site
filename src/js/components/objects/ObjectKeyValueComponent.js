import React from 'react';
import ObjectKeyComponent from './ObjectKeyComponent';
import ObjectValueComponent from './ObjectValueComponent';
import ObjectValueArrayComponent from './ObjectValueArrayComponent';

export default class ObjectKeyValueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.kkey = props.kkey;
        this.val = props.val;
    }

    render() {
        let toReturn = <ObjectValueComponent value={this.val} />;
        if (Array.isArray(this.val)) {
            toReturn = <ObjectValueArrayComponent array={this.val} />;
        }
        return (<div>
            <ObjectKeyComponent value={this.kkey}  />
            { toReturn }
        </div>);
    }
}