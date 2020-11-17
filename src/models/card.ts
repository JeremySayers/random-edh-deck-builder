export interface Prices {
    usd?: any;
    usd_foil: string;
    eur?: any;
    eur_foil?: any;
    tix?: any;
}

export interface Card{
    id: string;
    name: string;
    image: string;
    cmc: number;
    type_line: string;
    colors: string[];
    color_identity: string[];
    prices: Prices;
    canBeCommander: boolean;
}