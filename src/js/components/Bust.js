import React from 'react';
import taylor_bust from './../../svg/taylor_bust_bowtie.svg'
// import taylor_bust from './../../svg/taylor_bust.svg'


function Bust() {
    return (
        <div className='bust_circle'>
            <img className='bust_img' src={taylor_bust}></img>
        </div>
        );
}

export default Bust;