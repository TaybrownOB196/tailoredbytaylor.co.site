import React from 'react';
import MLC from './Index';

import spritesheetPng from './../../../../png/games/mylittlechemist.png';

class MLCComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }
    
    componentDidMount() {
        this.game = new MLC(this.spritesheet);
        this.game.load();
    }

    onClickStart() {
        console.log(this.game);
        this.game.run();
        let startButton = document.getElementById('MLCContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='MLCComponent'>
                <div id='MLCContainer'>
                </div>
                <button id='MLCContainer-Start' style={bsStyle} onClick={this.onClickStart}>Start</button>
                <img id='MLC_SS_1' style={ssStyle} src={spritesheetPng}></img>
            </div>
        )
    }
}

const ssStyle = {
    display: 'none'
}

const bsStyle = {
    position: 'absolute',
    zIndex: 1,
    top: 0
}

export default MLCComponent;