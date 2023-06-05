const field = document.getElementById("field");
const unit = document.getElementById("unit");
const speedInput = document.getElementById("speed");
const framesInput = document.getElementById("frames");
const fieldWidthInput = document.getElementById("field-width");
const fieldHeightInput = document.getElementById("field-height");
const unitWidthInput = document.getElementById("unit-width");
const unitHeightInput = document.getElementById("unit-height");
const accelerationInput = document.getElementById("acceleration");
const decelerationInput = document.getElementById("deceleration");

// px per second
let speed = 300

// frames per second
let frames = 70

// px
const fieldSize = {
    width: 400,
    height: 600
}

// px
const unitSize = {
    width: 30,
    height: 30
}

// (px per second) per second
let acceleration = 500;
let deceleration = 500;

speedInput.value = speed;
framesInput.value = frames;
fieldWidthInput.value = fieldSize.width;
fieldHeightInput.value = fieldSize.height;
unitWidthInput.value = unitSize.width;
unitHeightInput.value = unitSize.height;
accelerationInput.value = acceleration;
decelerationInput.value = deceleration;

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
accelerationInput.addEventListener("change", (event) => {
    acceleration = parseInt(event.target.value);
});
decelerationInput.addEventListener("change", (event) => {
    deceleration = parseInt(event.target.value);
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


// px per second
const velocity = {
    vertical: 0,
    horizontal: 0
}

function move() {

    // 十字キーの入力状況をもとに、
    // 垂直軸、水平軸に対する、それぞれの方向付けと重み付け。
    let horizontal, vertical;

    // 方向付け。
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

    // 重みの調整。
    if (vertical !== 0 && horizontal !== 0) {
        // vertical /= Math.sqrt(2);
        // horizontal /= Math.sqrt(2);
        vertical *= Math.sin(Math.PI/4);
        horizontal *= Math.cos(Math.PI/4);
    }

    // 速度の目標値を決定する。
    const verticalVelocityTarget = speed * vertical;
    const horizontalVelocityTarget = speed * horizontal;

    // 速度を変化させる。
    changeVelocity(verticalVelocityTarget, "vertical");
    changeVelocity(horizontalVelocityTarget, "horizontal");

    const topLimit = fieldSize.height - unitSize.height;
    const leftLimit = fieldSize.width - unitSize.width;

    let top = position.top + (velocity.vertical / frames);
    let left = position.left + (velocity.horizontal / frames);

    if (top < 0 || topLimit < top) {
        velocity.vertical = 0;
        if (top < 0) top = 0;
        if (topLimit < top) top = topLimit;
    }
    if (left < 0 || leftLimit < left) {
        velocity.horizontal = 0;
        if (left < 0) left = 0;
        if (leftLimit < left) left = leftLimit;
    }

    position.top = top;
    position.left = left;

    unit.style.top = `${top}px`;
    unit.style.left = `${left}px`;
}

/**
 * @param {number} target
 * @param {"vertical"|"horizontal"} axis
 */
function changeVelocity(target, axis) {

    if (target === velocity[axis]) return;

    // 速度に変化がある場合。
    else {

        // 速度の目標値が0 = 慣性で動く場合。
        if (target === 0) {
            velocity[axis] = decelerate(velocity[axis], target);
        }

        // 止まっている状態から動き出す場合。
        else if (velocity[axis] === 0) {
            velocity[axis] = accelerate(velocity[axis], target);
        }

        // 現在動いている方向とこれから動こうとしている方向が同じ場合。
        else if (Math.sign(target) === Math.sign(velocity[axis])) {

            // 現在より速度が上がる場合。
            if (Math.abs(velocity[axis]) < Math.abs(target)) {
                velocity[axis] = accelerate(velocity[axis], target);
            }

            // 現在より速度が下がる場合。
            else {
                velocity[axis] = decelerate(velocity[axis], target);
            }
        }

        // 現在動いている方向とこれから動こうとしている方向が逆の場合。
        else {

            let tmp = velocity[axis];

            tmp = decelerate(tmp, 0);
            tmp = accelerate(tmp, target);

            velocity[axis] = tmp;
        }
    }
}

/**
 * @param {number} from
 * @param {number} to
 */
function decelerate(from, to) {
    const gap = Math.abs(to - from);
    const decelerationPerFrame = deceleration / frames;
    if (gap < decelerationPerFrame) {
        return to;
    } else {
        return Math.sign(from) * (Math.abs(from) - decelerationPerFrame);
    }
}

/**
 * @param {number} from
 * @param {number} to
 */
function accelerate(from, to) {
    const gap = Math.abs(to - from);
    const accelerationPerFrame = acceleration / frames;
    if (gap < accelerationPerFrame) {
        return to;
    } else {
        return from + (Math.sign(to) * accelerationPerFrame);
    }
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
