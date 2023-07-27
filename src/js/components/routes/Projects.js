import React from 'react';
import { Link, Outlet } from "react-router-dom";

class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.links = [
            // { ref: 'sandbox', text: 'Sandbox' }
            { ref: 'sit', text: 'S.I.T.' }
            ,{ ref: 'joust', text: 'Joust' }
            // ,{ ref: 'deck', text: 'Deck(WIP)' }
            // ,{ ref: 'userform', text: 'UserForm' }
            // ,{ ref: 'loginform', text: 'LoginForm' }
            // ,{ ref: 'worksheet', text: 'Worksheet' }
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