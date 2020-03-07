import React from 'react';
import Bust from '../Bust'
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div style={sidebarStyle} className='grid-sidebar tbt-flex-container'>
            <Bust />
            <div style={navbarStyle} className='tbt-navbar'>
                <Link to='/'>Home</Link>
                <Link to='/aboutme'>About</Link>
                {/* <Link to='/projects'>Projects</Link> */}
            </div>
        </div>
    );
}

const sidebarStyle = {
    borderRadius: '15px 15px 0px 0px',
    padding: '10px',
    alignItems: 'center',
    flexDirection: 'column',
}

const navbarStyle = {
    paddingTop: '15px',
    marginLeft: '-5px',
}

export default Sidebar;