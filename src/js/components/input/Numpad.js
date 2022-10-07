import React from 'react';

import Keypad from './Keypad';

class Numpad extends React.Component {
    constructor(props) {
        super(props);
        this.keys = [0,1,2,3,4,5,6,7,8,9];
    }

    render() {
        return (
            <span className='numpad'>
                <Keypad handleClick={this.props.handleClick} keys={this.keys} />
            </span>
        );
    }
}

export default Numpad;