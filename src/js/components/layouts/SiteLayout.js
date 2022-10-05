import React from 'react';

import ProfileComponent from '../ProfileComponent';
import RoutesComponent from '../RoutesComponent';

import  '../../../sass/profilelayout.scss'

class SiteLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<>
            <ProfileComponent />
            <RoutesComponent />
        </>)
    }
}

export default SiteLayout;