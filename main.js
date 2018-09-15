const State = {
    NONE: 1,
    DRAGGING_IMAGE: 2,
    DRAGGING_WINDOW: 3,
}

let currentState = State.NONE
let x = 0
let y = 0

let originalX = 0
let originalY = 0

let currentMovingImage = null

const init = function() {
    const arrow = document.getElementById("arrow")
    const arrow2 = document.getElementById("arrow2")

    // For dragging image
    arrow.addEventListener("mousedown", function(e) {
        currentState = State.DRAGGING_IMAGE
        x = event.pageX - this.offsetLeft
        y = event.pageY - this.offsetTop + 10

        currentMovingImage = document.createElement("img")
        currentMovingImage.src = this.src
        currentMovingImage.className = "moving"
        currentMovingImage.style.left = this.offsetLeft + "px"
        currentMovingImage.style.top = (this.offsetTop - 10) + "px"
        document.body.appendChild(currentMovingImage)

        e.stopPropagation()
    }, false)

    // For dragging image
    arrow2.addEventListener("mousedown", function(e) {
        currentState = State.DRAGGING_IMAGE
        x = event.pageX - this.offsetLeft
        y = event.pageY - this.offsetTop + 10

        currentMovingImage = document.createElement("img")
        currentMovingImage.src = this.src
        currentMovingImage.className = "moving"
        currentMovingImage.style.left = this.offsetLeft + "px"
        currentMovingImage.style.top = (this.offsetTop - 10) + "px"
        document.body.appendChild(currentMovingImage)

        e.stopPropagation()
    }, false)

    document.addEventListener("mousemove", function(e) {
        e.preventDefault();
        const rect = document.getElementById("rect")

        if (currentState == State.DRAGGING_IMAGE) {
            currentMovingImage.style.top = event.pageY - y + "px"
            currentMovingImage.style.left = event.pageX - x + "px"

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
        } else if (currentState == State.DRAGGING_WINDOW) {
            const width = event.pageX - originalX
            const height = event.pageY - originalY

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
    })

    // For drawing rect
    // For dragging image
    document.addEventListener("mousedown", function(e) {
        currentState = State.DRAGGING_WINDOW
        const rect = document.getElementById("rect")
        rect.className = rect.className.replace("invisible", "")

        originalX = e.pageX
        originalY = e.pageY
        rect.style.left = originalX + "px"
        rect.style.top = originalY + "px"
    }, false)

    document.addEventListener("mouseup", function() {
        if (currentState == State.DRAGGING_IMAGE) {
            document.body.removeChild(currentMovingImage)
            const dropBox = document.getElementsByClassName("dropBox")[0]
            if (dropBox.className.indexOf("selected") > -1) {
                dropBox.removeChild(dropBox.firstChild)
                dropBox.appendChild(createPlacedImage(currentMovingImage.src))
                dropBox.className = dropBox.className.replace("selected", "dropBoxPlaced")
            }
        } else {
            const rect = document.getElementById("rect")

            rect.style.width = "0px"
            rect.style.height = "0px"
            
            if (rect.className.indexOf("invisible") < 0) {
                rect.className += " invisible"
            }
        }
        currentState = State.NONE
    }, false)

    const createPlacedImage = function(imageSrc) {
        const placedImg = document.createElement("img")
        placedImg.className = "placed"
        placedImg.src = imageSrc
        return placedImg
    }
}