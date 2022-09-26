import React from 'react';
import { Outlet } from 'react-router-dom';
import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function MainNavComponent() {
    return (
        <div id='mainNav'>
            <RouterLinkNavbarComponent links={[
                { ref: '/', text: 'Home', class: 'circle' }, 
                { ref: '/about', text: 'About', class: 'circle' }, 
                { ref: '/familyolympics', text: 'T.B.D.', class: 'circle' }, 
                { ref: '/games', text: 'Games', class: 'circle' }, 
                { ref: '/resume', text: 'Resume', class: 'circle' }]} />
            
            <Outlet />
        </div>
    );
}

export default MainNavComponent;