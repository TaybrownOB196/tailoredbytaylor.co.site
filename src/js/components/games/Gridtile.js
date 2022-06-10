import React from 'react';

class Gridtile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div 
                id={`${this.props.rowIndex}|${this.props.colIndex}|${this.props.ID}`} 
                onClick={this.props.handleClick}>
            </div>);
    }
   
}

export default Gridtile;