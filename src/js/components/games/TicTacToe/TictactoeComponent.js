import React from 'react';
import GamegridComponent from '../GamegridComponent';
import Grid from '../../../lib/grid/Grid';
import Utility from '../../../lib/Utility';

import './../../../../sass/tictactoe.scss';

const BOARD_SIZE = 3;
class TictactoeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.p1 = 'X';
        this.p1WinString = `${this.p1}${this.p1}${this.p1}`;
        this.p2 = 'O';
        this.p2WinString = `${this.p2}${this.p2}${this.p2}`;
        this.state = { isGameOver: false, p1Turn: true, key: Utility.GetRandomInt(9999999999), p1w: 0, p2w: 0 };
        this.handleClick = this.handleClick.bind(this);
        this.isGameOver = this.isGameOver.bind(this);
        this.reset = this.reset.bind(this);
    }

    render() {
        return (
            <div id='tictactoe'>
                <GamegridComponent key={this.state.key} grid={new Grid('', BOARD_SIZE, BOARD_SIZE)} handleClick={this.handleClick} />
                <div>
                    <p>{`P1 Wins: ${this.state.p1w}`}</p>
                    <p>{`P2 Wins: ${this.state.p2w}`}</p>
                </div>
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }

    reset() {
        this.setState({ isGameOver: false, key: Utility.GetRandomInt(9999999999), p1Turn: this.state.p1Turn, p1w: this.state.p1w, p2w: this.state.p2w });
    }

    handleClick(e, ID, grid) {
        if (this.state.isGameOver) return;
        let coord = e.target.id.split('|');
        if (!grid.Container[coord[1]][coord[0]]) {
            let marker = this.p1;
            if (!this.state.p1Turn) {
                marker = this.p2;
            }
            
            document.getElementById(e.target.id).innerHTML = marker;
            grid.Container[coord[1]][coord[0]] = marker;

            if (this.isGameOver(grid)) {

                // this.reset();
            } else {
                this.setState({ isGameOver: this.state.isGameOver, p1Turn: !this.state.p1Turn, p1w: this.state.p1w, p2w: this.state.p2w });
            }
        }
    }

    //TODO: leverage optimization here
    isGameOver(grid) {
        let top = grid.Container[0][0] + grid.Container[0][1] + grid.Container[0][2];
        let mid = grid.Container[1][0] + grid.Container[1][1] + grid.Container[1][2];
        let btm = grid.Container[2][0] + grid.Container[2][1] + grid.Container[2][2];
        let lft = grid.Container[0][0] + grid.Container[1][0] + grid.Container[2][0];
        let ctr = grid.Container[0][1] + grid.Container[1][1] + grid.Container[2][1];
        let rht = grid.Container[0][2] + grid.Container[1][2] + grid.Container[2][2];
        let ltr = grid.Container[0][0] + grid.Container[1][1] + grid.Container[2][2];
        let rtl = grid.Container[2][0] + grid.Container[1][1] + grid.Container[0][2];
        if (top == this.p1WinString || mid == this.p1WinString || btm == this.p1WinString ||
            lft == this.p1WinString || ctr == this.p1WinString || rht == this.p1WinString ||
            ltr == this.p1WinString || rtl == this.p1WinString) {
            console.log('p1 wins');
            this.setState({ isGameOver: true, p1Turn: this.state.p1Turn, p1w: this.state.p1w + 1, p2w: this.state.p2w });
            return true;
        } else if (top == this.p2WinString || mid == this.p2WinString || btm == this.p2WinString ||
            lft == this.p2WinString || ctr == this.p2WinString || rht == this.p2WinString ||
            ltr == this.p2WinString || rtl == this.p2WinString) {
            console.log('p2 wins');
            this.setState({ isGameOver: true, p1Turn: this.state.p1Turn, p1w: this.state.p1w, p2w: this.state.p2w + 1 });
            return true;           
        }
        return false;
    }
}

export default TictactoeComponent;