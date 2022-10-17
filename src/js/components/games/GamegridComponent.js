import React from 'react';
import GridrowComponent from './GridrowComponent';
import Utility from '../../lib/Utility';
import './../../../sass/grid.scss';

class GamegridComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state = { ID: Utility.GetRandomInt(1337), Grid: this.props.grid };
    }

    handleMouseEnter(e) {
        if (this.props.handleMouseEnter) {
            this.props.handleMouseEnter(e, this.state.ID, this.state.Grid);
        }
    }

    handleMouseLeave(e) {
        if (this.props.handleMouseLeave) {
            this.props.handleMouseLeave(e, this.state.ID, this.state.Grid);
        }
    }

    handleClick(e) {
        this.props.handleClick(e, this.state.ID, this.state.Grid);
    }

    render() {
        //Set to variable since scope to this is lost once inside another function
        let grid = this.state.Grid;
        let self = this;
        return (
            <div className='gridboard'> {
                    Array.apply(0, Array(this.state.Grid.RowCount)).map(function (r, ri) {
                        return <GridrowComponent 
                                key={ri}
                                ID={self.state.ID}
                                handleClick={self.handleClick} 
                                handleMouseEnter={self.handleMouseEnter} 
                                handleMouseLeave={self.handleMouseLeave} 
                                gridRow={grid.Container[ri]} 
                                rowIndex={ri} 
                                count={self.state.Grid.ColCount} />
                    })
                }
            </div>
        );
    }

    
}

export default GamegridComponent;