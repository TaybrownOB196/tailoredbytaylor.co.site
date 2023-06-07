import React from 'react';
import PropTypes from 'prop-types';

import { Keypad } from './Keypad';

import './Numpad.css';

export function Numpad({...props}) {
    return (
        <span className='numpad'>
            <Keypad handleClick={props.handleClick} keys={[0,1,2,3,4,5,6,7,8,9]} />
        </span>
    );
}

Numpad.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

Numpad.defaultProps = {
    handleClick: (e) => alert(e.target.innerHTML)
};