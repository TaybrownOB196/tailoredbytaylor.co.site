import React from 'react';
import { makeCancelable } from '../../services/common';
import BlurbsService from '../../services/BlurbsService';
import DropdownObjectComponent from '../objects/DropdownObjectComponent';

class Blurbs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };

        this.service = new BlurbsService();
        this.servicePromise = makeCancelable(
            this.service.getBlurbs()
            //Should there be a promise resolution here to not setstate if the component has been unmounted?
                .then((json) => {
                    this.setState((state, props) => ({ data: json }));
                })
        );
    }

    componentDidMount() {
        this.servicePromise.promise
            .catch((reason) => console.log('isCanceled', reason.isCanceled))
    }

    componentWillUnmount() {
        this.servicePromise.cancel();
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