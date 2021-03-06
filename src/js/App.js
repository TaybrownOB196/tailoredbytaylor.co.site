import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import MainContent from './components/pages/MainContent';
import AboutMe from './components/pages/AboutMe';
import Projects from './components/pages/Projects';
import BlurbsService from './services/BlurbsService';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.blurbsService = new BlurbsService();
    }

    async componentDidMount() {
        let blurbs = await this.blurbsService.getBlurbs();
        this.setState({ blurbs: blurbs });
    }

    state = {
        blurbs: [],
    };

    render() {
        return (
        <Router>
            <div className='grid-container'>
                <header style={headerStyle} className='grid-header'>
                    <h3>developer . father . entrepreneur</h3>
                </header>
                <Sidebar />
                <div className='grid-main'>
                    <Route exact path='/' render={props => (
                        <div id='blurbsContainer'>
                            <h3>Recent Posts</h3>
                            <MainContent {...props} blurbs={this.state.blurbs}/>
                        </div>) }/>
                    <Route path='/aboutme' component={AboutMe} />
                    {/* <Route path='/projects' component={Projects} /> */}
                </div>
            </div>
        </Router>
        );
    }
}

const appStyle = {
    
}

const headerStyle = {
    borderRadius: '15px',
    padding: '10px',
}

export default App;