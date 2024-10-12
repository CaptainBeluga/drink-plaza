let mainDiv = document.querySelector("#main")
let errLabel = document.querySelector("#errLabel")


function getAsset(name){
    return `https://www.thecocktaildb.com/images/ingredients/${name.replaceAll(" ","%20")}-Medium.png`
}

let langs = document.querySelectorAll(".dropdown-menu")[1]
let btns = langs.querySelectorAll("button")

langs.addEventListener("click", e => {
    //in case the EventListener grabs the click from the image
    language((e.target.nodeName == "BUTTON" ? e.target : e.target.parentElement).value)
})


//LANGUAGES STUFF
if(localStorage.getItem("lang") == null){
    language("IT") //default IT
}


function language(value){
    const availableLanguages = ["IT","EN","ES","DE","FR"]

    if(availableLanguages.includes(value)){
        localStorage.setItem("lang",value)

        for(let i=0;i<btns.length;i++){
            if(btns[i].value == value){
                btns[i].classList.add("disabled")
            }
            else{
                btns[i].classList.remove("disabled")
            }
        }
    
        document.getElementsByClassName("nav-link dropdown-toggle")[1].children[0].src = `./img/langs/${value.toLowerCase()}.png`
    }
}

///////////////////////////////////////////////

const ENDPOINT = "https://www.thecocktaildb.com/api/json/v1/1/"

/*
    0 => php file

    1 => type (drinks / ingredients)

    2 => lookup option (i => drink id | iid => ingredient id) 

*/


searchType = {
    "s" : ["search.php?s=", "drinks", "i"], //drink lookup
    
    "i" : ["search.php?i=","ingredients","iid"], //ingredient lookup

    "filter-i" : ["filter.php?i=","drinks", "i"], //drinks with a specific ingredient inside

    "random" : ["random.php?", "drinks", "i"], //random drink in the db

    "a" : ["filter.php?a=", "drinks","i"], // alcoholic / non alcoholic / optional alcohol

    "c" : ["filter.php?c=", "drinks", "i"], // by category | (Cocktail , Ordinary_Drink , Shot , ecc...)

    "g" : ["filter.php?g=","drinks","i"] // by glass (how the drink should be served) | (Champagne Flute, Shot Glass, Cocktail Glass)
}


