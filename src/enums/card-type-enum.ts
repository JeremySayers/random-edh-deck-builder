export default class CardType {
    static readonly AllTypes  = new CardType('AllTypes', 'All types', undefined);
    static readonly Creatures = new CardType('Creatures', 'Creatures', 'creature');
    static readonly Enchantments  = new CardType('Enchantments', 'Enchantments', 'enchantment');
    static readonly Lands  = new CardType('Lands', 'Lands', 'land');
    static readonly Instants = new CardType('Instants', 'Instants', 'instant');
    static readonly Soceries  = new CardType('Soceries', 'Sorceries', 'sorcery');
    static readonly Artifacts  = new CardType('Artifacts', 'Artifacts', 'artifact');
  
    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly label: string, public readonly searchString: string | undefined) { }
  
    toString() {
      return this.key;
    }

    public static AllCardTypes(): CardType[] {
        return [CardType.AllTypes, CardType.Creatures, CardType.Enchantments, CardType.Lands, CardType.Instants, CardType.Soceries, CardType.Artifacts];
    }
  }