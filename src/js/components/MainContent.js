import React from 'react';
import MainNavComponent from './MainNavComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Battleship from './games/Battleship/Battleship';
import FantasyComponent from './games/Fantasy/FantasyComponent';
import BasketballComponent from './games/Basketball/BasketballComponent';
import OlympianComponent from './games/Olympian/OlympianComponent';
import PunchyKickyComponent from './games/PunchyKicky/PunchyKickyComponent';
import GuessTheWordComponent from './games/GuessTheWord/GuessTheWordComponent';
import MathGamesComponent from './games/MathGames/MathGamesComponent';
import MLCComponent from './games/MLC/MLCComponent';
import Resume from './routes/Resume';
import Home from './routes/Home';
import About from './routes/About';
import FamilyOlympics from './routes/FamilyOlympics';
import GamesNav from './GamesNav';

class MainContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='grid-main detroit-skyline-bg'>
                <Router id='router'>
                    <Routes id='routes'>
                        <Route id='mainNav' path='/' element={<MainNavComponent />}>
                            <Route path='/' element={<Home />} />
                            <Route path='/about' element={<About />} />
                            <Route path='/familyolympics' element={<FamilyOlympics />} />
                            <Route path='/games' element={<GamesNav />}>
                                <Route path='fantasy' element={<FantasyComponent />} />
                                <Route path='guesstheword' element={<GuessTheWordComponent word='pizza' />} />
                                <Route path='mathgames' element={<MathGamesComponent />} />
                                <Route path='olympian' element={<OlympianComponent />} />
                                <Route path='basketball' element={<BasketballComponent />} />
                                <Route path='battleship' element={<Battleship />} />
                                <Route path='punchykicky' element={<PunchyKickyComponent />} />
                                <Route path='mlc' element={<MLCComponent />} />
                            </Route>
                            <Route path='/resume' element={<Resume />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        );
    }

}

export default MainContent;