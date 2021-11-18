class Pack {
    constructor() {
        this.id;
        this.cards = [];
    }
    generate() { //create card pack from nothing
        let count=0;
        let types=["red","blue","yellow","green"]
        let cards=[{name:"one",value:1,text:"1"},{name:"two",value:2,text:"2"}
        , {name:"three",value:3,text:"3"},{name:"four",value:4,text:"4"}
        , {name:"five",value:5,text:"5"},{name:"six",value:6,text:"6"}
        , {name:"seven",value:7,text:"7"},{name:"eight",value:8,text:"8"}
        , {name:"nine",value:9,text:"9"},{name:"zero",value:0,text:"0"}
        , {name:"invert",value:-1,text:"invert"},{name:"stop",value:-3,text:"stop"}
        , {name:"plus-two",value:-2,text:"+2"}
        ]
        for (let k=0;k<2; k++) {
            for (let j in types) {
                for (let i in cards) {
                    count++
                    let newCard = new Card()
                    if (types[j]!='yellow') {
                        newCard.create({
                            id: count
                            , icon: `${types[j]}-card ${cards[i].name}-white`
                            , value: cards[i].value
                            , text: cards[i].text
                            , suit: types[j]
                        }); 
                    } else {
                        newCard.create({
                            id: count
                            , icon: `${types[j]}-card ${cards[i].name}-black`
                            , value: cards[i].value
                            , text: cards[i].text
                            , suit: types[j]
                        }); 
                    }
                    this.cards.push(newCard);
                }
            }
            let specialCards=[
                {name:"plus-four",value:-4,text:"+4"}, {name:"plus-four",value:-4,text:"+4"}
                , {name:"change-color",value:-5,text:"color"}, {name:"change-color",value:-5,text:"color"}
            ]
            for (let j in specialCards) {
                count++
                let newCard = new Card()
                    newCard.create({
                        id: count
                        , icon: `black-card ${specialCards[j].name}-white`
                        , value: specialCards[j].value
                        , text: specialCards[j].text
                        , suit: 'black'
                    });  
                this.cards.push(newCard); 
            }
        }
    }

    shuffle() { //shuffle cards
        this.cards.sort(() => Math.random() - 0.5)
        this.cards.sort(() => Math.random() - 0.5)
    }

    generateRandomIdsArr(num) { //create a random array of id
        let arr = [],random;
        for (let i=0;i<num;i++) {
            do {
                random = Math.floor(Math.random() * this.cards.map(e=>e.id).length)
            } while (arr.indexOf(this.cards[random].id)>-1) 
           arr.push(
                this.cards[random].id
            )
        }
        return arr
    }

    selectCardsByIds(arr) { //create a random array of cards
        return this.cards.filter(e=>{
            if (arr.indexOf(e.id)>-1) {     
                return e
            }
        })
    }

    transferCards(num,pack) { //cut and paste cards from this pack to another
        let arr = this.generateRandomIdsArr(num);
        pack.giveCards(this.selectCardsByIds(arr))
        this.removeCards(this.selectCardsByIds(arr))
        /* console.log(this.cards.sort((e,f)=>{
                return e.id-f.id
        }),pack.cards) */
    }

    removeCards(arr) { //remove cards from this pack
        for (let i in arr) {
            this.cards.splice(this.cards.findIndex(e=>{
                if (e.id==arr[i].id) {
                    return e
                }
            }),1)
        }
    }

    giveCards(arr) { //insert cards into this pack
        for (let i in arr) {
            this.cards.push(arr[i])
        }
    }
}
