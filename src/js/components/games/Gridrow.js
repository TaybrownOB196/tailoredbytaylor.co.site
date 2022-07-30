import React from 'react';
import Gridtile from './Gridtile';

class Gridrow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let row = this.props.gridRow;
        let handleClick = this.props.handleClick;
        let self = this;
        return (
            <div> {
                Array.apply(0, Array(this.props.count)).map(function (r, ri) {
                    return <Gridtile ID={self.props.ID} handleClick={handleClick} colIndex={self.props.colIndex} rowIndex={ri} key={ri} value={row[ri]} />})
            }</div>   
    );
    }
   
}

export default Gridrow;