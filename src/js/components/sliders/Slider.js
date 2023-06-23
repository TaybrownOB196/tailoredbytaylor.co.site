import React, { useState } from 'react';

export default function Slider({...props}) {
    const minValue = props.minValue;
    const maxValue = props.maxValue;
    const dotStyle = { left: `0px` };
    const highLineStyle = { width: `0px` };
    const [prevValue, setPrevValue] = useState(props.initValue);

    function handleOnClick(e) {
        console.log(e);
        let { left } = e.target.getBoundingClientRect();
        let width = e.target.parentElement.clientWidth;
        let ratio = (e.clientX - left) 
            / width;
        let value = Math.round(ratio * maxValue);
        let dotWidth = width * ratio;
        if (prevValue != value && props.onChange) {
            // this.setState({
            //     ...this.state,
            //     dotStyle: { left: `${dotWidth}px` },
            //     highLineStyle: { width: `${dotWidth}px` },
            //     prevValue: value
            // });
            dotStyle = { left: `${dotWidth}px` };
            highLineStyle = { width: `${dotWidth}px` };
            setPrevValue(value);
            props.onChange(value);
        }
    }
    
    return (
        <span className='slider' onClick={(ev) => handleOnClick(ev)}>
            <div id='dot' style={dotStyle}></div>
            <div id='line'></div>
            <div id='highline' style={highLineStyle}></div>
        </span>
    );
}