import React from 'react';
//NOTE: BrowserRouter seems to only work locally, will not display navs on build
// import { BrowserRouter as Router } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Resume from './routes/Resume';
import Blurbs from './routes/Blurbs';
import CarouselComponent from './carousel/CarouselComponent';
import About from './routes/About';
import Utility from './../lib/Utility';
import HangmanComponent from './games/Hangman/HangmanComponent';
import FourInARowComponent from './games/FourInARow/FourInARowComponent';
import TictactoeComponent from './games/Tictactoe/TictactoeComponent';
import Projects from './routes/Projects';
import ContentComponent from './ContentComponent';
import PunchyKickyComponent from './games/PunchyKicky/PunchyKickyComponent';

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
                        <Route path='resume' element={<Resume />} />
                        <Route path='games' element={<CarouselComponent components={[<TictactoeComponent />, <FourInARowComponent />, <HangmanComponent getWord={this.getWord} />]} />} />
                        <Route path='misc' element={<Projects />} >
                            <Route path='fighter' element={<PunchyKickyComponent />} />

                        </Route>
                    </Route>
                </Routes>
            </Router>
        </div>)
    }
}

export default RoutesComponent;