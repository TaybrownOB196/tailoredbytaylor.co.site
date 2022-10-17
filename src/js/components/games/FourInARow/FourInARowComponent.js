import React from 'react';
import GamegridComponent from '../GamegridComponent';
import Grid from '../../../lib/grid/Grid';
import Utility from '../../../lib/Utility';

import '../../../../sass/fourinarow.scss';

//7 columns × 6 rows
class FourInARowComponent extends React.Component {
    constructor(props) {
        super(props);
        this.winMatchCount = 4;
        this.colCount = 7;
        this.rowCount = 6;
        this.p1 = 'X';
        this.p1WinString = `${this.p1}${this.p1}${this.p1}${this.p1}`;
        this.p2 = 'O';
        this.p2WinString = `${this.p2}${this.p2}${this.p2}${this.p2}`;
        this.state = { ID: Utility.GetRandomInt(1337), key: Utility.GetRandomInt(1337), isGameOver: false, p1Turn: true, p1w: 0, p2w: 0 };
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.setState({ ID: this.state.ID, key: Utility.GetRandomInt(1337), isGameOver: false, p1Turn: this.state.p1Turn, p1w: 0, p2w: 0 });
    }

    handleMouseEnter(e, ID, grid) {
        if (this.state.isGameOver) return;
        let color = this.state.p1Turn ? 'lightpink' : 'lightblue';
        let [col, row, gameID] = e.target.id.split('|');
        for (let x=this.rowCount-1; x>=0; x--) {
            document.getElementById(`${col}|${x}|${gameID}`).style.backgroundColor = color;
        }
    }

    handleMouseLeave(e, ID, grid) {
        if (this.state.isGameOver) return;
        let [col, row, gameID] = e.target.id.split('|');
        for (let x=this.rowCount-1; x>=0; x--) {
            document.getElementById(`${col}|${x}|${gameID}`).style.backgroundColor = 'white';

        }

    }

    handleClick(e, ID, grid) {
        if (this.state.isGameOver) return;
        let [col, row, gameID] = e.target.id.split('|');
        for(let rowIndex=this.rowCount-1; rowIndex >= 0; rowIndex--) {
            if (!grid.Container[col][rowIndex]) {
                let marker = this.p1;
                if (!this.state.p1Turn) {
                    marker = this.p2;
                }

                document.getElementById(`${col}|${rowIndex}|${gameID}`).innerHTML = `<span class='gamePiece ${marker == this.p1 ? 'red' : 'blue' }'></span>`;
                grid.Container[col][rowIndex] = marker;
                
                if (this.isGameOver(grid, col, rowIndex, marker, ID)) {
                    // this.reset();
                    console.log('GameOver');
                } else {
                    this.setState({ ID: this.state.ID, key: this.state.key, isGameOver: this.state.isGameOver, p1Turn: !this.state.p1Turn, p1w: this.state.p1w, p2w: this.state.p2w });
                }

                break;
            }
        }
    }

    isGameOver(grid, col, row, marker, ID) {
        return this.checkDiagonal(grid, col, row, marker, ID) ||
            this.checkHorizonal(grid, col, row, marker, ID) ||
            this.checkVertical(grid, col, row, marker, ID);
    }

    colorTiles(color, ID, tiles) {
        for(let tile of tiles) {
            document.getElementById(`${tile.col}|${tile.row}|${ID}`).style.backgroundColor = color;
        }
    }

    checkDiagonal(grid, col, row, marker, ID) {
        let results = [];
        results.push({col:col, row: row});
        let adjWinMatchCount = this.winMatchCount - 1;
        let _col = parseInt(col);
        let _row = parseInt(row);
        let colMod = _col >= adjWinMatchCount ? -1 : 1;
        let rowMod = _row >= adjWinMatchCount ? -1 : 1;
        for(let x=adjWinMatchCount; x>=1; x--) {
            let c = _col + parseInt(colMod * x);
            let r = _row + parseInt(rowMod * x);
            if (grid.Container[c][r] == marker) {
                results.push({col: c, row: r});
                if (results.length >= this.winMatchCount) {
                    this.setState({ 
                        ID: this.state.ID, 
                        key: this.state.key, 
                        isGameOver: true, 
                        p1Turn: this.state.p1Turn, 
                        p1w: this.state.p1Turn ? this.state.p1w + 1 : this.state.p1w, 
                        p2w: !this.state.p1Turn ? this.state.p2w + 1 : this.state.p2w });
                    console.log(`${marker} wins diagonal`);

                    this.colorTiles('green', ID, results);
                    return true;
                }
            } else {
                results = [];
            }
        }
        
        return false;
    }

    checkHorizonal(grid, col, row, marker, ID) {
        let results = [];
        for(let colIndex=0; colIndex<this.colCount-1; colIndex++) {
            if (grid.Container[colIndex][row] == marker) {
                results.push({col: colIndex, row: row});
                if (results.length >= this.winMatchCount) {
                    this.setState({ 
                        ID: this.state.ID, 
                        key: this.state.key, 
                        isGameOver: true, 
                        p1Turn: this.state.p1Turn, 
                        p1w: this.state.p1Turn ? this.state.p1w + 1 : this.state.p1w, 
                        p2w: !this.state.p1Turn ? this.state.p2w + 1 : this.state.p2w });
                    console.log(`${marker} wins horizontal`);

                    this.colorTiles('green', ID, results);
                    return true;
                }
            } else {
                results = [];
            }
        }

        return false;
    }

    checkVertical(grid, col, row, marker, ID) {
        let results = [];
        for(let rowIndex=this.rowCount-1; rowIndex>0; rowIndex--) {
            if (grid.Container[col][rowIndex] == marker) {
                results.push({col: col, row: rowIndex});                
                if (results.length >= this.winMatchCount) {
                    this.setState({ 
                        ID: this.state.ID, 
                        key: this.state.key, 
                        isGameOver: true, 
                        p1Turn: this.state.p1Turn, 
                        p1w: this.state.p1Turn ? this.state.p1w + 1 : this.state.p1w, 
                        p2w: !this.state.p1Turn ? this.state.p2w + 1 : this.state.p2w });
                    console.log(`${marker} wins vertical`);
                    this.colorTiles('green', ID, results);
                    return true;
                }
            } else {
                results = [];
            }
        }

        return false;
    }

    render() {
        return (
            <div id='fourinarow' className='opaque-bg-container' key={this.state.key} >
                <div className='opaque-bg'></div>
                <GamegridComponent
                    key={this.state.key} 
                    grid={new Grid('', this.colCount, this.rowCount)}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    handleClick={this.handleClick} />
                <div>
                    <p>{`P1 Wins: ${this.state.p1w}`}</p>
                    <p>{`P2 Wins: ${this.state.p2w}`}</p>
                </div>
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }
}

export default FourInARowComponent;