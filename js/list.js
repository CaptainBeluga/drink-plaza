const mainDiv = document.querySelector("#mainDiv")


for(let l in lists){
    (async()=>{
        let req = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?${l.substring(0,1)}=list`)
        let json = await req.json()
        json = json["drinks"]

        let div = document.createElement("div")
        div.className = "accordion mt-5 mb-3"
        div.id = l

        let accordionItem = document.createElement("div")
        accordionItem.className = "accordion-item"

        let accordionHeader = document.createElement("h2")
        accordionHeader.className = "accordion-header"

        let button = document.createElement("button")
        button.className = "fw-bold accordion-button collapsed"
        button.setAttribute("type","button")
        button.setAttribute("data-bs-toggle","collapse")
        button.setAttribute("data-bs-target",`#${l}Accordion`)
        button.textContent = l.toUpperCase()

        let collapse = document.createElement("div")
        collapse.id = `${l}Accordion`
        collapse.className = "accordion-collapse collapse"


        let accordionBody = document.createElement("div")
        accordionBody.className = "accordion-body"

        for(let i=0;i<json.length;i++){
            let h6 = document.createElement("h6")

            h6.className = "mb-4 mt-3"
            h6.textContent = `${i+1}. ${title(json[i][lists[l]])}`
            accordionBody.appendChild(h6)
        }

        mainDiv.appendChild(div)
        div.appendChild(accordionItem)

        accordionItem.appendChild(accordionHeader)
        accordionHeader.appendChild(button)

        accordionItem.appendChild(collapse)
        collapse.appendChild(accordionBody)

        let goTo = document.URL.split("#")

        if(goTo.length == 2){
            if(goTo[1] == div.id){
                
                let btn = div.querySelector("button") 
                btn.classList.remove("collapsed")
                
                div.querySelector(".accordion-collapse").classList.add("show")
                
                div.scrollIntoView()

                animation(btn, 500, 150, 1000)
            }    
        }
    })()
}
