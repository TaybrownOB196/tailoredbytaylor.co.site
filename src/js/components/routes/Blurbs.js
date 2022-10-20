import React from 'react';
import BlurbsService from '../../services/BlurbsService';
import DropdownObjectComponent from '../objects/DropdownObjectComponent';

class Blurbs extends React.Component {
    constructor(props) {
        super(props);
        this.service = new BlurbsService();
        this.state = { data: [] };
    }
    
    componentDidMount() {
        this.service.getBlurbs()
            .then((json) => {
                this.setState((state, props) => ({ data: json }));
            }
        );
    }

    componentDidUnmount() {
        
    }

    render() {
        if (this.state.data && this.state.data.length > 0) {
            return <>
                {this.state.data.map((k, ki) =>
                    <div key={ki} className='object-list collapsible-list'>
                        <DropdownObjectComponent
                            header={this.state.data[ki].title}
                            isCollapsible={true}
                            object={this.state.data[ki]} />
                    </div>
                )}
            </>
        } else {
            return <p>loading...</p>
        }
    }
}

export default Blurbs;