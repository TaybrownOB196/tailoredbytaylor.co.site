import React from 'react';
import { JSONService } from '../../services/common';
import BaseListComponent from '../lists/BaseListComponent';

import json from '../../data/family_olympics.json'

class FamilyOlympics extends React.Component {
    constructor(props) {
        super(props);
        this.potentialPlayers = [
            //KINGS
            'DK','DK','DK','JK',
            //JACKS
            'JJ','JJ','JJ','JJ','AJ','AJ',
            //BROWNS (Delbert)
            'DB', 'GB','TB','TB','HB',
            //BROWNS (Eddie)
            'EB', 'MB',
            //BROWNS (Greg)
            'GB', 'AB', 'GB', 'AB', 'AB',
            //PATRICKS
            'JB', 'AP', 'JP',
            //BROWNS (Harold)
            'HB',
            //BROWNS (June)
            'JB', 'CB', 'JB',
            //BROWNS (Charles)
            'CB', 'MB', 'AB',
            //REYNOLDS
            'GR','JR','LR','GR', 'CR',
        
        ];

        this.service = new JSONService(json);
        this.state = { data: {} };
    }

    componentDidMount() {
        this.service.getData()
            .then((res) => res.json())
            .then((json) => {
                this.setState((state, props) => ({ data: json }));
            });
      }

    render() {
        if (this.state.data.rules && this.state.data.events) {
            return <div id='familyOlympics'>
                <div id='ninja' className='cssCanvas'>
                    <div id='head'></div>
                </div>
                <h2>{this.state.data.name}</h2>
                <div id='details'>
                    <div className='bold'>Who:</div>
                    <div>{this.state.data.who}</div>

                    <div className='bold'>What:</div>
                    <div>{this.state.data.what}</div>

                    <div className='bold'>When:</div>
                    <div>{this.state.data.when}</div>

                    <div className='bold'>Where:</div>
                    <div>{this.state.data.where}</div>

                    <div className='bold'>How:</div>
                    <div>{this.state.data.how}</div>

                    <div className='bold'>Why:</div>
                    <div>{this.state.data.why}</div>

                </div>
                <div id='rules' className='bordered-list collapsible-list'>
                    <BaseListComponent isCollapsible={true} header='Rules' items={this.state.data.rules} />

                </div>

                <div id='events' className='bordered-list collapsible-list tooltip-list'>
                    <BaseListComponent tooltipValueLambda={(event) => { let res = ''; event.Games.map((g) => res += `${g}, `); return res;}} isCollapsible={true} header='Events' items={this.state.data.events} valueLambda={(event) => { return event.name }} />

                </div>
                
            </div>
            
        } else {
            return <h6>loading...</h6>
        }
    }
}

export default FamilyOlympics;