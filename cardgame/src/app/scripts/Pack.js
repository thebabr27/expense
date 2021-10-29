class Pack {
    constructor(cards) {
        this.cards = cards;
    }

    pickById(id) {
    }

    pickByName(text,suit) {
        return this.cards.filter(e=>{
            if (e.suit==suit
            && e.text==text) {
                return e
            }
        })[0]
    }

    push() {

    }

    show() {
        console.log(this.cards)
    }

    shuffle() {

    }
}