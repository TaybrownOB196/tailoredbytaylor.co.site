import React from 'react';
import { Outlet } from "react-router-dom";
import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function GamesNav() {
    return (
        <div id='gamesNav'>
            <RouterLinkNavbarComponent links={[
                { ref: 'guesstheword', text: 'GTW', class: '' }, 
                { ref: 'mathgames', text: 'Math Games', class: '' }, 
                // { ref: 'fantasy', text: 'Fantasy', class: '' }, 
                // { ref: 'olympian', text: 'Olympian', class: '' }, 
                // { ref: 'battleship', text: 'Battleship', class: '' }, 
                // { ref: 'basketball', text: 'BBall', class: '' }, 
                { ref: 'mlc', text: 'MLC', class: '' }]} />
            
            <Outlet />
        </div>
    );
}

export default GamesNav;