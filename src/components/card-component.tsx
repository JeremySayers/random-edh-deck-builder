import React from 'react';
import { Card } from '../models/card';
import '../App.css';

interface CardProps {
    card: Card;
    onClick: any;
    showName: boolean;
    animateFadeIn: boolean;
}

const CardComponent = (props : CardProps) => {
    return (
        <div 
            className={props.animateFadeIn ? "mtg-card fade-in" : "mtg-card-no-fade"}
            onClick={() => props.onClick(props.card)}>
            {props.card.image ? <img src={props.card.image} alt={props.card.name}width={244} height={340}/> : <div>No image for this card :(</div>}
            {props.showName && <div className="card-name">{props.card.name}</div>}
        </div>        
    );
}

export default CardComponent;