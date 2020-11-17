import { Card } from "../models/card";

export default class ExportService {
    public static exportAsTxtFile(cards: Card[]){
        let element = document.createElement('a');
        let cardText = "";

        cards.map((card) => {
            return cardText += card.name + "\r\n";
        })

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cardText));
        element.setAttribute('download', 'deck.txt');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

    public static exportAsJsonFile(cards: Card[]){
        let element = document.createElement('a');

        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards)));
        element.setAttribute('download', 'deck.json');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }
}