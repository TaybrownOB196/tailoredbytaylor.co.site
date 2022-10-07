import React from 'react';

import Keypad from './Keypad';

class Alphabetpad extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }

    handleClick(e) {
        this.props.handleClick(e);
    }

    render() {
        return (
            <span className='alphabetpad'>
                <Keypad handleClick={this.handleClick} keys={this.keys} />
            </span>
        );
    }
}

export default Alphabetpad;