const State = {
    NONE: 1,
    DRAGGING_IMAGE: 2,
    DRAGGING_RECT: 3,
}

const offsetInElement = {}
offsetInElement["x"] = 0
offsetInElement["y"] = 0

const rectOrigin = {}
rectOrigin["x"] = 0
rectOrigin["y"] = 0

let currentState = State.NONE

const init = function() {

    const paletteItems = Array.from(document.getElementById("palette").children)

    // mousedown for dragging images
    paletteItems.forEach(function(item) {
        item.addEventListener("mousedown", mouseDownForImg, false)
        item.addEventListener("touchstart", mouseDownForImg, false)
    })
    // mousedown for rect
    const workspace = document.getElementById("workspace")
    workspace.addEventListener("mousedown", mouseDownForRect, false)
    workspace.addEventListener("touchstart", mouseDownForRect, false)

    // mouseup for all
    document.addEventListener("mouseup", mouseUpHandler, false)
    document.addEventListener("touchend", mouseUpHandler, false)
}

const mouseDownForImg = function(e) {
    e.preventDefault();

    //タッチデイベントとマウスのイベントの差異を吸収
    if(e.type === "mousedown") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }

    currentState = State.DRAGGING_IMAGE
    offsetInElement.x = event.pageX - this.offsetLeft
    offsetInElement.y = event.pageY - this.offsetTop + 10

    const currentMovingImage = document.getElementById("movingImg")
    currentMovingImage.src = this.src
    removeClass(currentMovingImage, "invisible")
    currentMovingImage.style.left = this.offsetLeft + "px"
    currentMovingImage.style.top = (this.offsetTop - 10 + window.scrollY) + "px"

    document.addEventListener("mousemove", mouseMoveForDragImg)
    document.addEventListener("touchmove", mouseMoveForDragImg)

    e.stopPropagation()
}

const mouseMoveForDragImg = function(e) {
    e.preventDefault();

    //タッチデイベントとマウスのイベントの差異を吸収
    if(e.type === "mousemove") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }

    const currentMovingImage = document.getElementById("movingImg")
    currentMovingImage.style.top = event.pageY - offsetInElement.y + window.scrollY + "px"
    currentMovingImage.style.left = event.pageX - offsetInElement.x + "px"

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
    dropBoxes.forEach(function(dropBox) {
        if (isInside(dropBox, e)) {
            addClass(dropBox, "selected")
        } else {
            removeClass(dropBox, "selected")
        }
    })
}

const mouseDownForRect = function(e) {
    e.preventDefault();

    //タッチデイベントとマウスのイベントの差異を吸収
    if(e.type === "mousedown") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
    var isOnDropBox = false
    dropBoxes.forEach(function(dropBox) {
        if (isInside(dropBox, event) && dropBox.className.indexOf("dropBoxPlaced") > -1) {
            isOnDropBox = true
        }
    })
    if (!isOnDropBox) {
        return
    }

    currentState = State.DRAGGING_RECT

    const from = document.getElementById("from")
    const to = document.getElementById("to")

    removeClass(from, "invisible")
    removeClass(to, "invisible")

    const left = event.x - (from.offsetWidth / 2)
    const top = event.y - (from.offsetHeight / 2)

    from.style.left = left + "px"
    from.style.top = top + "px"

    to.style.left = left + "px"
    to.style.top = top + "px"

    document.addEventListener("mousemove", mouseMoveForDragRect)
    document.addEventListener("touchmove", mouseMoveForDragRect)
}

const mouseUpHandler = function() {
    if (currentState === State.DRAGGING_IMAGE) { 
        document.removeEventListener("mousemove", mouseMoveForDragImg)
        document.removeEventListener("touchmove", mouseMoveForDragImg)

        // hide dragging image
        const currentMovingImage = document.getElementById("movingImg")
        addClass(currentMovingImage, "invisible")

        const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
        dropBoxes.forEach(function(dropBox) {
            if (dropBox.className.indexOf("selected") > -1) {
                if (dropBox.children.length > 0) {
                    dropBox.removeChild(dropBox.firstChild)
                } else {
                    const dropBoxWrapper = document.getElementById("dropBoxWrapper")
                    dropBoxWrapper.appendChild(createDropBox())
                }
                dropBox.appendChild(createPlacedImage(currentMovingImage.src))
                removeClass(dropBox, "selected")
                addClass(dropBox, "dropBoxPlaced")
            }
        })
    } else if (currentState === State.DRAGGING_RECT) {
        document.removeEventListener("mousemove", mouseMoveForDragRect)
        document.removeEventListener("touchmove", mouseMoveForDragRect)

        const from = document.getElementById("from")
        addClass(from, "invisible")

        const to = document.getElementById("to")
        addClass(to, "invisible")
    }
    currentState = State.NONE
}

const mouseMoveForDragRect = function(e) {
    e.preventDefault();

    //タッチデイベントとマウスのイベントの差異を吸収
    if(e.type === "mousemove") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }

    const to = document.getElementById("to")

    const left = event.x - (from.offsetWidth / 2)
    const top = event.y - (from.offsetHeight / 2)

    to.style.left = left + "px"
    to.style.top = top + "px"

    var fromDropBoxIndex = findFromDropBoxIndex()
    var toDropBoxIndex = findToDropBoxIndex()

    const fromIndex = Math.min(fromDropBoxIndex, toDropBoxIndex)
    const toIndex = Math.max(fromDropBoxIndex, toDropBoxIndex)

    if (fromIndex === -1 || toIndex === -1) {
        return
    }

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))

    dropBoxes.forEach(function(dropBox, index) {

        if (index < fromIndex) {
            removeClass(dropBox, "selected")
        } else if (index >= fromIndex && index <= toIndex){
            addClass(dropBox, "selected")
        } else {
            removeClass(dropBox, "selected")
        }
    })
}