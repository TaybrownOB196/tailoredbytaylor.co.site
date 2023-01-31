import React, { useEffect, useState } from 'react';
import GridrowComponent from '../GridrowComponent';
import Utility from '../../../lib/Utility';
import Alphabetpad from '../../../components/input/Alphabetpad';
import { useDispatch } from 'react-redux'
import { update } from '../../../redux/reducers/hangmanSlice';

import '../../../../sass/hangman.scss';

function HangmanComponent(props) {
    const dispatch = useDispatch();
    const ID = Utility.GetRandomInt(1337);
    const [guesses, setGuesses] = useState([]);
    const [isGameOver, setGameOver] = useState(false);
    const [key, setKey] = useState();
    const [word, setWord] = useState(props.getWord());

    useEffect(() => {
        window.addEventListener('keypress', onKeyPress);

        return function unmount() {
            if (!isGameOver) return;
            window.removeEventListener('keypress', onKeyPress);
        }
    });

    const reset = () => {
        let newKey = Utility.GetRandomInt(1337);
        let newWord = props.getWord();

        setWord(newWord);
        setGameOver(false);
        setGuesses([]);
        setKey(newKey);
    }

    function onKeyPress(e) {
        handleInput(e.key.toUpperCase());
    }

    function handleClick(e) {
        handleInput(e.target.innerHTML);
    }

    const handleInput = (input) => {
        if (isGameOver) {
            console.log('GAME OVER');
            return;
        }

        if (word.indexOf(input) == -1 && guesses.indexOf(input) == -1) {
            let _guesses = [input].concat(guesses);
            setGuesses(_guesses);

            let _id = '';
            if (_guesses.length == 1) {
                _id = `head|${ID}`;
            } else if (_guesses.length == 2) {
                _id = `torso|${ID}`;
            } else if (_guesses.length == 3) {
                _id = `left_arm|${ID}`;
            } else if (_guesses.length == 4) {
                _id = `right_arm|${ID}`;
            } else if (_guesses.length == 5) {
                _id = `left_leg|${ID}`;
            } else if (_guesses.length == 6) {
                _id = `right_leg|${ID}`;
            } else if (_guesses.length > 6) {
                dispatch(update({ 
                    winCount: 0, 
                    totalGames: 1
                }));
                setGameOver(true);
                return;
            }

            document.getElementById(_id).style.display = 'block';
        } else {
            let indexes = Utility.GetIndexesOf(word.split(''), (value) => { return value == input});
            for(let idx of indexes) {
                document.getElementById(`${idx}|0|${ID}`).innerHTML = input;
            }
            
            if (Array.from(document.getElementById('word-container').children).every(p => p.innerHTML)) {
                console.log('YOU WIN');
                dispatch(update({ 
                    winCount: 1, 
                    totalGames: 1
                }));
                setGameOver(true);
            }
        }
    }

    return (
        <div id='hangman' className='opaque-bg-container reactgame' key={key} >
            <div className='opaque-bg'></div>
            <div id='view'>
                <div id='gallows'>
                    <div id='hook'></div>
                    <div id='top'></div>
                    <div id='post'></div>
                    <div id='bottom'></div>
                </div>

                <div id='body'>
                    <div id={`head|${ID}`}></div>
                    <div id={`torso|${ID}`}></div>
                    <div id={`left_arm|${ID}`}></div>
                    <div id={`right_arm|${ID}`}></div>
                    <div id={`left_leg|${ID}`}></div>
                    <div id={`right_leg|${ID}`}></div>
                </div>
            </div>

            <div id='guess-container'>
                { Array.apply(0, guesses).map(function (r, ri) {
                    return <div key={ri}>{guesses[ri]}</div>}) 
                }
            </div>

            <div id='word-container'>
                <GridrowComponent
                    ID={ID}
                    rowIndex={0}
                    gridRow={word}
                    count={word.length} />
            </div>
            <Alphabetpad handleClick={handleClick} />
            <button onClick={reset}>Reset</button>
        </div>
    )
    
}

export default HangmanComponent;