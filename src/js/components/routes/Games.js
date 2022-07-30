import React from 'react';
import Battleship from '../games/Battleship/Battleship';
import BasketballComponent from '../games/Basketball/BasketballComponent';
import FantasyComponent from '../games/Fantasy/FantasyComponent';
import OlympianComponent from '../games/Olympian/OlympianComponent';
// import PunchyKickyComponent from './games/PunchyKicky/PunchyKickyComponent';
import { Link, HashRouter as Router, Switch, Route, Routes, Outlet } from "react-router-dom";

function Games() {
    return (
        <div>
            {/* <Battleship /> */}
            {/* <FantasyComponent /> */}
            {/* <BasketballComponent /> */}
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
                <Link to='/games/Olympian' className='circle'><p>Olympian</p></Link>
                <Link to='/games/Basketball' className='circle'><p>Basketball</p></Link>
            <Outlet />
        </React.Fragment>
    );
}

export default Games;