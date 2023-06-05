const field = document.getElementById("field");
const unit = document.getElementById("unit");
const speedInput = document.getElementById("speed");
const framesInput = document.getElementById("frames");
const fieldWidthInput = document.getElementById("field-width");
const fieldHeightInput = document.getElementById("field-height");
const unitWidthInput = document.getElementById("unit-width");
const unitHeightInput = document.getElementById("unit-height");

// px per second
let speed = 100

// frames per second
let frames = 100

// px
const fieldSize = {
    width: 500,
    height: 700
}

// px
const unitSize = {
    width: 30,
    height: 30
}

speedInput.value = speed;
framesInput.value = frames;
fieldWidthInput.value = fieldSize.width;
fieldHeightInput.value = fieldSize.height;
unitWidthInput.value = unitSize.width;
unitHeightInput.value = unitSize.height;

field.style.width = `${fieldSize.width}px`;
field.style.height = `${fieldSize.height}px`;
unit.style.width = `${unitSize.width}px`;
unit.style.height = `${unitSize.height}px`;

speedInput.addEventListener("change", (event) => {
    speed = parseInt(event.target.value);
});
framesInput.addEventListener("change", (event) => {
    frames = parseInt(event.target.value);
});
fieldWidthInput.addEventListener("change", (event) => {
    fieldSize.width = parseInt(event.target.value);
    field.style.width = `${fieldSize.width}px`;
});
fieldHeightInput.addEventListener("change", (event) => {
    fieldSize.height = parseInt(event.target.value);
    field.style.height = `${fieldSize.height}px`;
});
unitWidthInput.addEventListener("change", (event) => {
    unitSize.width = parseInt(event.target.value);
    unit.style.width = `${unitSize.width}px`;
});
unitHeightInput.addEventListener("change", (event) => {
    unitSize.height = parseInt(event.target.value);
    unit.style.height = `${unitSize.height}px`;
});


const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
};

// const transitions = {
//     horizontal: {
//         enabled: false,
//         duration: 0,
//         toString() { return `left ${this.duration}s linear` }
//     },
//     vertical: {
//         enabled: false,
//         duration: 0,
//         toString() { return `top ${this.duration}s linear` }
//     },
//     toString() { return (
//         [
//             this.horizontal.enabled ? this.horizontal.toString() : undefined,
//             this.vertical.enabled ? this.vertical.toString() : undefined
//         ]
//         .filter(entry => entry !== undefined)
//         .join(", ")
//     )}
// }

let interval = null;

const position = {
    left: 0,
    top: 0
}

unit.style.left = `${position.left}px`;
unit.style.top = `${position.top}px`;

addEventListener("keydown", (event) => {
    if (event.repeat) return;
    switch (event.code) {
        case "ArrowUp":
            inputs.up = true;
            break;
        case "ArrowDown":
            inputs.down = true;
            break;
        case "ArrowLeft":
            inputs.left = true;
            break;
        case "ArrowRight":
            inputs.right = true;
            break;
        default:
            break;
    }
    highlight();
    move();
});

addEventListener("keyup", (event) => {
    switch (event.code) {
        case "ArrowUp":
            inputs.up = false;
            break;
        case "ArrowDown":
            inputs.down = false;
            break;
        case "ArrowLeft":
            inputs.left = false;
            break;
        case "ArrowRight":
            inputs.right = false;
            break;
        default:
            break;
    }
    highlight();
    move();
})


function move() {

    clearInterval(interval);

    let horizontal, vertical;

    if (inputs.up === inputs.down) {
        vertical = 0;
    }
    else if (inputs.up) {
        vertical = -1;
    }
    else if (inputs.down) {
        vertical = 1;
    }

    if (inputs.left === inputs.right) {
        horizontal = 0;
    }
    else if (inputs.left) {
        horizontal = -1;
    }
    else if (inputs.right) {
        horizontal = 1;
    }

    if (vertical === 0 && horizontal === 0) return;

    interval = setInterval(() => {

        const topLimit = fieldSize.height - unitSize.height;
        const leftLimit = fieldSize.width - unitSize.width;

        const noVerticalMoving = (
            vertical === 0
            || (vertical === -1 && position.top === 0)
            || (vertical === 1 && position.top === topLimit)
        );
        const noHorizontalMoving = (
            horizontal === 0
            || (horizontal === -1 && position.left === 0)
            || (horizontal === 1 && position.left === leftLimit)
        )

        if (noVerticalMoving && noHorizontalMoving) {
            clearInterval(interval);
            return;
        }

        let top = position.top + (vertical * speed / frames);
        let left = position.left + (horizontal * speed / frames);

        if (top < 0) top = 0;
        if (topLimit < top) top = topLimit;
        if (left < 0) left = 0;
        if (leftLimit < left) left = leftLimit;

        position.top = top;
        position.left = left;

        unit.style.top = `${top}px`;
        unit.style.left = `${left}px`;
    },
    1000 / frames)
}




// function move() {

//     let top, left;

//     if (inputs.up === inputs.down) {
//         transitions.vertical.enabled = false
//         top = unit.offsetTop;
//     }
//     else {
//         transitions.vertical.enabled = true;
//         if (inputs.up) {
//             top = 0;
//         }
//         if (inputs.down) {
//             top = field.offsetHeight - unit.offsetHeight;
//         }
//         const distance = Math.abs(top - unit.offsetTop);
//         transitions.vertical.duration = distance / speed;
//     }

//     if (inputs.left === inputs.right) {
//         transitions.horizontal.enabled = false
//         left = unit.offsetLeft;
//     }
//     else {
//         transitions.horizontal.enabled = true;
//         if (inputs.left) {
//             left = 0;
//         }
//         if (inputs.right) {
//             left = field.offsetWidth - unit.offsetWidth;
//         }
//         const distance = Math.abs(left - unit.offsetLeft);
//         transitions.horizontal.duration = distance / speed;
//     }

//     unit.style.transition = transitions.toString();
//     unit.style.top = `${top}px`;
//     unit.style.left = `${left}px`;
// }

function highlight() {
    if (unit.classList.contains("up") !== inputs.up)
        unit.classList.toggle("up");
    if (unit.classList.contains("down") !== inputs.down)
        unit.classList.toggle("down");
    if (unit.classList.contains("left") !== inputs.left)
        unit.classList.toggle("left");
    if (unit.classList.contains("right") !== inputs.right)
        unit.classList.toggle("right");
}




// const first = document.getElementById("first");
// const second = document.getElementById("second");
// const third = document.getElementById("third");
// const forth = document.getElementById("forth");
// const testButton = document.getElementById("test-button");

// testButton.addEventListener("click", () => {
//     setInterval(() => {
//         first.style.left = `${first.offsetLeft + 0.5}px`;
//         second.style.left = `${second.offsetLeft + 1}px`;
//         third.style.left = `${third.offsetLeft + 1.5}px`;
//         forth.style.left = `${forth.offsetLeft + 2}px`;
//     }, 500);
// })
