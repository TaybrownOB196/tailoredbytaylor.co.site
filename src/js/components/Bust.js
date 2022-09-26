import React from 'react';
import taylor_bust from './../../png/bust.png'

function Bust() {
    return (
        <div className='grid-bust'>
            <img id='bust' className='bust-circle light-blue-1' src={taylor_bust}></img>
        </div>
    );
}

export default Bust;