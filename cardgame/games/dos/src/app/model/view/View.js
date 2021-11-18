class View {
    constructor(game) {
        this.only = document.getElementById("only")
        this.game = game
        this.dropareas=[]
        this.selectedCardId = -1;
        let areas = [
            {id:'droparea',listClasses:['centered-card']}
            , {id:'droparea2',listClasses:['listed-card']}
            , {id:'droparea3'}
        ]
        for (let i in areas) {
            this.dropareas.push(new Droparea(
                areas[i].id
                , areas[i].listClasses
            ))
        }
    }

        removeLoading() {
            document.getElementById("loading").classList.add("d-none")
            document.getElementById("loading").classList.remove("d-flex")
        }

        showApp() {
            this.removeLoading()
            document.getElementsByClassName('app-container')[0]
                .classList.remove("d-none")
        }

        touchstart(e) {
            e.preventDefault(); 
            //identifichiamo l'elemento e il suo slider
            let touchedElement = document.getElementById(e.target.id.replace("Slider",""))
            let touchedCardId = touchedElement.id.replace("card_","")
            let touchedElementSlider = document.getElementById(e.target.id)
            this.selectedCardId = parseInt(touchedCardId)
            this.only.classList = touchedElement.classList;
            this.only.innerHTML = touchedElement.innerHTML;
            this.only.querySelector('.card-slider').setAttribute("id","only_slider")
            touchedElementSlider.classList.add("disabled")
            this.only.classList.add("d-none")
            this.only.classList.add("card-shadow")
            this.only.classList.add("position-absolute")
            this.only.classList.remove("centered-card")
        }

        touchend(e) {
            e.preventDefault();  
            let firstCard = this.game.playersPacks[0].selectCardsByIds([this.selectedCardId])[0];
            let secondCard = this.game.floor.cards[this.game.floor.cards.length-1];
            console.log(firstCard,secondCard)
            console.log(this.game)
            for (let i in this.dropareas)     {
                this.dropareas[i].area.classList.remove("border-light")
            }
            let touchedElement = document.getElementById(e.target.id.replace("Slider",""))
             let touchedElementSlider = document.getElementById(e.target.id)
            this.only.setAttribute("style",`
                z-index: 3000;
                margin-top: 0;
                margin-left: 0;
            `) 
            this.only.classList.add("d-none")
            touchedElementSlider.classList.remove("disabled")
            //se viene rilasciata nella droparea 1
            if (this.dropareas[0].status=='drop') {
                if (firstCard.match(secondCard,'value','eq')
                || firstCard.match(secondCard,'suit','eq')) {
                console.log("dropped")
                //procediamo al trasferimento carta
                this.game.playersPacks[0].transferCardsTo([this.selectedCardId],this.game.floor)
                //rimuoviamo l'ombra dall'elemento
                touchedElement.classList.remove("card-shadow")

                this.dropareas[0].area.appendChild(touchedElement)
                for (let i in this.dropareas[0].area.children) {
                    if (typeof(this.dropareas[0].area.children[i])=='object') {
                        for (let l in this.dropareas[0].listClasses) {
                            this.dropareas[0].area.children[i].classList.add(
                                this.dropareas[0].listClasses[l]
                            )
                        }
                    }
                }
            }
            //se viene rilasciata nella droparea 2
            } else if (this.dropareas[1].status=='drop') {
                console.log("dropping on droparea2")
            } else {
                console.log("leaving")
            }
            console.log(this.game.floor)
        }

        touchmove(e) {
            e.preventDefault(); 
            this.only.setAttribute("style",`
                z-index: 3000;
                margin-top: calc(${e.touches[0].clientY}px - 45px);
                margin-left: calc(${e.touches[0].clientX}px - 30px);
            `) 
            this.only.classList.remove("d-none")
            this.dropareas[0].onEnter(e,()=>{
                this.dropareas[0].status = 'drop'
            },()=>{
                this.dropareas[0].status = ''
            })
            this.dropareas[1].onEnter(e,()=>{
                this.dropareas[1].status = 'drop'
            },()=>{
                this.dropareas[1].status = ''
            })
        }
        generateListeners(items) {            
            let ids=[]
            for (let i=0;i<items.length;i++)  {
                let id = items[i].id;  
                ids.push(id)            
                //quando viene afferrata    
                document.getElementById('card_'+id+'Slider')    
                .addEventListener("touchstart",e=>{ 
                    this.touchstart(e)                
                })
                //mentre viene trascinata
                document.getElementById('card_'+id+'Slider')    
                .addEventListener("touchmove",e=>{ 
                    this.touchmove(e)
                }) 
                //quando viene rilasciata
                document.getElementById('card_'+id+'Slider')
                .addEventListener("touchend",e=>{
                    this.touchend(e)
                })
            }
        }
    }