async function showMore(e){
    function cardCreator(){
        let col = document.createElement("div")
        col.className = "col-md-4 mt-4 flex"
        
        let card = document.createElement("div")
        card.className = "card mx-auto card-prop"

        let cardBody = document.createElement("div")
        cardBody.className = "card-body"

        row.appendChild(col)
        col.appendChild(card)
        card.appendChild(cardBody)

        return cardBody
    }
   
    function getAsset(name){
        return `https://www.thecocktaildb.com/images/ingredients/${name.replaceAll(" ","%20")}-Medium.png`
    }

    //Data Fetching
    let lang = localStorage.getItem("lang") != null ? localStorage.getItem("lang") : "IT";
    let important = e.target.getAttribute("itemID").split("-")

    let req = await fetch(`${ENDPOINT}lookup.php?${important[2]}=${important[0]}`)   
    let json = await req.json()
    json = json[important[1]][0]

    //DOM
    let row = e.target.parentElement.children[0]
    row.children[0].className = "col-md-4 mt-4 flex"

    e.target.style.display = "none"


    //PROPS CARD
    let propsCard = cardCreator()

    let props = document.createElement("h3")
    props.textContent = "PROPS"
    props.className = "card-title"


    let ul = document.createElement("ul")
    ul.className = "list-group list-group-flush"
    
    let ulElements = {}
    
    ulElements = important[1] == "drinks" ? {"Type": "strAlcoholic-No Type", "Category" : "strCategory-No Category", "Tags" : "strTags-No Tags", "IBA" : "strIBA-No Ranking","Serve" : "strGlass-No Glass"} : {"Type" : "strType-No Type" , "Alcohol" : "strAlcohol-No Alcohol" , "ABV % " : "strABV-No ABV"}

    for(let el in ulElements){
        let j = ulElements[el].split("-")
        ul.innerHTML+= `<li class="list-group-item">${el}: <span class="fw-bold">${json[j[0]] != null ? title(json[j[0]]) : j[1]}</span></li>`
    }

    //////////

    //INSTRUCTION CARD
    let instructionsCard = cardCreator()
    
    let instruction = document.createElement("h3")
    instruction.textContent = important[1] == "drinks" ? "INSTRUCTIONS" : "DESCRIPTION"
    instruction.className = "card-title"

    let ins = json[`strInstructions${lang == "EN" ? "" : lang}`]

    let insP = document.createElement("p")
    insP.className = "card-text"

    if(important[1] == "drinks"){
        if(ins != null){
            ins = ins.split(".")
            for(let i=0;i<ins.length;i++){
                if(ins[i] != ""){
                    insP.innerHTML += `<span class="fw-bold">${i+1}. </span> ${ins[i]}${i != ins.length-1 ? "." : ""}<br><br>`
                }
            }
        }
        else{
            insP.innerHTML = `NO Instructions for <span class="fw-bold">${lang}</span>`
        }    
    }

    else{
        insP.innerHTML = json["strDescription"]
    }


    //PROPS APPEND
    propsCard.appendChild(props)
    propsCard.appendChild(document.createElement("hr"))
    propsCard.appendChild(ul)

    
    //INSTRUCTIONS APPEND
    instructionsCard.appendChild(instruction)
    instructionsCard.appendChild(document.createElement("hr"))
    instructionsCard.appendChild(insP)




    //IFRAME + INGREDIENTS

    //available only for drinks ofc/obv
    if(important[1] == "drinks"){
        let tutorial = json["strVideo"]

        if(tutorial != null){
            let col = document.createElement("div")
            col.className = "col-lg-6 mt-5 flex"

            let ratio = document.createElement("div")
            ratio.className = "ratio ratio-16x9 mx-auto"

            let iframe = document.createElement("iframe")
            iframe.src = tutorial.replace("watch?v=", "embed/")
            iframe.setAttribute("allowfullscreen","")

            row.appendChild(col)
                col.appendChild(ratio)
                    ratio.appendChild(iframe)

        }            

        let col2 = document.createElement("div")
        col2.className = tutorial == null ? "col" : "col-lg-6" 
        col2.className += " mt-5 flex"
        
        let card = document.createElement("div")
        card.className = "card text-center mx-auto"

        let cardHeader = document.createElement("div")
        cardHeader.className = "card-header"
        cardHeader.textContent = "INGREDIENTS"


        let cardBody = document.createElement("div")
        cardBody.className = "card-body"

        let cardRow = document.createElement("div")
        cardRow.className = "row"


        let length;
        for(let i=0;i<15;i++){
            if(json[`strIngredient${i+1}`]==null){
                length = i
                break
            }
        }

        for(let i=0;i<length;i++){                
            let pname = json[`strIngredient${i+1}`]
            let iname = json[`strMeasure${i+1}`]

            let ingredientCol = document.createElement("div")
            ingredientCol.className = "col-xl-4 col-md-6 mt-4 flex"

            let cardElement = document.createElement("div")
            cardElement.className = "card mx-auto ingredients"

            let img = document.createElement("img")
            img.src = getAsset(pname)
            img.className = "img-fluid p-2 mx-auto"


            let cardBody = document.createElement("div")
            cardBody.className = "card-body"

            let ingName = document.createElement("h6")
            ingName.textContent = pname.toUpperCase()

            let ingQuantity = document.createElement("span")
            
            ingQuantity.textContent = iname != null ? iname : ""

            cardRow.appendChild(ingredientCol)

                ingredientCol.appendChild(cardElement)

                    cardElement.appendChild(img)

                    cardElement.appendChild(cardBody)
                        cardBody.appendChild(ingName)
                        cardBody.appendChild(ingQuantity)
        }


        row.appendChild(col2)
            col2.appendChild(card)
                card.appendChild(cardHeader)
                card.appendChild(cardBody)
                    cardBody.appendChild(cardRow)
    }


    
    let button = document.createElement("button")
    button.textContent = "SHOW LESS"
    button.className = "btn btn-outline-danger mt-5"
    button.setAttribute("itemID", json["idDrink"])


    

    //original "SHOW MORE" button POSITION            
    e.target.parentElement.appendChild(button)

    button.addEventListener("click",btn => {
        btn.target.remove()
        row.children[0].className = "col mt-2"

        for(let i=0;i<(row.children.length-1)+i;i++){   
            row.children[1].remove()         
        }

        e.target.style.display = "inline"

        //Mini Animation
        
        try{
            let container = document.getElementById(important[0])

            animation(container.querySelector("h3"), 250, 150, 1500)

            container.scrollIntoView()

        }catch(e){}
    })
}




