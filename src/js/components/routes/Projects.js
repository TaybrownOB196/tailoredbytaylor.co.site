import React from 'react';
import { Link, Outlet } from "react-router-dom";
import Utility from '../../lib/Utility';

class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.links = [
            { ref: 'fighter', text: 'Fighter' }
            
        ];
    }

    render() {
        return (<div id='projects-container'>
            <nav> 
            {
                this.links.map(function (link, idx) {
                    return <Link key={idx} to={link.ref}><p>{link.text}</p></Link>
                })
            }
            </nav>
            
            <Outlet />
        </div>)
    }
}

export default Projects;