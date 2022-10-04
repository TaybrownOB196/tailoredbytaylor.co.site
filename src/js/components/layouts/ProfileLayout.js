import React from 'react';
//NOTE: BrowserRouter seems to only work locally, will not display navs on build
// import { BrowserRouter as Router } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Resume from '../routes/Resume';
import About from '../routes/About';
import Utility from '../../lib/Utility';
import HangmanComponent from '../games/Hangman/HangmanComponent';
import TictactoeComponent from '../games/Tictactoe/TictactoeComponent';
import Projects from '../routes/Projects';
import HeaderNavComponent from '../HeaderNavComponent';

import profile_img from './../../../jpg/20220716_113150.jpg'
import SocialMediaTrayComponent from './../banners/SocialMediaTrayComponent';

import  '../../../sass/profilelayout.scss'

class ProfileLayout extends React.Component {
    constructor(props) {
        super(props);
        this.getWord = this.getWord.bind(this);
    }

    getWord() {
        let words = ['pizza', 'egg', 'mouth'];
        let word = words[Utility.GetRandomInt(words.length)];
        return word;
    }

    render() {
        return (<>
            <div id='profileLayout'>
                <header id='header-container'>
                    <h2>Taylor Brown</h2>
                    <h4>Software Developer</h4>
                </header>

                <div id='profileImage-container'>
                    <div id='profileImage-wrapper'>
                        <img id='profileImage' src={profile_img}></img>
                    </div>

                    <div id='profileImageBubble'></div>
                </div>
                
                <div id='socialMediaTray-container'>
                    <SocialMediaTrayComponent />
                </div>

                <div id='intro-container'>
                    <p>Hello, World! My name is Taylor Brown and I am a software developer.</p>
                </div>
            
            </div>

            <div id='nav-container'>
                <Router id='router'>
                    <Routes id='routes'>
                        <Route id='home' path='/' element={<HeaderNavComponent />}>
                            <Route path='about' element={<About />} />
                            <Route path='projects' element={<Projects />} >
                                <Route path='tictactoe' element={<TictactoeComponent />} />
                                <Route path='hangman' element={<HangmanComponent getWord={this.getWord} />} />
                            </Route>
                            <Route path='resume' element={<Resume />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
            
        </>)
    }
}

export default ProfileLayout;