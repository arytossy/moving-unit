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
    startInterval();
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


let interval = null;

function startInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
        move();
    }, 1000 / frames);
}


const inputs = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

const position = {
    left: 0,
    top: 0
}

unit.style.left = `${position.left}px`;
unit.style.top = `${position.top}px`;

addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (inputs[event.code] !== undefined) {
        inputs[event.code] = true;
    }
    highlight();
});

addEventListener("keyup", (event) => {
    if (inputs[event.code] !== undefined) {
        inputs[event.code] = false;
    }
    highlight();
})


function move() {

    let horizontal, vertical;

    if (inputs.ArrowUp === inputs.ArrowDown) {
        vertical = 0;
    }
    else if (inputs.ArrowUp) {
        vertical = -1;
    }
    else if (inputs.ArrowDown) {
        vertical = 1;
    }

    if (inputs.ArrowLeft === inputs.ArrowRight) {
        horizontal = 0;
    }
    else if (inputs.ArrowLeft) {
        horizontal = -1;
    }
    else if (inputs.ArrowRight) {
        horizontal = 1;
    }

    if (vertical === 0 && horizontal === 0) return;

    if (vertical !== 0 && horizontal !== 0) {
        // vertical /= Math.sqrt(2);
        // horizontal /= Math.sqrt(2);
        vertical *= Math.sin(Math.PI/4);
        horizontal *= Math.cos(Math.PI/4);
    }

    const topLimit = fieldSize.height - unitSize.height;
    const leftLimit = fieldSize.width - unitSize.width;

    let top = position.top + (vertical * speed / frames);
    let left = position.left + (horizontal * speed / frames);

    if (top < 0) top = 0;
    if (topLimit < top) top = topLimit;
    if (left < 0) left = 0;
    if (leftLimit < left) left = leftLimit;

    if (position.top === top && position.left === left) return;

    position.top = top;
    position.left = left;

    unit.style.top = `${top}px`;
    unit.style.left = `${left}px`;
}

function highlight() {
    if (unit.classList.contains("up") !== inputs.ArrowUp)
        unit.classList.toggle("up");
    if (unit.classList.contains("down") !== inputs.ArrowDown)
        unit.classList.toggle("down");
    if (unit.classList.contains("left") !== inputs.ArrowLeft)
        unit.classList.toggle("left");
    if (unit.classList.contains("right") !== inputs.ArrowRight)
        unit.classList.toggle("right");
}


startInterval();
