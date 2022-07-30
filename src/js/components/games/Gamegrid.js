import React from 'react';
import Gridrow from './Gridrow';
import Utility from './../../lib/Utility';
import './../../../sass/grid.scss';

class Gamegrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        this.state = { ID: Utility.GetRandomInt(1337), Grid: this.props.grid };
    }

    handleClick(e) {
        this.props.handleClick(e, this.state.Grid);
    }

    render() {
        //Set to variable since scope to this is lost once inside another function
        let rowCount = this.state.Grid.RowCount;
        let grid = this.state.Grid;
        let self = this;
        return (
            <div className='gridboard'> {
                    Array.apply(0, Array(this.state.Grid.ColCount)).map(function (c, ci) {
                        return <Gridrow 
                                    key={ci}
                                    ID={self.state.ID}
                                    handleClick={self.handleClick} 
                                    gridRow={grid.Container[ci]} 
                                    colIndex={ci} 
                                    count={rowCount} />
                    })
                }
            </div>
        );
    }

    
}

export default Gamegrid;