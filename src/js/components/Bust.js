import React from 'react';
import taylor_bust from './../../svg/taylor_bust_bowtie.svg'
// import taylor_bust from './../../svg/taylor_bust.svg'


function Bust() {
    return (
        <div style={bustStyle} className='bust_circle tbt-circle'>
            <img style={imgStyle} src={taylor_bust}></img>
        </div>
        );
}

const imgStyle = {
    width: '100%',
    height: 'auto',
}

const bustStyle = {
    width: '100%',
}

export default Bust;