import React from 'react';
import PunchyKicky from './Index';

class PunchyKickyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new PunchyKicky().run();
    }

    render() {
        return (
            <React.Fragment>
                <div id='PunchyKickyContainer'></div>
                <button onClick={this.onClickStart}>Start</button>
            </React.Fragment>
        )
    }
}

export default PunchyKickyComponent;