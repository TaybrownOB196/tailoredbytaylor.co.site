import React from 'react';
import './../../../sass/tictactoe.scss';

/* <Tictactoe playerOne='X' playerTwo='O' /> */

class Tictactoe extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isPlayerOne: true, isGameOver: false };
        this.reset = this.reset.bind(this);
        this.tileClick = this.tileClick.bind(this);
    }

    render() {
        return (
            <div id='tictactoe' className='tictactoe' style={tictactoeStyle}>
                <div className='row'>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                </div>
                <div className='row'>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                </div>
                <div className='row'>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                    <div onClick={this.tileClick}></div>
                </div>

                <button style={buttonStyle} onClick={this.reset}>Reset</button>
            </div>
        );
    }

    reset() {
        this.setState({ isPlayerOne: this.state.isPlayerOne, isGameOver: false });
        let elements = document.querySelectorAll('#tictactoe > div div');
        for(let i=0; i<elements.length; i++) {
            elements[i].innerHTML = '';
        }
    }

    tileClick(e) {
        if (this.state.isGameOver || e.target.innerHTML !== '')
            return;

        if (this.state.isPlayerOne) {
            e.target.innerHTML = this.props.playerOne;
        } else {
            e.target.innerHTML = this.props.playerTwo;
        }

        if (this.checkHorizontal() || this.checkVertical() || this.checkDiagonal()) {
            console.log(`${this.state.isPlayerOne ? 'P1' : 'P2'} wins`);
            this.setState({ isPlayerOne: this.state.isPlayerOne, isGameOver: true });
        } else {
            this.setState({ isPlayerOne: !this.state.isPlayerOne, isGameOver: this.state.isGameOver });
        }

    }

    checkHorizontal() {
        let topRow = [
            document.querySelector('#tictactoe > div:nth-child(1) > div:nth-child(1)'),
            document.querySelector('#tictactoe > div:nth-child(2) > div:nth-child(1)'),
            document.querySelector('#tictactoe > div:nth-child(3) > div:nth-child(1)')
        ];

        let middleRow = [
            document.querySelector('#tictactoe > div:nth-child(1) > div:nth-child(2)'),
            document.querySelector('#tictactoe > div:nth-child(2) > div:nth-child(2)'),
            document.querySelector('#tictactoe > div:nth-child(3) > div:nth-child(2)')
        ];

        let bottomRow = [
            document.querySelector('#tictactoe > div:nth-child(1) > div:nth-child(3)'),
            document.querySelector('#tictactoe > div:nth-child(2) > div:nth-child(3)'),
            document.querySelector('#tictactoe > div:nth-child(3) > div:nth-child(3)')
        ];
    
        return this.areSamePiece(topRow) || this.areSamePiece(middleRow) || this.areSamePiece(bottomRow);
    }

    checkVertical() {
        let leftColumn = document.querySelector('#tictactoe > div:nth-child(1)').children;
        let middleColumn = document.querySelector('#tictactoe > div:nth-child(2)').children;
        let rightColumn = document.querySelector('#tictactoe > div:nth-child(3)').children;
    
        return this.areSamePiece(leftColumn) || this.areSamePiece(middleColumn) || this.areSamePiece(rightColumn);
    }

    checkDiagonal() {
        let topRightToBottomLeft = [
            document.querySelector('#tictactoe > div:nth-child(1) > div:nth-child(3)'),
            document.querySelector('#tictactoe > div:nth-child(2) > div:nth-child(2)'),
            document.querySelector('#tictactoe > div:nth-child(3) > div:nth-child(1)')
        ];

        let topLeftToBottomRight = [
            document.querySelector('#tictactoe > div:nth-child(1) > div:nth-child(1)'),
            document.querySelector('#tictactoe > div:nth-child(2) > div:nth-child(2)'),
            document.querySelector('#tictactoe > div:nth-child(3) > div:nth-child(3)')
        ];
    
        return this.areSamePiece(topRightToBottomLeft) || this.areSamePiece(topLeftToBottomRight);
    }
    
    areSamePiece(elements) {
        let p1WinString = this.props.playerOne + this.props.playerOne + this.props.playerOne;
        let p2WinString = this.props.playerTwo + this.props.playerTwo + this.props.playerTwo;
    
        let aggregate = '';
        for(let i=0; i<elements.length; i++) {
            aggregate += elements[i].innerHTML;
        }
    
        if(aggregate == p1WinString)
            return true;
        else if (aggregate == p2WinString)
            return true;
        else
            return false;
    }
}

const tictactoeStyle = {
    display: 'inline-grid',
}

const buttonStyle = {
    float: 'left',
}

export default Tictactoe;