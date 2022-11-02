import React from 'react';
import Sandbox from './Index';

class SandboxComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
    }

    onClickStart() {
        new Sandbox().run();
        let startButton = document.getElementById('SandboxContainer-Start');
        startButton.remove();
    }

    render() {
        return (
            <div id='SandboxComponent'>
                <div id='SandboxContainer'></div>
                <button id='SandboxContainer-Start' onClick={this.onClickStart}>Start</button>
            </div>
        )
    }

}

export default SandboxComponent;