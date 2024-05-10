document.addEventListener("DOMContentLoaded", function(){
    const noquiero = document.getElementById("noquiero");
    const siquiero = document.getElementById("siquiero");

    noquiero.addEventListener("mouseover", function(){
        noquiero.innerHTML = "ROSCA POR SIEMPRE";
        siquiero.innerHTML = "OBVIO NO";
        siquiero.setAttribute("class", "alt noquiero");
        noquiero.setAttribute("class", "alt siquiero");
    });
    
    siquiero.addEventListener("mouseover", function(){
        siquiero.setAttribute("class", "alt siquiero");
        noquiero.setAttribute("class", "alt noquiero");
        noquiero.innerHTML = "OBVIO NO";
        siquiero.innerHTML = "ROSCA POR SIEMPRE";

    })

})

