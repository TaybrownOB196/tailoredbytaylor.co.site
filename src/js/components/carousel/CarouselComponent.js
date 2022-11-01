import React from 'react';

class CarouselComponent extends React.Component {
    constructor(props) {
        super(props);
        this.toggleContent = this.toggleContent.bind(this);
        this.state = { components: props.components, componentIndex: 0 };
    }

    render() {
        return (
            <div className='carousel'>
                <div className='carousel-left' onClick={() => this.toggleContent('left')}>{'<'}</div>
                <div className='carousel-content'>{this.state.components[this.state.componentIndex]}</div>
                <div className='carousel-right' onClick={() => this.toggleContent('right')}>{'>'}</div>
            </div>
        );
    }

    toggleContent(direction) {
        if (direction == 'left') {
            if (this.state.componentIndex - 1 < 0)
                this.setState({ components: this.state.components, componentIndex: this.state.components.length - 1});
            else
                this.setState({ components: this.state.components, componentIndex: this.state.componentIndex - 1});
        } else {
            if (this.state.componentIndex + 1 >= this.state.components.length)
                this.setState({ components: this.state.components, componentIndex: 0});
            else
                this.setState({ components: this.state.components, componentIndex: this.state.componentIndex + 1});
        }
    }
}

export default CarouselComponent;