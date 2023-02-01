import React from 'react';
import Ronin from './Index';

class RoninComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Ronin().run();
        let startButton = document.getElementById('RoninContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='RoninComponent'>
                <div id='RoninContainer'></div>
                <button id='RoninContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }

}

export default RoninComponent;