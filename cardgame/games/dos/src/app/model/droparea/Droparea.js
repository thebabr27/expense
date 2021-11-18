class Droparea {
    constructor (id,listClasses) {
        this.id = id
        this.area = document.getElementById(this.id)
        this.x1;
        this.x2;
        this.y1;
        this.y2;
        this.status = ''
        this.listClasses=listClasses
    }
    swapClasses(droparea2) {

    }

    getRect() {
        return document.querySelectorAll('#'+this.id)[0].getBoundingClientRect()
    }

    set(x1,y1,x2,y2) {
        setTimeout(e=>{
            var rect = document.querySelectorAll('#'+this.id)[0].getBoundingClientRect()
        },300)
    }

    update(items,mode) {
        if (mode=='generate') {
            let html = ""; for (let i in items) {
                html+=`
                <button id="card_${items[i].id}" class="card card-shadow game-card ${items[i].icon} p-1">
                    <div  id="card_${items[i].id}Slider" class="card-slider"></div>
                    <div class="game-card-wrapper">
                    <div class="game-card-header"><i></i></div>  
                    <div class="game-card-body"><i></i></div>  
                    <div class="game-card-footer"><i></i></div>
                    </div>
                </button> 
                `
            } 
            this.area.innerHTML = html;     
        } else {
            let div = document.createElement("div")
            div.classList.add("card-margin")
            this.area.appendChild(div)
            for (let i in items) {
                this.area.appendChild(document.getElementById("card_"+items[i].id))
                for (let l in this.listClasses) {
                    document.getElementById("card_"+items[i].id).classList.add(this.listClasses[l])
                }
            }
        }
    }
    onEnter(e,func,func2) {
        if (e.touches[0].clientX > this.getRect().x
                        && e.touches[0].clientX < (this.getRect().x+this.getRect().width)
                        && e.touches[0].clientY > this.getRect().y
                        && e.touches[0].clientY < (this.getRect().y+this.getRect().height)) {         
                            this.area.classList.add("border-light")
                            func()
                        } else {     
                            this.area.classList.remove("border-light")
                            func2()
                        }
    }
}