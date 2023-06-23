import React from 'react';
import PropTypes from 'prop-types';

import Keypad from './Keypad';

import './Alphabetpad.css';

export default function Alphabetpad({...props}) {
    return (
        <span className='alphabetpad'>
            <Keypad handleClick={props.handleClick} keys={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']} />
        </span>
    );
}

Alphabetpad.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

Alphabetpad.defaultProps = {
    handleClick: (e) => alert(e.target.innerHTML)
};