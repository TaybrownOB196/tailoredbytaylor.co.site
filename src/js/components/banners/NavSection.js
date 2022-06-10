import React from 'react';
import { Link, Outlet } from "react-router-dom";

class NavSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='navSection'>
                <nav>
                    <Link to='/' className='circle'><p>About</p></Link>
                    <Link to='/fantasy' className='circle'><p>Fantasy</p></Link>
                    <Link to='/battleship' className='circle'><p>Batttleship</p></Link>
                    <Link to='/resume' className='circle'><p>Resume</p></Link>
                </nav>
                
                <Outlet />
            </div>
        );
    }
}

export default NavSection;