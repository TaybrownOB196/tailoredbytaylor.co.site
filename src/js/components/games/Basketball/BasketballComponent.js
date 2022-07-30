import React from 'react';
import Basketball from './Index';

class BasketballComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Basketball().run();
        let startButton = document.getElementById('BasketballContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='BasketballComponent'>
                <div id='BasketballContainer'></div>
                <button id='BasketballContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }
}

export default BasketballComponent;