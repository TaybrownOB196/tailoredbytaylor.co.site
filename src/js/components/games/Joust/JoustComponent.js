import React from 'react';
import Joust from './Index';
import spritesheet from '../../../../png/joust_00.png';

const VERSION = '0.0.1';
const DISPLAY_NONE = {
    display: 'none'
}

class JoustComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Joust().run();
        let startButton = document.getElementById('JoustContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='JoustComponent'>
                <div id='JoustContainer'>
                    <img className='tbt-spritesheet' src={spritesheet} />
                </div>
                <button id='JoustContainer-Start' onClick={this.onClickStart}>Start {VERSION}</button>
            </div>
        )
    }

}

export default JoustComponent;