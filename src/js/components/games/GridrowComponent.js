import React from 'react';
import GridtileComponent from './GridtileComponent';

class GridrowComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let row = this.props.gridRow;
        let handleClick = this.props.handleClick;
        let handleMouseEnter = this.props.handleMouseEnter;
        let handleMouseLeave = this.props.handleMouseLeave;
        let self = this;
        return (
            <> {
                Array.apply(0, Array(this.props.count)).map(function (r, ri) {
                    return <GridtileComponent 
                            ID={self.props.ID} 
                            handleClick={handleClick} 
                            handleMouseEnter={handleMouseEnter} 
                            handleMouseLeave={handleMouseLeave} 
                            colIndex={ri} 
                            rowIndex={self.props.rowIndex} 
                            key={ri} 
                            value={row[ri]} />})
            }</>   
    );
    }
   
}

export default GridrowComponent;