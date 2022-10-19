import React from 'react';
import ObjectComponent from './ObjectComponent';

const transitionString = 'max-height .5s ease-out';
const toggleStyle = {
    float: 'right',
    position: 'relative',
    right: '8px',
}

class DropdownObjectComponent extends React.Component {
    constructor(props) {
        super(props);

        this.object = props.object;
        this.header = props.header;
        this.isCollapsible = props.isCollapsible;
        this.state = {
            isCollapsed: !props.isCollapsible,
            listStyle: {
                maxHeight: props.isCollapsible ? '0px' : null,
                transition: transitionString,
            }
        };

        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    render() {
        return (
            <div className='dropdown-object-container'>
                <div className='dropdown-object-header' onClick={this.toggleCollapse}>
                    {this.header}
                    <div style={toggleStyle}>{this.state.isCollapsed ? '-' : '+'}</div>
                </div>
                <div ref='dropdownObjectContent' className='dropdown dropdown-object-content' style={this.state.listStyle}>
                    <ObjectComponent object={this.object} />
                </div>
            </div>
        );
    }

    toggleCollapse() {
        if (this.isCollapsible) {
            this.setState((state, props) => { return {  
                isCollapsed: !state.isCollapsed, 
                listStyle: 
                    { 
                        maxHeight: state.isCollapsed ? '0px' : `${this.refs.dropdownObjectContent.scrollHeight}px`,
                        transition: transitionString,
                    }
                }
            });
        }
    }
}

export default DropdownObjectComponent;