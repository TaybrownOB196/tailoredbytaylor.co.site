import React from 'react';
import GamegridComponent from '../GamegridComponent';
import Grid from '../../../lib/grid/Grid';
import Utility from '../../../lib/Utility';

import '../../../../sass/matchinggame.scss';

class MatchingGameComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.colCount = props.colCount;
        this.rowCount = props.rowCount;
        //(props.colCount * props.rowCount) must be even
        this.valueCount = (props.colCount * props.rowCount)/2;
        let values = Utility.range(this.valueCount);
        values = Utility.shuffle(values.concat(values));
        this.handleClick = this.handleClick.bind(this);
        this.reset = this.reset.bind(this);
        this.state = { 
            ID: Utility.GetRandomInt(1337), 
            key: Utility.GetRandomInt(1337), 
            isGameOver: false, 
            p1Turn: true, 
            p1w: 0, 
            p2w: 0,
            values: values,
            colors: Utility.getRandomColors(values.length)
        };
        this.lastPos = { p1Turn: !this.state.p1Turn };
    }

    reset() {
        let values = Utility.range(this.valueCount);
        values = Utility.shuffle(values.concat(values));
        this.setState({ 
            ID: this.state.ID, 
            key: Utility.GetRandomInt(1337), 
            isGameOver: false, 
            p1Turn: this.state.p1Turn, 
            p1w: 0, 
            p2w: 0, 
            values: values, 
            colors: Utility.getRandomColors(values.length) 
        });
    }

    handleClick(e, ID, grid) {
        if (this.state.isGameOver) return;

        function _toIndex(pos, colCount) {
            return (parseInt(pos.row) * parseInt(colCount)) + parseInt(pos.col);
        }

        let [col, row, gameID] = e.target.id.split('|');
        let currentIdx = (parseInt(row) * parseInt(this.colCount)) + parseInt(col);
        document.getElementById(`${col}|${row}|${gameID}`).style.backgroundColor = this.state.colors[this.state.values[currentIdx]];
        let p1MatchCount = this.state.p1w;
        let p2MatchCount = this.state.p2w;
        if (this.lastPos.p1Turn == this.state.p1Turn) {
            if (this.lastPos.col !== col && this.lastPos.row !== row
                && this.state.values[_toIndex(this.lastPos, this.colCount)] == this.state.values[currentIdx]) 
            {
                this.state.p1Turn ? p1MatchCount++ : p2MatchCount++;
            } else {
                setTimeout(() => {
                    document.getElementById(`${col}|${row}|${gameID}`).style.backgroundColor = 'white';
                    document.getElementById(`${this.lastPos.col}|${this.lastPos.row}|${gameID}`).style.backgroundColor = 'white';
                }, 1000);
            }

            this.setState({ 
                ID: this.state.ID, 
                key: this.state.key, 
                isGameOver: this.state.isGameOver, 
                p1Turn: !this.state.p1Turn, 
                p1w: p1MatchCount, 
                p2w: p2MatchCount, 
                values: this.state.values, 
                colors: this.state.colors });

        } else {
            this.lastPos = { p1Turn: this.state.p1Turn, col: col, row: row};
        }
    }

    isGameOver(grid, col, row, marker, ID) {
        return false;
    }

    render() {
        return (
            <div id='matchinggame' className='opaque-bg-container reactgame' key={this.state.key} >
                <div className='opaque-bg'></div>
                <GamegridComponent
                    key={this.state.key} 
                    grid={new Grid('', this.colCount, this.rowCount)}
                    handleClick={this.handleClick} />
                <div>
                    <p>Turn Player {this.state.p1Turn ? 'P1' : 'P2'}</p>
                    <p>{`P1 Matches: ${this.state.p1w}`}</p>
                    <p>{`P2 Matches: ${this.state.p2w}`}</p>
                </div>
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }
}

export default MatchingGameComponent;