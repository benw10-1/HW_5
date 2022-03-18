var current = moment()

// current.hour(12)

var changed = null
var currentDay = document.getElementById("currentDay")
var fromStorage = JSON.parse(localStorage.getItem("storedObj")) ?? {}
var container = document.getElementsByClassName("container")[0]
var arrows = document.getElementsByClassName("arrow")

arrows[0].addEventListener("click", function () {
    updateDay(-1)
})
arrows[1].addEventListener("click", function () {
    updateDay(1)
})

function generateStructure (time) {
    var m = time.format("M")
    var d = time.format("D")
    var y = time.format("YYYY")
    fromStorage[y] = fromStorage[y] ?? {}
    fromStorage[y][m] = fromStorage[y][m] ?? {}
    fromStorage[y][m][d] = fromStorage[y][m][d] ?? [null, null, null, null, null, null, null, null, null]

    toStorage();
}

if (Object.keys(fromStorage).length === 0) {
    generateStructure(current)
}

function toStorage () {
    localStorage.setItem("storedObj", JSON.stringify(fromStorage))
}

function updateDay (lr) {
    var newTime = moment(changed ?? current)
    newTime.day(newTime.day() + lr)
    if (current.isSame(newTime)) {
        changed = null
    }
    else {
        changed = newTime
    }
    updateTime()
    generateTable(changed)
}

function writeEvent (event, time, index) {
    generateStructure(time)
    var m = time.format("M")
    var d = time.format("D")
    var y = time.format("YYYY")

    fromStorage[y][m][d][index] = event
    toStorage()
}

function generateTable (time) {
    if (container.children.length === 0) {
        generateDefaultElements(time)
    }
    else {
        var m = time.format("M")
        var d = time.format("D")
        var y = time.format("YYYY")

        generateStructure(time)

        for (let i = 0; i < 9; i++) {
            container.querySelectorAll(".inp")[i].value = fromStorage[y][m][d][i]
        }
    }
    updatePast()
}

function updatePast() {
    if (container.children.length === 0) return
    for (i=0; i < 9; i++) {
        let hour = moment(changed ?? current)
        hour.hour(i + 9)
        container.children[i].children[0].style = null
        if (current.isBefore(hour, "hour")) {
            container.children[i].children[1].className = "inp future"
            container.children[i].children[1].style.background = null
        }
        else if (current.isSame(hour, "hour")) {
            var percent = [Math.max(0, current.minute()/60 * 100 - 10), current.minute()/60 * 100, Math.min(100, current.minute()/60 * 100 + 10)]
            container.children[i].children[1].className = "inp present"
            container.children[i].children[1].style.background = "linear-gradient(to bottom, #d3d3d3 " + percent[0] + "%, #ff6961 " + percent[1] + "%, #77dd77 " + percent[2] + "%)"
            container.children[i].children[0].style.background = "radial-gradient(circle, #ff6961 0%, rgb(255, 255, 255) 50%)"
        }
        else {
            container.children[i].children[1].style.background = null
            container.children[i].children[1].className = "inp past"
        }
    }
}

function generateDefaultElements (time) {
    container.classList.toggle("hidden")
    container.classList.toggle("fadeIn")

    var m = time.format("M")
    var d = time.format("D")
    var y = time.format("YYYY")

    generateStructure(time)
    
    for (let i = 0; i < 9; i++) {
        var row = document.createElement("div")
        row.classList.add("time-block")

        var hr = document.createElement("a")
        hr.classList.add("hour")
        hr.innerHTML = ((i + 8) % 12) + 1

        if (i + 9 > 12) {
            hr.innerHTML += "pm"
        }
        else {
            hr.innerHTML += "am"
        }
        const k = i;
        var event = document.createElement("textarea")
        event.value = fromStorage[y][m][d][i]
        event.onblur = function () {
            writeEvent(this.value.trim(), changed ?? current, i)
        }

        row.appendChild(hr)
        row.appendChild(event)

        container.appendChild(row)
    }
    updatePast()
}

function updateTime () {
    if (changed !== null) {
        currentDay.childNodes[1].textContent = changed.format("MMM Do YYYY")
    }
    else {
        currentDay.childNodes[1].textContent = current.format("MMM Do YYYY")
    }
}
let old = Date.now()
var timeLoop = setInterval(function () {
    let m = current.minute()
    let d = current.day()
    let passed = (Date.now() - old)/1000
    current.add(passed, "seconds")
    updatePast()
    if (d !== current.day()) {
        generateTable(current)
    }
    old = Date.now()
    updateTime()
}, 1000)
