import React from 'react';
//NOTE: BrowserRouter seems to only work locally, will not display navs on build
// import { BrowserRouter as Router } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Resume from './routes/Resume';
import About from './routes/About';
import Utility from './../lib/Utility';
import HangmanComponent from './games/Hangman/HangmanComponent';
import TictactoeComponent from './games/Tictactoe/TictactoeComponent';
import Alphabetpad from './input/Alphabetpad';
import Numpad from './input/Numpad';
import Projects from './routes/Projects';
import ContentComponent from './ContentComponent';

class RoutesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getWord = this.getWord.bind(this);
    }

    getWord() {
        let words = ['pizza', 'egg', 'mouth'];
        let word = words[Utility.GetRandomInt(words.length)];
        return word.toUpperCase();
    }

    render() {
        return (<div id='nav-container'>
            <Router id='router'>
                <Routes id='routes'>
                    <Route id='home' path='/' element={<ContentComponent />}>
                        <Route path='about' element={<About />} />
                        <Route path='projects' element={<Projects />} >
                            <Route path='tictactoe' element={<TictactoeComponent />} />
                            <Route path='hangman' element={<HangmanComponent getWord={this.getWord} />} />
                            <Route path='alphabetpad' element={<Alphabetpad handleClick={(key) => {console.log(key.target.innerHTML)}} />} />
                            <Route path='numpad' element={<Numpad handleClick={(key) => {console.log(key.target.innerHTML)}} />} />
                        </Route>
                        <Route path='resume' element={<Resume />} />
                    </Route>
                </Routes>
            </Router>
        </div>)
    }
}

export default RoutesComponent;