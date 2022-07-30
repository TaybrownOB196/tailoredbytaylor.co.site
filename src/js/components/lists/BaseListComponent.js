import React from 'react';
import ListItemComponent from './ListItemComponent';

const transitionString = 'max-height .5s ease-out';

/* <BaseListComponent isCollapsible={true} header='Rules' items={this.state.data.rules} />
<BaseListComponent isCollapsible={true} header='Events' items={this.state.data.events} valueLambda={(event) => { return event.name }} /> */

class BaseListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.header = props.header;
        this.items = props.items;
        this.valueLambda = props.valueLambda;
        this.isCollapsible = props.isCollapsible;
        this.tooltipValueLambda = props.tooltipValueLambda;
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
                    {this.header}
                    <div style={toggleStyle}>{this.state.isCollapsed ? '-' : '+'}</div>
                </div>
                <ul ref='listContent' style={this.state.listStyle}>
                    { this.items.map((item, i) => { return <ListItemComponent key={i++} tooltipValue={this.tooltipValueLambda ? this.tooltipValueLambda(item) : null} value={ this.valueLambda ? this.valueLambda(item) : item } /> }) }
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

const toggleStyle = {
    float: 'right',
    position: 'relative',
    right: '8px',
}

export default BaseListComponent;