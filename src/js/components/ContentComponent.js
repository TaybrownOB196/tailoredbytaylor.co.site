import React from 'react';
import { Outlet } from 'react-router-dom';

import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function ContentComponent() {
    return (
        <>
            <RouterLinkNavbarComponent links={[
                { ref: 'about', text: 'About', class: '' }
                ,{ ref: 'resume', text: 'Resume', class: '' }
                ,{ ref: 'games', text: 'Games', class: '' }
                ,{ ref: 'misc', text: 'Misc.', class: '' }
            ]}/>

            <div id='content-container'>
                <Outlet />
            </div>
        </>
    );
}

export default ContentComponent;