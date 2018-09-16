const createPlacedImage = function(imageSrc) {
    const placedImg = document.createElement("img")
    placedImg.className = "placed"
    placedImg.src = imageSrc
    return placedImg
}

const createDropBox = function() {
    const dropBox = document.createElement("div")
    dropBox.className = "dropBox"
    return dropBox
}

const addClass = function(element, className) {
    element.className += (" " + className)
}

const removeClass = function(element, className) {
    element.className = element.className.replace(new RegExp(className, 'g'), "")
}

const isInside = function(element, event) {
    const elementLeft = element.offsetLeft
    const elementRight = elementLeft + element.offsetWidth
    const delementTop = element.offsetTop
    const elementBottom = delementTop + element.offsetHeight

    return event.pageX > elementLeft && event.pageX < elementRight
            && event.pageY > delementTop && event.pageY < elementBottom
}

const isCrossing = function(element1, element2) {
    const element1CenterX = element1.offsetLeft + element1.offsetWidth / 2
    const element1CenterY = element1.offsetTop + element1.offsetHeight / 2

    const element2CenterX = element2.offsetLeft + element2.offsetWidth / 2
    const element2CenterY = element2.offsetTop + element2.offsetHeight / 2

    return Math.abs(element1CenterX - element2CenterX) <  (element1.offsetWidth + element2.offsetWidth) / 2 &&
            Math.abs(element1CenterY - element2CenterY) <  (element1.offsetHeight + element2.offsetHeight) / 2
}

const findFromDropBoxIndex = function() {
    const from = document.getElementById("from")
    var center = {"pageX": from.offsetLeft + (from.offsetWidth / 2), "pageY": from.offsetTop + (from.offsetHeight / 2)}

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
    var ret = -1
    dropBoxes.forEach(function(dropBox, index) {
        if (isInside(dropBox, center) && dropBox.className.indexOf("dropBoxPlaced") > -1) {
            ret = index
        }
    })
    return ret
}

const findToDropBoxIndex = function() {
    const to = document.getElementById("to")
    var center = {"pageX": to.offsetLeft + (to.offsetWidth / 2), "pageY": to.offsetTop + (to.offsetHeight / 2)}

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
    var ret = -1
    dropBoxes.forEach(function(dropBox, index) {
        if (isInside(dropBox, center) && dropBox.className.indexOf("dropBoxPlaced") > -1) {
            ret = index
        }
    })
    return ret
}