import React from 'react';

class SocialMediaButtonComponent extends React.Component {
    constructor(props) {
        super(props);

        this.redirectTo = this.redirectTo.bind(this);
    }

    render() {
        return (
            <input type='image' className='square socailMediaButton' src={this.props.imageSrc} onClick={this.redirectTo} />
        );
    }

    redirectTo() {
        window.open(this.props.redirectUrl, '_blank');
    }
}

export default SocialMediaButtonComponent;