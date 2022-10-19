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

        this.header = props.header;
        this.object = props.object;
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
            <div className='list-container'>
                <div id='list-header' onClick={this.toggleCollapse}>
                    {this.object.title}
                    <div style={toggleStyle}>{this.state.isCollapsed ? '-' : '+'}</div>
                </div>
                <ul ref='listContent' style={this.state.listStyle}>
                    <ObjectComponent object={this.object} />
                </ul>
            </div>
        );
    }

    toggleCollapse() {
        if (this.isCollapsible) {
            this.setState((state, props) => { return {  
                isCollapsed: !state.isCollapsed, 
                listStyle: 
                    { 
                        maxHeight: state.isCollapsed ? '0px' : `${this.refs.listContent.scrollHeight}px`,
                        transition: transitionString,
                    }
                }
            });
        }
    }
}

export default DropdownObjectComponent;