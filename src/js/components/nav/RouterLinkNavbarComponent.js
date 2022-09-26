import React from 'react';
import { Link } from "react-router-dom";

class RouterLinkNavbarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.links = props.links;
    }

    render() {
        return (
            <nav className='navbar'> {
                this.links.map(function (link, idx) {
                    return <Link key={idx} to={link.ref} className={link.class}><p>{link.text}</p></Link>
                })
            }
            </nav>
        );
    }
}

export default RouterLinkNavbarComponent;