import React from 'react';
import BlurbsService from '../../services/BlurbsService';
import ListOfObjectComponent from '../lists/ListOfObjectComponent';

class Blurbs extends React.Component {
    constructor(props) {
        super(props);
        this.service = new BlurbsService();
        this.state = { data: [] };
    }
    
    componentDidMount() {
        this.service.getBlurbs()
            .then((res) => res.json())
            .then((json) => {
                this.setState((state, props) => ({ data: json }));
            }
        );
    }

    render() {
        if (this.state.data && this.state.data.length > 0) {
            return <div className='object-list bordered-list collapsible-list'>
                    <ListOfObjectComponent
                        header='Blurbs'
                        isCollapsible={true}
                        objects={this.state.data}
                        objectLambda={(item) => { return item } } 
                    />
                </div>
        } else {
            return <p>loading...</p>
        }
    }
}

export default Blurbs;