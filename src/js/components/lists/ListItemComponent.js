import React from 'react';

class ListItemComponent extends React.Component {
    constructor(props) {
        super(props);

        this.value = props.value;
        if (props.tooltipValue) {
            this.tooltipValue = props.tooltipValue;
            this.state = {
                isShown: false
            };

            this.toggleTooltip = this.toggleTooltip.bind(this);
        }
    }

    render() {
        return (
            <li onMouseEnter={() => this.toggleTooltip(true)} onMouseLeave={() => this.toggleTooltip(false)}>
                {this.value}
            </li>
        );
    }

    toggleTooltip(shouldShow) {
        if (!this.tooltipValue || this.state.isShown === shouldShow) return;
        
        console.log(shouldShow);
        this.setState((state, props) => {
            return { isShown: shouldShow }
        });


    }
}

export default ListItemComponent;