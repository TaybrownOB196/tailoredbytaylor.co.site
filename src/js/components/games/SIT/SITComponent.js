import React from 'react';
import SIT from './Index';
import spritesheet from '../../../../png/cars_ss.png';

const VERSION = '0.5.0';
const DISPLAY_NONE = {
    display: 'none'
}

class SITComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new SIT().run();
        let startButton = document.getElementById('SITContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='SITComponent'>
                <div id='SITContainer'>
                    <img className='tbt-spritesheet' src={spritesheet} />
                </div>
                <button id='SITContainer-Start' onClick={this.onClickStart}>Start {VERSION}</button>
                <audio id='SITAudio_0' style={DISPLAY_NONE} src="https://dl.dropbox.com/s/q04wy2k4p1w2yr7/tires_squal_loop.wav"></audio>
            </div>
        )
    }

}

export default SITComponent;