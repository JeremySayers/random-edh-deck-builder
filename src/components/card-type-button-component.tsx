import { Menubar } from 'primereact/menubar';
import React from 'react';
import CardType from '../enums/card-type-enum';
import { Button } from 'primereact/button';

interface CardTypeButtonComponentProps {
    currentlySelectedCardType: CardType;
    cardType: CardType;
    onClick: any;
}

const CardTypeButtonComponent = (props: CardTypeButtonComponentProps) => {
    return (        
        <Button 
            label={props.cardType.label} 
            className={props.currentlySelectedCardType === props.cardType ? "" : "p-button-outlined"} 
            onClick={() => props.onClick(props.cardType)}
        />
    );
}

export default CardTypeButtonComponent;