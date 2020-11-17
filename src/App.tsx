import React, {useState, useEffect, useRef, useCallback} from 'react';
import './App.css';
import CardComponent from './components/card-component';
import { Card } from './models/card';

/**
 * Interface used for the current state of loading.
 */
interface loadingStatusProps {
    complete: boolean;
}

/**
 * The main app.
 */
const App: React.FunctionComponent = () => {
    // Setup all of the useState hooks.
    const[cards, setCards] = useState<Card[]>([]);
    const[cardCache, setCardCache] = useState<Card[]>([]);
    const[currentDeck, setCurrentDeck] = useState<Card[]>([]);
    const[loadingStatus, setLoadingStatus] = useState<loadingStatusProps>({complete: false});   

    const scrollRef = useRef<HTMLInputElement>(null);

    /**
     * Updates the state of the current deck when a new card is clicked.
     * @param card - The card that is selected.
     */
    const handleClick = async (card: Card) => {
        setCurrentDeck([...currentDeck, card]);
    };

    /**
     * Generates a new 5 cards to choose from when the "I don't like these"
     * button is clicked.
     */
    const handleDontLikeTheseClick = () => {        
        updateRandomCards();
    };

    /**
     * Creates a new callback to update the set of random cards to choose from.
     * Dependant on the cardCache and currentDeck state.
     */
    const updateRandomCards = useCallback(() => {
        const commanderOnly = currentDeck.length === 0;
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

    /**
     * Called on initial load, fetches the card database from the server.
     */
    useEffect(() => {
        const fetchCardCache = async () => {
            const response = await fetch('/edh/database/limitedDb.json');
            const responseData = await response.json() as Card[];
    
            setCardCache(responseData);
    
            setLoadingStatus({complete: true});
        }

        fetchCardCache();
    }, []);

    /**
     * Updates the random cards displayed whenever loading is complete
     * or when the updateRandomCard's dependencies are updated.
     */
    useEffect(() => {
        if (loadingStatus.complete) {
            updateRandomCards();
        }
    }, [loadingStatus, updateRandomCards]);

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
