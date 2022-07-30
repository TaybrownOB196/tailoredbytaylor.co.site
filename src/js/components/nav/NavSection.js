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
                    <Link to='/' className='circle'><p>Home</p></Link>
                    <Link to='/about' className='circle'><p>About</p></Link>
                    <Link to='/familyolympics' className='circle'><p>T.B.D.</p></Link>
                    {/* <Link to='/fantasy' className='circle'><p>Fantasy</p></Link> */}
                    {/* <Link to='/olympian' className='circle'><p>Olympian</p></Link> */}
                    {/* <Link to='/basketball' className='circle'><p>Basketball</p></Link> */}
                    {/* <Link to='/punchykicky' className='circle'><p>PunchyKicky</p></Link> */}
                    {/* <Link to='/battleship' className='circle'><p>Batttleship</p></Link> */}
                    <Link to='/resume' className='circle'><p>Resume</p></Link>
                </nav>
                
                <Outlet />
            </div>
        );
    }
}

export default NavSection;