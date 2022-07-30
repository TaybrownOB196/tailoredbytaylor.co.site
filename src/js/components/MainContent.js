import React from 'react';
import NavSection from './nav/NavSection';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Battleship from './games/Battleship/Battleship';
import FantasyComponent from './games/Fantasy/FantasyComponent';
import BasketballComponent from './games/Basketball/BasketballComponent';
import OlympianComponent from './games/Olympian/OlympianComponent';
import PunchyKickyComponent from './games/PunchyKicky/PunchyKickyComponent';
import Resume from './routes/Resume';
import Home from './routes/Home';
import About from './routes/About';
import FamilyOlympics from './routes/FamilyOlympics';

class MainContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='grid-main detroit-skyline-bg'>
                {/* <canvas style={canvasStyle}></canvas> */}
                <Router>
                    <Routes>
                        <Route path='/' element={<NavSection />}>
                            <Route path='/' element={<Home />} />
                            <Route path='/about' element={<About />} />
                            <Route path='/familyolympics' element={<FamilyOlympics />} />
                            {/* <Route path='/fantasy' element={<FantasyComponent />} /> */}
                            {/* <Route path='/olympian' element={<OlympianComponent />} /> */}
                            {/* <Route path='/basketball' element={<BasketballComponent />} /> */}
                            {/* <Route path='/Battleship' element={<Battleship />} /> */}
                            {/* <Route path='/PunchyKicky' element={<PunchyKickyComponent />} /> */}
                            <Route path='/resume' element={<Resume />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        );
    }

}

const canvasStyle = {
    opacity: '0.5',
    position: 'absolute',
    background: 'red',
    width: '100%',
    height: '100%',
}

export default MainContent;