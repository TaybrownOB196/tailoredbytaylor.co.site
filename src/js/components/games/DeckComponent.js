import React from 'react';
import Utility from '../../lib/Utility';

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    toHtml() {
        return (
            <div className={`card ${this.suit}`}>
                <span className={this.value.length > 1 ? '' : 'adjustment'}>{this.value}</span>
                <span className={this.value.length > 1 ? '' : 'adjustment'}>{this.value}</span>
            </div>);
    }
}

class DeckComponent extends React.Component {
    constructor(props) {
        super(props);

        this.cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.cardSuits = ['diamonds', 'spades', 'hearts', 'clubs'];
        this.state = {
            cards: []
        };

        for(let suit of this.cardSuits) {
            for (let value of this.cardValues) {
                this.state.cards.push(new Card(suit, value));
            }
        }
        
        this.draw = this.draw.bind(this);
        this.shuffle = this.shuffle.bind(this);
    }
    
    componentDidMount() {
        this.shuffle();
    }

    draw(count) {
        let toReturn = [];
        for(let idx=0; idx<count; idx++) {
            toReturn.push(this.state.cards.shift());
        }

        this.setState({cards: this.state.cards});
        return toReturn;
    }

    shuffle() {
        this.setState({cards: Utility.shuffle(this.state.cards)});
    }

    render() {
        return (<div>
            <div id='deck-container'>
                <div id='deckback' className='card'>Count: {this.state.cards.length}</div>
            </div>
            <CardHandComponent cards={[]} draw={(count) => this.draw(count)} shuffle={this.shuffle} />
        </div>
        );
    }
}

class CardHandComponent extends React.Component {
    constructor(props) {
        super(props);
        this.cards = props.cards;
        this.shuffle = props.shuffle.bind(this);
        this.draw = this.draw.bind(this);

        this.state = { cards: props.cards };
    }

    draw() {
        let cards = this.props.draw(1);
        this.setState({cards: this.state.cards.concat(cards)});
    }

    render() {
        return (
            <div>
                <div id='cardhand-container'>
                    {this.state.cards.map(function (card, idx) {
                        return <span key={idx}>{card.toHtml()}</span>
                    })}
                </div>
                <div id='actions-container'>
                    <button onClick={this.draw}>Draw</button>
                    <button onClick={this.shuffle}>Shuffle</button>
                </div>
            </div>
        );
    }
}

export default DeckComponent;