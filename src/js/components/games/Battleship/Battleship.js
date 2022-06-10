import React from 'react';
import ShipgridC from './ShipgridC';
import ShotgridC from './ShotgridC';
import './../../../../sass/battleship.scss';

/* <Battleship /> */

const main = {
    display: 'inline-flex',
}

class Battleship extends React.Component {
    constructor(props) {
        super(props);
        this.boardSize = 10;
    }

    render() {
        return (
        <div className='battleship' style={main}>
            <ShipgridC boardSize={this.boardSize}/>

            <ShotgridC boardSize={this.boardSize}/>
        </div>)
    }
}

export default Battleship;