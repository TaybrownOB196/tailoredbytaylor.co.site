import React from 'react';
import { Outlet } from 'react-router-dom';

import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function HeaderNavComponent() {
    return (
        <>
            <RouterLinkNavbarComponent links={[
                { ref: 'about', text: 'About', class: '' }, 
                { ref: 'projects', text: 'Projects', class: '' }, 
                { ref: 'resume', text: 'Resume', class: '' }]} />

            <div id='content-container'>
                <Outlet />
            </div>
        </>
    );
}

export default HeaderNavComponent;