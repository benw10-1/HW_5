var current = moment()
current.hour(10)
current.minute(59)
current.second(55)
var changed = null
var currentDay = document.getElementById("currentDay")
var fromStorage = JSON.parse(localStorage.getItem("storedObj")) ?? {}
var container = document.getElementsByClassName("container")[0]

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
        container.classList.toggle("hidden")
        container.classList.toggle("fadeIn")
    }
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
        else if (current.isSame(hour)) {
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
            writeEvent(this.value, changed ?? current, i)
        }

        row.appendChild(hr)
        row.appendChild(event)

        container.appendChild(row)
    }
    updatePast()
}

var timeLoop = setInterval(function () {
    let m = current.minute()
    let d = current.day()
    current.add(1.01, "seconds")
    if (changed !== null) {
        currentDay.innerHTML = changed.format("MMM Do YYYY")
    }
    else {
        currentDay.innerHTML = current.format("MMM Do YYYY")
    }
    if (m !== current.minute()) {
        updatePast()
    }
    if (d !== current.day()) {
        generateTable(current)
    }
}, 1000)


