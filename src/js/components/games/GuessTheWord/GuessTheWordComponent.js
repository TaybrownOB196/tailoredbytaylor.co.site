import React from 'react';
import GTW from './Index';

class GuessTheWordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
        this.onClickSetup = this.onClickSetup.bind(this);
        this.state = { game: null };
    }
    
    componentDidMount() {
        this.setState({game: new GTW() });
    }

    onClickStart() {
        this.state.game.run();
        let startButton = document.getElementById('GTWContainer-Start');
        startButton.remove();
    }

    onClickSetup() {
        this.state.game.setupWord();
    }

    render() {
        return (
            <div id='GTWComponent'>
                <div id='GTWContainer'></div>
                <button id='GTWContainer-Start' onClick={this.onClickStart}>Start</button>
                <button id='GTWContainer-Setup' onClick={this.onClickSetup}>Setup</button>
            </div>
        )
    }
}

export default GuessTheWordComponent;