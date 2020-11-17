import React from 'react';
import { Card } from '../models/card';
import '../App.css';

interface CardProps {
    card: Card;
    onClick: any
}

const CardComponent= (props : CardProps) => {
    return (
        <div className="mtg-card fade-in" onClick={() => props.onClick()}>
            {props.card.image ? <img src={props.card.image} alt={props.card.name}width={288} height={408}/> : <div>No image for this card :(</div>}
            <h5>{props.card.name}</h5>
        </div>        
    );
}

export default CardComponent;