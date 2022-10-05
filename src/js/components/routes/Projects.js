import React from 'react';
import { Link, Outlet } from "react-router-dom";
import RouterLinkNavbarComponent from '../nav/RouterLinkNavbarComponent';
import TictactoeComponent from '../games/TicTacToe/TictactoeComponent';
import HangmanComponent from '../games/Hangman/HangmanComponent';
import Utility from '../../lib/Utility';

class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.links = [
            { ref: 'tictactoe', text: 'TicTacToe' },
            { ref: 'hangman', text: 'Hangman' }
        ];
        this.getWord = this.getWord.bind(this);
    }


    getWord() {
        let words = ['pizza', 'egg', 'mouth'];
        let word = words[Utility.GetRandomInt(words.length)];
        return word;
    }

    render() {
        return (<div id='projects-container'>
            <nav> 
            {
                this.links.map(function (link, idx) {
                    return <Link key={idx} to={link.ref}><p>{link.text}</p></Link>
                })
            }
            </nav>
            
            <Outlet />
        </div>)
    }
}

export default Projects;