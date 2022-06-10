import React from 'react';
import Battleship from './games/Battleship/Battleship';
import FantasyComponent from './games/Fantasy/FantasyComponent';
// import PunchyKickyComponent from './games/PunchyKicky/PunchyKickyComponent';
import { Link, HashRouter as Router, Switch, Route, Routes, Outlet } from "react-router-dom";

function Games() {
    return (
        <div>
            {/* <Battleship /> */}
            {/* <FantasyComponent /> */}
            {/* <PunchyKickyComponent /> */}
            <GamesLayout />
        </div>
    );
}

function GamesLayout() {
    return (
        <React.Fragment>
                <Link to='/games/Battleship' className='circle'><p>Battleship</p></Link>
                {/* <Link to='/games' className='circle'><p>Games</p></Link> */}
                <Link to='/games/Fantasy' className='circle'><p>Fantasy</p></Link>
            <Outlet />
        </React.Fragment>
    );
}

export default Games;