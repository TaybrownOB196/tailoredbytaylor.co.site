import React, { useState } from 'react';

class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.initValue = props.initValue;
        this.maxValue = props.maxValue;
        this.minValue = props.minValue;
        this.onClick = this.onClick.bind(this);
        this.state = {
            prevValue: this.initValue,
            dotStyle: {
                left: '0px'
            },
            highLineStyle: {
                width: '0px'
            }
        };
    }

    onClick(e) {
        let { left } = e.target.getBoundingClientRect();
        let width = e.target.parentElement.clientWidth;
        let ratio = (e.clientX - left) 
            / width;
        let value = Math.round(ratio * 10);
        let dotWidth = width * ratio;
        if (this.state.value != value && this.props.onChange) {
            this.setState({
                ...this.state,
                dotStyle: { left: `${dotWidth}px` },
                highLineStyle: { width: `${dotWidth}px` },
                prevValue: value
            });
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <span className='slider' onClick={this.onClick}>
                <div id='dot' style={this.state.dotStyle}></div>
                <div id='line'></div>
                <div id='highline' style={this.state.highLineStyle}></div>
            </span>
        );
    }
}

export default Slider;