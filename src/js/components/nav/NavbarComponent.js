import React from 'react';

class NavbarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.links = props.links;
    }

    render() {
        return (
            <nav className='navbar'> {
                this.links.map(function (link, idx) {
                    return <a key={idx} href={link.ref} className={link.class}><p>{link.text}</p></a>
                })
            }
            </nav>
        );
    }
}

export default NavbarComponent;