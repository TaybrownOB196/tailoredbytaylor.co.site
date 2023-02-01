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
import MatchingGameComponent from './games/MatchingGame/MatchingGameComponent';
import FourInARowComponent from './games/FourInARow/FourInARowComponent';
import TictactoeComponent from './games/Tictactoe/TictactoeComponent';
import Projects from './routes/Projects';
import ContentComponent from './ContentComponent';
import SandboxComponent from './games/Sandbox/SandboxComponent';
import RoninComponent from './games/Ronin/RoninComponent';
import DeckComponent from './games/DeckComponent';
import UserInfoComponent from './forms/UserInfoComponent';
import UserLoginComponent from './forms/UserLoginComponent';

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
                        <Route index path='/' element={<About />} />
                        <Route path='resume' element={<Resume />} />
                        <Route path='games' element={
                            <CarouselComponent components={[
                                <MatchingGameComponent colCount={6} rowCount={6} />, 
                                <TictactoeComponent />, 
                                <FourInARowComponent />, 
                                <HangmanComponent getWord={this.getWord} />
                            ]} />} />
                        <Route path='misc' element={<Projects />} >
                            <Route path='userform' element={<UserInfoComponent id='userInfoForm' formID='userInfoForm' submitUrl='https://jsonplaceholder.typicode.com/posts' />} />
                            <Route path='loginform' element={<UserLoginComponent id='loginForm' formID='loginForm' submitUrl='https://jsonplaceholder.typicode.com/posts' />} />
                            <Route path='sandbox' element={<SandboxComponent />} />
                            <Route path='ronin' element={<RoninComponent />} />
                            <Route path='deck' element={<DeckComponent />} />

                        </Route>
                    </Route>
                </Routes>
            </Router>
        </div>)
    }
}

export default RoutesComponent;