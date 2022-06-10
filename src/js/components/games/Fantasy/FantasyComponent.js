import React from 'react';
import Fantasy from './Index';

class FantasyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Fantasy().run();
        let startButton = document.getElementById('FantasyContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='FantasyComponent'>
                <div id='FantasyContainer'></div>
                <button id='FantasyContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }
}

export default FantasyComponent;