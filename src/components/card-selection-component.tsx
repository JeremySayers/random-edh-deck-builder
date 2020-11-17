import { Button } from 'primereact/button';
import React from 'react';
import CardType from '../enums/card-type-enum';
import { Card } from '../models/card';
import CardComponent from './card-component';
import CardTypeButtonComponent from './card-type-button-component';

interface CardComponentProps {
    currentDeck: Card[];
    handleDontLikeTheseClick: any;
    handleCardTypeClick: any;
    handleClick: any;
    currentlyShowingTypes: CardType;
    scrollRef: any;
    cards: Card[];
}

const CardSelectionComponent = (props: CardComponentProps) => {
    return (
        <div>
            <div className = "mtg-card-selection-container">
                {props.currentDeck.length === 0 &&
                    <div className="card-type-selection">
                        <h3>Pick a commander</h3>
                        <div className="card-type-selection-right">
                            <Button label="Randomize" icon="pi pi-refresh" className="p-button-success" onClick={props.handleDontLikeTheseClick}/>
                        </div>
                    </div>
                }
                {props.currentDeck.length > 0 &&
                    <div className="card-type-selection">
                        <div><h3>Currently showing:</h3></div>  
                        <div>
                            {CardType.AllCardTypes().map((cardType: CardType) => {
                                return (
                                    <CardTypeButtonComponent
                                        currentlySelectedCardType={props.currentlyShowingTypes} 
                                        cardType={cardType} 
                                        onClick={props.handleCardTypeClick}
                                        key={cardType.toString()}
                                    />
                                )
                            })}                                        
                        </div>                             
                        <div className="card-type-selection-right">
                            <Button label="Randomize" icon="pi pi-refresh" className="p-button-success" onClick={props.handleDontLikeTheseClick}/>
                        </div>
                    </div>
                }                            
            </div>
            <div ref={props.scrollRef}/>
                <div className="card-collection">
                    {props.cards?.length > 0
                    ?
                        props.cards.map(card => {
                            return (<CardComponent card={card} key={card.id} onClick={props.handleClick} />)
                        })
                    :
                        <div>No more cards of this type for your selected commander :(</div>
                    }
                </div>
        </div>
    );
}

export default CardSelectionComponent;