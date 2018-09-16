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
    currentMovingImage.style.top = (this.offsetTop - 10) + "px"

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
    currentMovingImage.style.top = event.pageY - offsetInElement.y + "px"
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

    currentState = State.DRAGGING_RECT
    const rect = document.getElementById("rect")
    rect.className = rect.className.replace("invisible", "")

    rectOrigin.x = event.pageX
    rectOrigin.y = event.pageY
    rect.style.left = rectOrigin.x + "px"
    rect.style.top = rectOrigin.y + "px"

    document.addEventListener("mousemove", mouseMoveForDragRect)
    document.addEventListener("touchmove", mouseMoveForDragRect)
}

const mouseUpHandler = function() {
    if (currentState == State.DRAGGING_IMAGE) { 
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
    } else if (currentState == State.DRAGGING_RECT) {
        document.removeEventListener("mousemove", mouseMoveForDragRect)
        document.removeEventListener("touchmove", mouseMoveForDragRect)

        const rect = document.getElementById("rect")
        rect.style.width = "0px"
        rect.style.height = "0px"
        addClass(rect, "invisible")
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

    const rect = document.getElementById("rect")

    const width = event.pageX - rectOrigin.x
    const height = event.pageY - rectOrigin.y

    if (width < 0) {
        rect.style.left = event.pageX + "px"
    }

    if (height < 0) {
        rect.style.top = event.pageY + "px"
    }

    rect.style.width = Math.abs(width) + "px";
    rect.style.height = Math.abs(height) + "px";

    const dropBoxes = Array.from(document.getElementsByClassName("dropBox"))
    dropBoxes.forEach(function(dropBox) {
        if (isCrossing(dropBox, rect) && dropBox.className.indexOf("dropBoxPlaced") > -1) {
            addClass(dropBox, "selected")
        } else {
            removeClass(dropBox, "selected")
        }
    })
}