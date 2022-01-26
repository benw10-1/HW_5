var jumbo = document.getElementsByClassName("jumbotron")[0]


function getTransitionEndEventName () {
    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    let bodyStyle = document.body.style;

    for (let transition in transitions) {
        if(bodyStyle[transition] != undefined) {
            return transitions[transition];
        } 
    }
}

function startAnimation () {
    jumbo.classList.toggle("shrink")
    jumbo.children[0].classList.toggle("fadeOut")
    jumbo.addEventListener(getTransitionEndEventName(), function () {
        jumbo.children[0].classList.toggle("hidden")
        jumbo.children[1].classList.toggle("hidden")
        jumbo.children[1].classList.toggle("fadeIn")
    })
}

document.getElementsByTagName("body")[0].onload = setTimeout(startAnimation, 1000)