import React from 'react';

class GridtileComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div 
                id={`${this.props.colIndex}|${this.props.rowIndex}|${this.props.ID}`} 
                onClick={this.props.handleClick}
                onMouseEnter={this.props.handleMouseEnter}
                onMouseLeave={this.props.handleMouseLeave}>
            </div>);
    }
   
}

export default GridtileComponent;