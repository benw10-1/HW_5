var jumbo = document.getElementsByClassName("jumbotron")[0]
var found = {}

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

function startFirstAnimation () {
    jumbo.classList.toggle("shrink")
    jumbo.children[0].classList.toggle("fadeOut")
    var done = false
    jumbo.addEventListener(getTransitionEndEventName(), function () {
        if (done) return
        jumbo.children[0].classList.toggle("hidden")
        jumbo.children[1].classList.toggle("hidden")
        jumbo.children[1].classList.toggle("fadeIn")
        generateTable(current)
        done = true
    })
}

document.getElementsByTagName("body")[0].onload = setTimeout(startFirstAnimation, 1000)