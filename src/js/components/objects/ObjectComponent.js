import React from 'react';
import ObjectKeyValueComponent from './ObjectKeyValueComponent';

class ObjectComponent extends React.Component {
    constructor(props) {
        super(props);

        this.object = props.object;
    }

    render() {
        let self = this;
        return (
            <div className='object'>
                {Object.keys(this.object).map((k, ki) =>
                    <div key={ki}>
                        <ObjectKeyValueComponent kkey={k} val={self.object[k]} />
                    </div>
                )}
            </div>
        );
    }
}

export default ObjectComponent;