import React, { useState } from 'react';
import { Panel } from 'primereact/panel';
import { Card } from '../models/card';
import CardComponent from './card-component';
import { Button } from 'primereact/button';

interface DeckViewComponentProps {
    currentDeck: Card[];
}

const DeckViewComponent = (props: DeckViewComponentProps) => {
    const [deckViewMaximized, setDeckViewMaximized] = useState<boolean>(false);

    const handleCardOnClick = () => {

    }

    let cmcBuckets:number[] = [];

    props.currentDeck.map((card: Card) => {
        if (card.cmc && !cmcBuckets.includes(card.cmc)){
            cmcBuckets.push(card.cmc);
        }
    });

    cmcBuckets = cmcBuckets.sort((a, b) => a - b)

    const header = 
        <div className="current-deck-view-header">
            <div>Current Deck ({props.currentDeck.length}/100)</div>
        </div>;
    return (
        <div className="current-deck-view-component">
            <Panel toggleable header={header}>
            {
            cmcBuckets.map((cmc: number) => {
                return (
                    <div className="cmc-bucket">
                        <div style={{fontWeight: "bold", marginBottom:"5px"}}>{cmc}</div>
                        <div style={{display: "inline-flex", flexDirection: "column"}}>
                        {props.currentDeck.map(card => {
                            if (card.cmc === cmc) {
                                return (
                                    <div className={"deck-view-card"}>
                                        <CardComponent animateFadeIn={false} card={card} key={card.id} showName={true} onClick={handleCardOnClick} />
                                    </div>
                                )
                            }
                        })}
                        </div>
                    </div>
                    
                )
            })
                
            }
            </Panel>
        </div>
        
    );
}

export default DeckViewComponent;