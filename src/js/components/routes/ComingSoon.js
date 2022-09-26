import React, { useEffect } from 'react';

class ComingSoon extends React.Component {
    constructor(props) {
        super(props);
        // this.timer = null;
        // this.delay = 1000;
    }

    // componentDidMount() {
    //     this.timer = setInterval(() => this.componentDidCatch, this.delay);
    // }

    // componentWillUnmount() {
    //     clearTimeout(this.timer);
    // }
    
    // useEffect(() => {
    //     const timer = setInterval(() => 
    //         console.log('speak'), 3000);
    // }, []);


    render() {
        return (<React.Fragment>
            <p className='comingsoon'>
                {/* {`coming soon${this.value}`} */}
                coming soon...
            </p>
        </React.Fragment>)
    }
}

export default ComingSoon;