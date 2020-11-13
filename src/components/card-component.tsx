import React from 'react';
import { Card } from '../models/card';
import '../App.css';

interface CardProps {
    card: Card;
}

const CardComponent= (props : CardProps) => {
    return (
        <div className="mtg-card fade-in">
            {props.card.image_uris?.normal ? <img src={props.card.image_uris.normal} alt={props.card.name}width={288} height={408}/> : <div>No image for this card :(</div>}
            <h5>{props.card.name}</h5>
        </div>        
    );
}

export default CardComponent;