import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import CardComponent from './components/card-component';
import { Card, CardRequest } from './models/card';
import CacheService from './services/cache-service';

interface loadingStatusProps {
    currentCardsLoaded: number;
    totalCardsToLoad: number;
}

const App: React.FunctionComponent = () => {
    const[commanders, setCommanders] = useState<Card[]>([]);
    const[cardCache, setCardCache] = useState<Card[]>([]);
    const scrollRef = useRef<HTMLInputElement>(null);
    const[loadingStatus, setLoadingStatus] = useState<loadingStatusProps>({currentCardsLoaded: 0, totalCardsToLoad: 0});

    const fetchCommanderCache = async () => {
        let moreCards = false;
        let requestUrl = 'https://api.scryfall.com/cards/search?q=is%3Acommander+f%3Acommander';
        let tempCardCache: Card[] = [];

        do {
            const response = await fetch(requestUrl);
            const responseData = await response.json() as CardRequest;
            moreCards = responseData.has_more;

            if (moreCards) {
                requestUrl = responseData.next_page;
            }

            tempCardCache = tempCardCache.concat(responseData.data);
            setLoadingStatus({currentCardsLoaded: tempCardCache.length, totalCardsToLoad: responseData.total_cards});
        } 
        while (moreCards)

        setCardCache(tempCardCache);
        CacheService.setCacheItem("cardCache", tempCardCache, 86400000);
    }

    const updateRandomCommanders = async () => {
        setCommanders([]);

        if (cardCache.length === 0) {
            return;
        }

        let newCommanders: Card[] = [];

        for (let i = 0; i < 5; i++) {
            let potentialCommanderPick: Card;

            do {
                potentialCommanderPick = cardCache[Math.floor(Math.random() * cardCache.length)];
            } 
            while (newCommanders.includes(potentialCommanderPick))

            newCommanders.push(potentialCommanderPick);
        }

        setCommanders(newCommanders);
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        const cardCache = CacheService.getCacheItem("cardCache");
        if (cardCache) {
            console.log("Cards were cached!");
            setCardCache(cardCache);
        } else {            
            console.log("Cards were not cached.");
            fetchCommanderCache();
        }
    }, []);

    useEffect(() => {
        updateRandomCommanders();
    }, [cardCache])

    return (
    <div>
        <div className="header" ref={scrollRef}>Pick a commander...</div>
        <div className="card-collection">
            {commanders && commanders.length > 0 ? commanders.map(commander => {
                return <CardComponent card={commander} key={commander.id}/>
            }): <h1>Populating cache ({loadingStatus.currentCardsLoaded} / {loadingStatus.totalCardsToLoad})</h1>}
        </div>
        {commanders && commanders.length > 0 ?
        <div className="menu-container fade-in">
            <button type="button" className="btn btn-outline-primary btn-lg menu-button" onClick={updateRandomCommanders}>I don't like these</button>
            <button type="button" className="btn btn-outline-danger btn-lg menu-button">Startover</button>
        </div> : <div/>
        }
    </div>
    
    );
};

export default App;
