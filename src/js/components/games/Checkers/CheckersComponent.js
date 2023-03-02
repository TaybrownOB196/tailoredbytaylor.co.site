import React from 'react';
import GamegridComponent from '../GamegridComponent';
import Grid from '../../../lib/grid/Grid';
import Utility from '../../../lib/Utility';

import '../../../../sass/checkers.scss';

class Checker {
    constructor(color, isTopPlayer) {
        this.color = color;
        this.isKing = false;
        this.isAlive = true;
        this.isTopPlayer = isTopPlayer;
    }

    toHtml() {
        let toReturn = document.createElement('span');
        toReturn.classList.add('gamePiece', this.color);
        return toReturn;
    }

    getPossibleSquares(col, row) {
        let toReturn = [];
        return toReturn;
    }

    getAdjacent(col, row, range=1) {
        let toReturn = [];
        for(let idx=1; idx<=range; idx++) {
            if (this.IsInBounds(col-idx,row)) {
                toReturn.push(new Gridcell(col-idx, row));
            }
            if (this.IsInBounds(col-idx,row+idx)) {
                toReturn.push(new Gridcell(col-idx, row+idx));
            }
            if (this.IsInBounds(col,row+idx)) {
                toReturn.push(new Gridcell(col, row+idx));
            }
            if (this.IsInBounds(col+idx,row+idx)) {
                toReturn.push(new Gridcell(col+idx, row+idx));
            }
            if (this.IsInBounds(col+idx,row)) {
                toReturn.push(new Gridcell(col+idx, row));
            }
            if (this.IsInBounds(col+idx,row-idx)) {
                toReturn.push(new Gridcell(col+idx, row-idx));
            }
            if (this.IsInBounds(col,row-idx)) {
                toReturn.push(new Gridcell(col, row-idx));
            }
            if (this.IsInBounds(col-idx,row-idx)) {
                toReturn.push(new Gridcell(col-idx, row-idx));
            }
        }

        return toReturn;
    }
}

class CheckersComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.reset = this.reset.bind(this);
        this.state = { 
            ID: Utility.GetRandomInt(1337), 
            key: Utility.GetRandomInt(1337), 
            isGameOver: false, 
            p1Turn: true, 
            p1w: 0, 
            p2w: 0,
            gridBoard: new Grid('', 8, 8)
        };
        this.selectedPos = null;
        this.possibleSquares = [];
        this.p1Color = 'black';
        this.p2Color = 'white';
    } 

    componentDidMount() {
        this.state.gridBoard.ExecuteGrid((row, column) => {
            let square = document.getElementById(`${column}|${row}|${this.state.ID}`);
            let pieceColor = this.p1Color;
            if (row > 4) {
                pieceColor = this.p2Color;
            }

            let checker = new Checker(pieceColor, pieceColor === this.p1Color);
            let boardSquareColor = 'red';
            if ((row % 2 === 0 && column % 2 !== 0) || (row % 2 !== 0 && column % 2 === 0)) {
                boardSquareColor = 'black';

                if (row > 4 || row < 3) {
                    this.state.gridBoard.Set(column, row, checker);
                    square.appendChild(checker.toHtml());
                }
            }
            
            square.style.backgroundColor = boardSquareColor;
        });
    }

    reset() {
        // console.log('reset')
        this.setState({ 
            ...this.state,
            key: Utility.GetRandomInt(1337), 
            isGameOver: false, 
            p1Turn: true, 
            p1w: 0, 
            p2w: 0,
            gridBoard: new Grid('', 8, 8)
        });
    }

    handleClick(e, ID, grid) {
        // console.log('handleclick', ID)
        if (this.state.isGameOver) return;
        
        let id = e.target.id;
        if (e.target.classList.contains('gamePiece')) {
            id = e.target.parentElement.id;
        }

        console.log(id, this.selectedPos)
        let [col, row, gameID] = this.splitID(id);
        if (!col || !row) return;
        
        let checker = this.state.gridBoard.Get(col, row);
        if (this.selectedPos && _isValidSquare(col, row, this.state.gridBoard)) {
            //If position selected previously, 
                //then check if new click position is valid option to: jump, move
                //else deselect selected pos and set it to new clicked pos
            if (checker === '') {
                const [_col, _row, _gameID] = this.splitID(this.selectedPos);
                let colDistance = Math.abs(_col - col);
                let rowDistance = Math.abs(_row - row);
                if (rowDistance === 2 || rowDistance === 1) {
                    //if possible movement  1
                    //if possible jump      2
                }
                
                
                let rowMod = this.state.p1Turn ? 1 : -1;
                let colMod = (_col - col < 0) ? 1 : (_col - col > 0) ? -1 : 0;
                let pieceColor = this.state.p1Turn ? this.p1Color : this.p2Color;

                //if is moving in the right direction
                //TODO: Refactor to account for jumps
                let newRowPos = _row + (1*rowMod);
                let newColPos = _col + (1*colMod);
                if (newRowPos === row) {
                    this.state.gridBoard.Set(newColPos, newRowPos, pieceColor);
                    this.state.gridBoard.Set(_col, _row, '');

                    let piece = this.createPiece(pieceColor);
                    let currentSquare = document.getElementById(id);
                    let previousSquare = document.getElementById(this.selectedPos);
                    previousSquare.removeChild(previousSquare.children[0]);
                    currentSquare.appendChild(piece);

                    this.changeTurn();
                    return;
                }
            }

        } 
        
        if (piece instanceof Checker && piece.color === this.state.p1Turn ? this.p1Color : this.p2Color) {
            //if piece is a piece that belongs to player, then set selectedPos, else return
            this.selectedPos = id;

            this.possibleSquares = checker.getPossibleSquares(col, row);
            for (let square in this.possibleSquares) {
                //if squarepos hits an opposing piece, then look for a jump downhill, or uphill if a king
                let squareContent = this.state.gridBoard.Get(square.col, square.row);
                if (squareContent instanceof Checker && squareContent.color === checker.color) {
                    
                }
                    //color jump squares green
                document.getElementById(`${square.col}|${square.row}|${gameID}`).style.backgroundColor = yellow;
                document.getElementById(`${square.col}|${square.row}|${gameID}`).style.backgroundColor = green;
            }
        }

        function _isValidSquare(c, r, gridBoard) {
            return gridBoard.IsInBounds(c,r) &&
                !((c % 2 === 0 && r % 2 === 0) || (c % 2 !== 0 && r % 2!== 0));
        }
    }

    changeTurn() {
        this.selectedPos = null;
        this.setState({
            ...this.state,
            p1Turn: !this.state.p1Turn
        });
    }

    splitID(idString) {
        let [c, r, gID] = idString.split('|');

        return [ parseInt(c), parseInt(r), parseInt(gID) ];
    }

    isGameOver(grid, col, row, marker, ID) {
        return false;
    }

    render() {
        return (
            <div id='checkers' className='opaque-bg-container reactgame' key={this.state.key} >
                <div className='opaque-bg'></div>
                <GamegridComponent
                    ID={this.state.ID}
                    key={this.state.key} 
                    grid={this.state.gridBoard}
                    handleClick={this.handleClick} />
                <div>
                    <p>Turn {this.state.p1Turn ? this.p1Color : this.p2Color}</p>
                    <p>{`P1 Wins: ${this.state.p1w}`}</p>
                    <p>{`P2 Wins: ${this.state.p2w}`}</p>
                </div>
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }
}

export default CheckersComponent;