# random-edh-deck-builder
App that guides you through making a semi random EDH deck for magic the gathering

Available at https://jsayers.dev/edh

Utilizes Scryfalls API to initially load in all legal commanders. It then caches the database of commanders in localStorage and creates a state object as well. Then as of right now it just shows you 5 randomly and you have the ability to regenerate the picks.

When the cards are cached in local storage, they are also given an expiry of 24 hours, so that if new ones come out it won't be stale. Upon starting the app a second time, local storage is checked for any card cache, and if it exists and it's not expired, then it loads that and doesn't need to hammer Scryfall.
