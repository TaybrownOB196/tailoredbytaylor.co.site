import React from 'react';

class Blurb extends React.Component {
    render() {
        return (
            <div className='blurb'>
                <h6>{this.props.blurb.title}</h6>
            </div>
        );
    }
}

export default Blurb;