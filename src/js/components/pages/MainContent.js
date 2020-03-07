import React from 'react';
import Blurb from '../Blurb';

class MainContent extends React.Component {
    render() {
        return this.props.blurbs.map((blurb) => (
            <Blurb key={blurb.id} blurb={blurb} />
        ));
    }
}

export default MainContent;