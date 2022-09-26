import React from 'react';
import Layout from './components/layouts/Layout';
import ProfileLayout from './components/layouts/ProfileLayout';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ProfileLayout />
        );
    }
}



export default App;