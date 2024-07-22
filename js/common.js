function title(s){
    let final=""
    let f = []

    f = s.split(" ")
    for(let i=0;i<f.length;i++){
        final+= f[i][0].toUpperCase() + f[i].substr(1) + " "
    }

    return final
}


function animation(element, delay, frequency, duration){
    setTimeout(()=>{
        let anim = true
        let animationInterval = setInterval(()=>{
            if(anim){
                element.classList.add("text-dark")
            }
            else{
                element.classList.remove("text-dark")
            }

            anim = !anim
        
        },frequency)

        setTimeout(()=>
        clearInterval(animationInterval),duration)
    },delay)
}