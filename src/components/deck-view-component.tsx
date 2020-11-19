import React from 'react';
import { Panel } from 'primereact/panel';
import { Card } from '../models/card';
import CardComponent from './card-component';

interface DeckViewComponentProps {
    currentDeck: Card[];
}

const DeckViewComponent = (props: DeckViewComponentProps) => {
    const handleCardOnClick = () => {

    }

    let cmcBuckets:number[] = [];

    props.currentDeck.map((card: Card) => {
        if (card.cmc && !cmcBuckets.includes(card.cmc)){
            cmcBuckets.push(card.cmc);
        }
    });

    cmcBuckets = cmcBuckets.sort()
    return (
        <div className="current-deck-view-component">
            <Panel header={`Current Deck (${props.currentDeck.length}/100)`}>
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
                                        <CardComponent card={card} key={card.id} showName={true} onClick={handleCardOnClick} />
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