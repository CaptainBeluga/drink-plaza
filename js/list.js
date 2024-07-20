let lists = {
    "categories" : "strCategory",
    "glasses" : "strGlass",
    "ingredients" : "strIngredient1",
    "alcohol" : "strAlcoholic"
}

for(let l in lists){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?${l.substring(0,1)}=list`)
    .then(
        resp => {
            return resp.json()
        }
    )
    .then(
        json => {
            json = json["drinks"]

            let div = document.createElement("div")
            div.id = l
            
            let h2 = document.createElement("h2")
            h2.textContent = l.toUpperCase()

            let ul = document.createElement("ul")

            for(let i=0;i<json.length;i++){
                let li = document.createElement("li")
                li.textContent = json[i][lists[l]]
                ul.appendChild(li)
            }

            document.body.appendChild(div)
            div.appendChild(h2)
            div.appendChild(ul)
            div.appendChild(document.createElement("br"))
            div.appendChild(document.createElement("br"))

            let goTo = document.URL.split("#")

            if(goTo.length == 2){
                if(goTo[1] == div.id){
 
                    div.style.padding = "10px"
                    div.style.backgroundColor = "yellow"

                    div.scrollIntoView()
                   
                    setTimeout(()=>{
                        div.style.padding = "0px"
                        div.style.backgroundColor = "white"
                    },2000)
                }    
            }
        }

    )
}