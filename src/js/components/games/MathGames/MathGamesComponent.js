import React from 'react';
import MathGames from './Index';

class MathGamesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClickStart = this.onClickStart.bind(this);
        this.onClickSetup = this.onClickSetup.bind(this);
        this.state = { game: null };
    }
    
    componentDidMount() {
        this.setState({game: new MathGames() });
    }

    onClickStart() {
        this.state.game.run();
        let startButton = document.getElementById('MathGamesContainer-Start');
        startButton.remove();
    }

    onClickSetup() {
        this.state.game.setup();
    }

    render() {
        return (
            <div id='MathGamesComponent'>
                <div id='MathGamesContainer'></div>
                <button id='MathGamesContainer-Start' onClick={this.onClickStart}>Start</button>
                <button id='MathGamesContainer-Setup' onClick={this.onClickSetup}>Setup</button>
            </div>
        )
    }
}

export default MathGamesComponent;