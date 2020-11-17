import React, {useState, useEffect, useRef, useCallback} from 'react';
import './App.css';
import CardComponent from './components/card-component';
import { Card } from './models/card';

interface loadingStatusProps {
    complete: boolean;
}

const App: React.FunctionComponent = () => {
    const[cards, setCards] = useState<Card[]>([]);
    const[cardCache, setCardCache] = useState<Card[]>([]);
    const[currentDeck, setCurrentDeck] = useState<Card[]>([]);

    const scrollRef = useRef<HTMLInputElement>(null);
    const[loadingStatus, setLoadingStatus] = useState<loadingStatusProps>({complete: false});

    const handleClick = (card: Card) => {
        setCurrentDeck([...currentDeck, card]);
    };

    const handleDontLikeTheseClick = () => {
        const commanderOnly = currentDeck.length === 0;
        updateRandomCards(commanderOnly);
    };

    const updateRandomCards = useCallback((commanderOnly: boolean) => {
        setCards([]);

        if (cardCache.length === 0) {
            return;
        }

        let cards = commanderOnly ? cardCache.filter((card: Card) => {return card.canBeCommander}) : cardCache;

        if (!commanderOnly && currentDeck.length > 0) {
            cards = cards.filter((card) => {
                if (card.color_identity.length === 0) {
                    return true;
                }

                return card.color_identity.every((color) => currentDeck[0].color_identity.includes(color))
            });
        }

        let newCards: Card[] = [];

        for (let i = 0; i < 5; i++) {
            let potentialCardPick: Card;

            do {
                potentialCardPick = cards[Math.floor(Math.random() * cards.length)];
            } 
            while (newCards.includes(potentialCardPick) || currentDeck.includes(potentialCardPick))

            newCards.push(potentialCardPick);
        }

        setCards(newCards);
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [cardCache, currentDeck]);

    useEffect(() => {
        const fetchCardCache = async () => {
            const response = await fetch('/edh/database/limitedDb.json');
            const responseData = await response.json() as Card[];
    
            setCardCache(responseData);
    
            setLoadingStatus({complete: true});
        }

        fetchCardCache();
    }, []);

    useEffect(() => {
        if (loadingStatus.complete) {
            updateRandomCards(true);
        }
    }, [loadingStatus, updateRandomCards])

    useEffect(() => {
        updateRandomCards(false);
    }, [updateRandomCards]);

    return (
    <div>
        {currentDeck.length < 65 ?
            <div>
                <div className="header" ref={scrollRef}>{currentDeck.length === 0 ? "Pick a commander" : `Pick a card (${currentDeck.length+1}/65)`}</div>
                <div className="card-collection">
                    {cards && cards.length > 0 ? cards.map(card => {
                        return <CardComponent card={card} key={card.id} onClick={() => handleClick(card)} />
                    }): <h1>Loading...</h1>}
                </div>
                {cards && cards.length > 0 ?
                    <div className="menu-container fade-in">
                        <button type="button" className="btn btn-outline-primary btn-lg menu-button" onClick={handleDontLikeTheseClick}>I don't like these</button>
                        <button type="button" className="btn btn-outline-danger btn-lg menu-button">Startover</button>
                    </div> : <div/>
                }            
            </div>
        : 
            <div>
                {currentDeck.map((card) => {return <div key={card.id}>{card.name}</div>})}
            </div>
        }
    </div>
    
    );
};

export default App;