async function loadData(){
    //clean the page
    mainDiv.innerHTML = ""


    //summer hits references
    switch(document.querySelector("#search").value.replaceAll(" ","").toLowerCase()){
        case "fumoinpubblico":
            alert("attiro clienti cani da tartufo!")
            break
        
        case "sononeltunnel":
            alert("mio fra sposta kg tranquillo in Uber!")
            break

        case "hittheroadjack":
            alert("no more no more no more no more!")
            break
        
        case "dry":
            alert("bevo jack e fumo dry !")
            break

        case "bevojackefumodry":
            alert("nasco e muoio nel mio gangsta para-radise")
            break

        case "night":
            alert("sembra di stare in pa-pa-para-radise")
            break

        case "47kalashnelbando":
            alert("albana commando controla")
            break
        
        case "benzo":
            alert("non parlo, parla la pistola")
            break
        
        case "lasciailrossetto":
            alert("shooter appostati sul tetto")
            break
    }



    // FETCHING + LOADING DATA
    
    try{
        let opts = document.querySelector("#searchType")
        let type = opts.selectedOptions[0].value
        errLabel.textContent = ""

        let req = await fetch(`${ENDPOINT+searchType[type][0]}${document.querySelector("#search").value.replace(/\s+/g, ' ').trim()}`)
        let json = await req.json()
        json = json[searchType[type][1]]

        if(json == "no data found"){
            throw json;
        }
        
        for(let i=0;i<json.length;i++){
            let card = document.createElement("div")
            card.className = "card text-center shadow-lg p-2 mb-5 bg-body-tertiary rounded"
            card.id = `${searchType[type][1] == "drinks" ? json[i]["idDrink"] : json[i]["idIngredient"]}`
            
            let cardBody = document.createElement("div")
            cardBody.className = "card-body"
            
            let row = document.createElement("div")
            row.className = "row"
            
            let col = document.createElement("div")
            col.className = "col mt-2"
            
            let subCard = document.createElement("div")
            subCard.className = "card mx-auto card-prop"
            
            let img = document.createElement("img")
            img.src = searchType[type][1] == "drinks" ? json[i]["strDrinkThumb"] : getAsset(json[i]["strIngredient"])
            img.className = "img-fluid"            
            
            let subCardBody = document.createElement("div")
            subCardBody.className = "card-body"
            
            let name = document.createElement("h3")
            name.textContent = searchType[type][1] == "drinks" ? json[i]["strDrink"] : json[i]["strIngredient"]
            
            
            let button = document.createElement("button")
            button.textContent = "SHOW MORE"
            button.setAttribute("itemID", `${searchType[type][1] == "drinks" ? json[i]["idDrink"] : json[i]["idIngredient"]}-${searchType[type][1]}-${searchType[type][2]}`)
            button.className = "btn btn-success mt-5"
            
            ///
            
            mainDiv.appendChild(card)
                card.appendChild(cardBody)
                    cardBody.appendChild(row)
                        row.appendChild(col)
                            col.appendChild(subCard)
                                subCard.appendChild(img)

                                subCard.appendChild(subCardBody)
                                    subCardBody.appendChild(name)

                        cardBody.appendChild(button)
            
                        

            button.addEventListener("click",showMore)
            }
        }
        catch(e){
            errLabel.textContent = "NO RESULTS..."
        }
    }


document.querySelector("#searchBtn").addEventListener("click", loadData)