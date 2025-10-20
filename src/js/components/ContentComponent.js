import React from 'react';
import { Outlet } from 'react-router-dom';
import RouterLinkNavbarComponent from './nav/RouterLinkNavbarComponent';

function ContentComponent() {
    return (
        <>
            <div className='height-offset'>
                <div id='content-container'>
                    <Outlet />
                </div>
            </div>
            
        </>
    );
}

export default ContentComponent;