import React from 'react';

class Keypad extends React.Component {
    constructor(props) {
        super(props);

        this.keys = this.props.keys;
    }

    render() {
        let self = this;
        return (
            <div className='keypad'>
            {
                this.keys.map(function (k, idx) {
                    return <div key={idx} onClick={(k) => self.props.handleClick(k)}>{k}</div>
                })
            }
            </div>
        );
    }
}

export default Keypad;