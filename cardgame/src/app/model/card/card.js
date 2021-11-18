class Card {
    constructor() {
        this.id;
        this.value;
        this.text;
        this.icon;
        this.suit;
    }

    create(obj) {
        this.setId(obj.id)
        this.setValue(obj.value)
        this.setText(obj.text)
        this.setIcon(obj.icon)
        this.setSuit(obj.suit)
    }
    match(card,mode,par) {
        console.log(card)
        /* switch (mode) {
            case 'value':
                if (par=='eq'&& card.value==this.value) {return true}
                else if (par=='hi'&& card.value>this.value) {return true}
                else if (par=='lo'&& card.value<this.value) {return true}
                else {return false}
                break;
            case 'text':
                if (par=='eq'&& card.text==this.text) {return true}
                else {return false}
                break;
            case 'suit':
                if (par=='eq'&& card.text==this.text) {return true}
                else {return false}
                break;
            default:
                return false
        } */
    }

    getId() { return this.id }
    setId(id) { this.id = id }

    getValue() { return this.value }
    setValue(value) { this.value = value }

    getText() { return this.text }
    setText(text) { this.text = text }

    getIcon() { return this.icon }
    setIcon(icon) { this.icon = icon }

    getSuit() { return this.suit }
    setSuit(suit) { this.suit = suit }
    
}
