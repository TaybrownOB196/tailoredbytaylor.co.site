import React from 'react';
import Olympian from './index';

class OlympianComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Olympian().run();
        let startButton = document.getElementById('OlympianContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='OlympianComponent'>
                <div id='OlympianContainer'></div>
                <button id='OlympianContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }
}

export default OlympianComponent;