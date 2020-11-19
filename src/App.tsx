import React, {useState, useEffect, useRef, useCallback} from 'react';
import './App.css';
import MenuComponent from './components/menu-component';
import { Card } from './models/card';
import CardType from './enums/card-type-enum';
import CardSelectionComponent from './components/card-selection-component';
import { ProgressSpinner } from 'primereact/progressspinner';
import ConfirmationDialogComponent from './components/confirmation-dialog-component';
import ExportService from './services/export-service';
import { InputText } from 'primereact/inputtext';

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
    const[currentlyShowingTypes, setCurrentlyShowingTypes] = useState<CardType>(CardType.AllTypes);
    const[currentDeck, setCurrentDeck] = useState<Card[]>([]);
    const[loadingStatus, setLoadingStatus] = useState<loadingStatusProps>({complete: false});
    const[showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
    const[searchString, setSearchString] = useState<string>("");

    const scrollRef = useRef<HTMLInputElement>(null);

    /**
     * Updates the state of the current deck when a new card is clicked.
     * @param card - The card that is selected.
     */
    const handleClick = (card: Card) => {
        setCurrentDeck([...currentDeck, card]);
    };

    /**
     * Generates a new 5 cards to choose from when the "I don't like these"
     * button is clicked.
     */
    const handleDontLikeTheseClick = () => {        
        updateRandomCards();
    };

    const handleCardTypeClick = (cardType: CardType) => {
        setCurrentlyShowingTypes(cardType);
    };

    const handleMenuNewClick = () => {
        setShowConfirmationDialog(true);
    }

    const handleConfirmationDialogOnClick = (confirm: boolean) => {
        setShowConfirmationDialog(false);        
        if (confirm) {
            setCurrentDeck([]);
            setSearchString("");
            setCurrentlyShowingTypes(CardType.AllTypes);
        }
    }

    const handleMenuExportAsTxtClick = () => {
        ExportService.exportAsTxtFile(currentDeck);
    }

    const handleMenuExportAsJsonClick = () => {
        ExportService.exportAsJsonFile(currentDeck);
    }

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

            if (currentlyShowingTypes.searchString !== undefined) {
                cards = cards.filter((card) => {
                    return card.type_line.toLowerCase().includes(currentlyShowingTypes.searchString!);
                });
            }
        }

        // if we have a search string, let's parse it and filter based on it
        if (searchString && searchString.trim() !== "") {
            let terms = searchString.toLowerCase().split(" ");

            let usedTerms: string[] = [];
            
            terms.map((term: string, index: number) => {
                if (['red', 'blue', 'black', 'white', 'green'].includes(term)) {
                    let colorCode = term[0].toUpperCase();

                    if (term.toLowerCase() == 'blue'){
                        colorCode = 'U';
                    }
                    
                    usedTerms.push(term);
                    cards = cards.filter((card) => {
                        return card.colors?.includes(colorCode) && card.colors?.length === 1;
                    });
                }

                if (['instant', 'artifact', 'enchantment', 'creature', 'sorcery', 'land', 'planeswalker'].includes(term)) {
                    usedTerms.push(term);
                    cards = cards.filter((card) => {
                        return card.type_line.toLowerCase().includes(term.toLowerCase());
                    });
                }
            });

            // remove the used terms
            usedTerms.map((term: string) =>{
                const index = terms.indexOf(term);
                if (index !== -1) {
                    terms.splice(index);
                }
            });

            if (terms.length > 0) {
                let newSearchString = terms.join(" ");

                cards = cards.filter((card) => {
                    return card.name.toLowerCase().includes(newSearchString.toLowerCase());
                });
            }
        }

        if (cards?.length < 1) {
            return;
        }

        let newCards: Card[] = [];
        
        // filter out any cards already in the deck
        cards = cards.filter((card) =>{
            return !currentDeck.includes(card);
        });

        if (cards.length < 6) {
            cards.map((card) => {
                newCards.push(card);
            })
        } else {
            for (let i = 0; i < 6; i++) {
                let potentialCardPick: Card;
    
                do {
                    potentialCardPick = cards[Math.floor(Math.random() * cards.length)];
                } 
                while (newCards.includes(potentialCardPick) || currentDeck.includes(potentialCardPick))
    
                newCards.push(potentialCardPick);
            }
        }        

        setCards(newCards);
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [cardCache, currentDeck, currentlyShowingTypes, searchString]);

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
            <MenuComponent 
                handleNewClick={handleMenuNewClick} 
                currentDeckCount={currentDeck.length}
                handleExportAsTxtClick={handleMenuExportAsTxtClick}
                handleMenuExportAsJsonClick={handleMenuExportAsJsonClick}
            />
            {cardCache?.length > 0
            ?
                <div>
                        <div  className="searchContainer">
                            <div className="p-input-icon-left search-box">
                                <i className="pi pi-search"/>
                                <InputText className="search-input-box" value={searchString} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)} placeholder="Search" />
                            </div>
                        </div>
                    <CardSelectionComponent
                        currentDeck={currentDeck} 
                        handleDontLikeTheseClick={handleDontLikeTheseClick} 
                        handleCardTypeClick={handleCardTypeClick} 
                        handleClick={handleClick}
                        currentlyShowingTypes={currentlyShowingTypes}
                        scrollRef={scrollRef}
                        cards={cards}
                    />
                    <ConfirmationDialogComponent
                        show={showConfirmationDialog}
                        handleOnClick={handleConfirmationDialogOnClick}
                    />
                </div>
            :
                <ProgressSpinner/>
            }
        </div>
    );
};

export default App;
