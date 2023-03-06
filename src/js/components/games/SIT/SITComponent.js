import React from 'react';
import SIT from './Index';
import spritesheet from '../../../../png/cars_ss.png';

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
                <button id='SITContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }

}

export default SITComponent;