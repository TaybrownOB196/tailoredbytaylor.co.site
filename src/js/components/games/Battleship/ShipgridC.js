import React from 'react';
import Gamegrid from './../Gamegrid';
import { Shipgrid } from './grids';

const marks = {
    hit: 'X',
    miss: 'O',
    invalid: '~',
}

class ShipgridC extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }  

    render() {
        let shipGrid = new Shipgrid(0, this.props.boardSize, this.props.boardSize, [0]);
        return <Gamegrid grid={shipGrid} handleClick={this.handleClick}/>
    }

    handleClick(e, grid) {
        let coord = e.target.id.split('|');
        if (grid.Container[coord[1]][coord[0]] === marks.miss) {
            document.getElementById(e.target.id).innerHTML = marks.hit;
            grid.Container[coord[1]][coord[0]] = marks.hit;
        } else if (grid.Container[coord[1]][coord[0]] === marks.invalid) {
            document.getElementById(e.target.id).innerHTML = marks.miss;
            grid.Container[coord[1]][coord[0]] = marks.miss;
        } else {
            document.getElementById(e.target.id).innerHTML = marks.invalid;
            grid.Container[coord[1]][coord[0]] = marks.invalid;
        }

    }
}

export default ShipgridC;