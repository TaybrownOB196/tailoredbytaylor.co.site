import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import CarouselComponent from './carousel/CarouselComponent';
import About from './routes/About';
import Utility from './../lib/Utility';
import HangmanComponent from './games/Hangman/HangmanComponent';
import FourInARowComponent from './games/FourInARow/FourInARowComponent';
import TictactoeComponent from './games/Tictactoe/TictactoeComponent';
import ContentComponent from './ContentComponent';
import SITComponent from './games/SIT/SITComponent';

class RoutesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.getWord = this.getWord.bind(this);
    }

    getWord() {
        let words = ['body', 'should', 'could', 'walk', 'right'];
        let word = words[Utility.GetRandomInt(words.length)];
        return word.toUpperCase();
    }

    render() {
        return (<div id='right-container'>
            <Router id='router'>
                <Routes id='routes'>
                    <Route id='home' path='/' element={<ContentComponent />}>
                        <Route index path='/' element={<About />} />
                        <Route path='games' element={
                            <CarouselComponent components={[
                                <TictactoeComponent />, 
                                <FourInARowComponent />, 
                                <HangmanComponent getWord={this.getWord} />,
                                <SITComponent />
                            ]} />} />
                    </Route>
                </Routes>
            </Router>
        </div>)
    }
}

export default RoutesComponent;