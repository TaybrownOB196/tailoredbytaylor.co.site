import React from 'react';
import { Outlet } from 'react-router-dom';
import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function ContentComponent() {
    return (
        <>
            <RouterLinkNavbarComponent links={[
                { ref: '', text: 'Profile', class: '' }
            ]}/>

            <div id='content-container'>
                <Outlet />
            </div>
        </>
    );
}

export default ContentComponent;