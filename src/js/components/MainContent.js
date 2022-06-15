import React from 'react';
import NavSection from './banners/NavSection';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Battleship from './games/Battleship/Battleship';
import FantasyComponent from './games/Fantasy/FantasyComponent';
import Resume from './Resume';
import About from './About';

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
                            <Route path='/' element={<About />} />
                            {/* <Route path='/Fantasy' element={<FantasyComponent />} /> */}
                            {/* <Route path='/Battleship' element={<Battleship />} /> */}
                            {/* <Route path='/PunchyKicky' element={<PunchyKickyComponent />} /> */}
                            <Route path='/Resume' element={<Resume />} />
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