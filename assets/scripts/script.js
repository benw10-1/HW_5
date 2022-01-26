var current = moment()
var changed = null;
var currentDay = document.getElementById("currentDay")
var fromStorage = localStorage.getItem("storedObj")
var container = document.getElementsByClassName("container")[0]

if (fromStorage !== null) {
    var m = current.format("M")
    var d = current.format("D")
    var y = current.format("YYYY")
    fromStorage = {}
    fromStorage[y] = {}
    fromStorage[y][m] = {}
    fromStorage[y][m][d] = [null, null, null, null, null, null, null, null, null]

    toStorage();
}

function toStorage () {
    localStorage.setItem("storedObj", JSON.stringify(fromStorage))
}

function generateTable (time) {
    if (container.children.length === 0) {
        generateDefaultElements()
    }
}

function generateDefaultElements () {
    var row = document.createElement("div")
    row.classList.add("time-block")

    var hr = document.createElement("a")
    hr.classList.add("hour")
}

var timeLoop = setInterval(function () {
    // let m = current.minute()
    current.add(1.01, "seconds")
    if (!changed) {
        currentDay.innerHTML = current.format("MMM Do YYYY")
    }
}, 1000)


