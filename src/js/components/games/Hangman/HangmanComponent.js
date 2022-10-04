import React from 'react';
import GridrowComponent from '../GridrowComponent';
import Utility from '../../../lib/Utility';

import '../../../../sass/hangman.scss';

class HangmanComponent extends React.Component {
    constructor(props) {
        super(props);
        //TODO: make this number variable based on number of elements under #body
        this.maxGuessCount = 6;
        this.state = { ID: Utility.GetRandomInt(1337), key: Utility.GetRandomInt(1337), isGameOver: false, word: this.props.getWord(), guesses: [], getWord: this.props.getWord };
        this.onKeyPress = this.onKeyPress.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keypress', this.onKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress)
    }

    reset() {
        this.setState({ ID: this.state.ID, key: Utility.GetRandomInt(1337), isGameOver: false, word: this.state.getWord(), guesses: [], getWord: this.state.getWord });
    }

    onKeyPress(e) {
        if (this.state.isGameOver) {
            console.log('GAME OVER');
            return;
        }
        let input = e.key.toUpperCase();
        if (this.state.word.indexOf(input) == -1 && this.state.guesses.indexOf(input) == -1) {
            this.state.guesses.push(input);

            this.setState({ ID: this.state.ID, key: this.state.key, isGameOver: this.state.guesses.length > this.maxGuessCount, word: this.state.word, guesses: this.state.guesses, getWord: this.state.getWord });

            let ID = '';
            if (this.state.guesses.length == 1) {
                ID = `head|${this.state.ID}`;
            } else if (this.state.guesses.length == 2) {
                ID = `torso|${this.state.ID}`;
            } else if (this.state.guesses.length == 3) {
                ID = `left_arm|${this.state.ID}`;
            } else if (this.state.guesses.length == 4) {
                ID = `right_arm|${this.state.ID}`;
            } else if (this.state.guesses.length == 5) {
                ID = `left_leg|${this.state.ID}`;
            } else if (this.state.guesses.length == 6) {
                ID = `right_leg|${this.state.ID}`;
            }

            document.getElementById(ID).style.display = 'block';
        } else {
            // this.state.word
            let indexes = Utility.GetIndexesOf(this.state.word.split(''), (value) => { return value == input});
            for(let idx of indexes) {
                document.getElementById(`${idx}|0|${this.state.ID}`).innerHTML = input;
            }
        }
    }

    render() {
        let self = this;
        return (
            <div id='hangman' key={this.state.key} >
                <div id='view'>
                    <div id='gallows'>
                        <div id='hook'></div>
                        <div id='top'></div>
                        <div id='post'></div>
                        <div id='bottom'></div>
                    </div>

                    <div id='body'>
                        <div id={`head|${this.state.ID}`}></div>
                        <div id={`torso|${this.state.ID}`}></div>
                        <div id={`left_arm|${this.state.ID}`}></div>
                        <div id={`right_arm|${this.state.ID}`}></div>
                        <div id={`left_leg|${this.state.ID}`}></div>
                        <div id={`right_leg|${this.state.ID}`}></div>
                    </div>
                </div>

                <div id='guess-container'>
                    { Array.apply(0, this.state.guesses).map(function (r, ri) {
                        return <div key={ri}>{self.state.guesses[ri]}</div>}) 
                    }
                </div>

                <div id='word-container'>
                    <GridrowComponent
                        ID={this.state.ID}
                        colIndex={0}
                        gridRow={this.state.word}
                        count={this.state.word.length} />
                </div>
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }
}

export default HangmanComponent;