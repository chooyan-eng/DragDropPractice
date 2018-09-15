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
    paletteItems.forEach(function(item) {
        attachMousedownEvent(item)
    })

    document.addEventListener("mousedown", function(e) {
        currentState = State.DRAGGING_RECT
        const rect = document.getElementById("rect")
        rect.className = rect.className.replace("invisible", "")

        rectOrigin.x = e.pageX
        rectOrigin.y = e.pageY
        rect.style.left = rectOrigin.x + "px"
        rect.style.top = rectOrigin.y + "px"

        document.addEventListener("mousemove", mouseMoveForDragRect)
    }, false)

    document.addEventListener("mouseup", function() {
        if (currentState == State.DRAGGING_IMAGE) {
            document.removeEventListener("mousemove", mouseMoveForDragImg)

            const currentMovingImage = document.getElementById("movingImg")
            addClass(currentMovingImage, "invisible")

            const dropBox = document.getElementsByClassName("dropBox")[0]
            if (dropBox.className.indexOf("selected") > -1) {
                dropBox.removeChild(dropBox.firstChild)
                dropBox.appendChild(createPlacedImage(currentMovingImage.src))
                dropBox.className = dropBox.className.replace("selected", "dropBoxPlaced")
            }
        } else {
            document.removeEventListener("mousemove", mouseMoveForDragRect)

            const rect = document.getElementById("rect")

            rect.style.width = "0px"
            rect.style.height = "0px"
            
            if (rect.className.indexOf("invisible") < 0) {
                rect.className += " invisible"
            }
        }
        currentState = State.NONE
    }, false)
}

const attachMousedownEvent = function(target) {
    target.addEventListener("mousedown", function(e) {
        currentState = State.DRAGGING_IMAGE
        offsetInElement.x = event.pageX - this.offsetLeft
        offsetInElement.y = event.pageY - this.offsetTop + 10

        const currentMovingImage = document.getElementById("movingImg")
        currentMovingImage.src = this.src
        removeClass(currentMovingImage, "invisible")
        currentMovingImage.style.left = this.offsetLeft + "px"
        currentMovingImage.style.top = (this.offsetTop - 10) + "px"

        document.addEventListener("mousemove", mouseMoveForDragImg)

        e.stopPropagation()
    }, false)
}

const mouseMoveForDragImg = function(e) {
    e.preventDefault();

    const currentMovingImage = document.getElementById("movingImg")
    currentMovingImage.style.top = event.pageY - offsetInElement.y + "px"
    currentMovingImage.style.left = event.pageX - offsetInElement.x + "px"

    const dropBox = document.getElementsByClassName("dropBox")[0]
    const dropBoxLeft = dropBox.offsetLeft
    const dropBoxRight = dropBoxLeft + dropBox.offsetWidth
    const dropBoxTop = dropBox.offsetTop
    const dropBoxBottom = dropBoxTop + dropBox.offsetHeight

    if (event.pageX > dropBoxLeft && event.pageX < dropBoxRight
        && event.pageY > dropBoxTop && event.pageY < dropBoxBottom) {
        if (dropBox.className.indexOf("selected") < 0) {
            dropBox.className += " selected"
        }
    } else {
        dropBox.className = dropBox.className.replace("selected", "")
    }
}

const mouseMoveForDragRect = function(e) {
    e.preventDefault();
    const rect = document.getElementById("rect")

    const width = event.pageX - rectOrigin.x
    const height = event.pageY - rectOrigin.y

    if (width < 0) {
        rect.style.left = e.pageX + "px"
    }

    if (height < 0) {
        rect.style.top = e.pageY + "px"
    }

    rect.style.width = Math.abs(width) + "px";
    rect.style.height = Math.abs(height) + "px";

    // 当たり判定
    dragCenterX = drag.offsetLeft + drag.offsetWidth / 2
    dragCenterY = drag.offsetTop + drag.offsetHeight / 2

    rectCenterX = rect.offsetLeft + rect.offsetWidth / 2
    rectCenterY = rect.offsetTop + rect.offsetHeight / 2

    if (Math.abs(dragCenterX - rectCenterX) <  (drag.offsetWidth + rect.offsetWidth) / 2 &&
            Math.abs(dragCenterY - rectCenterY) <  (drag.offsetHeight + rect.offsetHeight) / 2) {
        // 当たってる
        if (drag.className.indexOf("selected") < 0) {
            drag.className += " selected"
        }
    } else {
        drag.className = drag.className.replace("selected", "")
    }
}

const createPlacedImage = function(imageSrc) {
    const placedImg = document.createElement("img")
    placedImg.className = "placed"
    placedImg.src = imageSrc
    return placedImg
}

const addClass = function(element, className) {
    element.className += (" " + className)
}

const removeClass = function(element, className) {
    element.className = element.className.replace(new RegExp(className, 'g'), "")
}
