import React from 'react';
import PropTypes from 'prop-types';

import './Keypad.css';

export default function Keypad({...props}) {
    return (
        <div className='keypad'>
        {
            props.keys.map(function (k, idx) {
                return <div key={idx} onClick={(k) => props.handleClick(k)}>{k}</div>
            })
        }
        </div>
    );
}

Keypad.propTypes = {
    keys: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
};

Keypad.defaultProps = {
    handleClick: (e) => alert(e.target.innerHTML)
};