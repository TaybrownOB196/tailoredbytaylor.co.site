import React from 'react';
import PunchyKicky from './Index';

class PunchyKickyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new PunchyKicky().run();
        let startButton = document.getElementById('PunchyKickyContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='PunchyKickyComponent'>
                <div id='PunchyKickyContainer'></div>
                <button id='PunchyKickyContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }

}

export default PunchyKickyComponent;