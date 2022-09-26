import React from 'react';
import GamegridComponent from '../GamegridComponent';
import { Shotgrid } from './grids';

const marks = {
    hit: 'X',
    miss: 'O',
    invalid: '~',
}

class ShotgridC extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return <GamegridComponent grid={new Shotgrid(0, this.props.boardSize, this.props.boardSize, [0])} handleClick={this.handleClick}/>
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

export default ShotgridC;