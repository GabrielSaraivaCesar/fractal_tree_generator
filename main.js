
const logo = {
    double: true,
    minAngle: 120,
    maxAngle: 121,
    size: 30,
    sizeDivider: 1.2,
    targetDepth: 5,
    yStart: window.innerHeight/2,
}

const logoLoading = {
    double: true,
    minAngle: 90,
    maxAngle: 130,
    size: 30,
    sizeDivider: 1.2,
    targetDepth: 5,
    yStart: window.innerHeight/2,
}

const tree = {
    double: false,
    minAngle: 0,
    maxAngle: 360,
    size: 300,
    sizeDivider: 1.5,
    targetDepth: 10,
    yStart: window.innerHeight,
}

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
var strokeColor = "#42f5ad"

function setCanvasResolution() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasResolution();
window.addEventListener('resize', setCanvasResolution);




/**
 * @param {{x: number, y: number}} position 
 * @param {number} angle
 * @param {number} angleIncrease
 * @param {number} size
 * @param {number} sizeDivider
 * @param {number} depth
 * @param {number} targetDepth
 * @param {boolean} upwards
 * @param {{upwards: boolean, lineWidth: number, shadowBlur: number}} config
 */
function makeFractalTree(position, angle, angleIncrease, size, sizeDivider, depth, targetDepth, config) {
    let radians = angle * Math.PI / 180;
    let newPosition = {
        x: 0,
        y: 0,
    }
    newPosition.x = position.x + Math.sin(radians) * size;
    newPosition.y = position.y - Math.cos(radians) * size;

    ctx.lineWidth=config.lineWidth||0.6;
    ctx.shadowColor=strokeColor
    ctx.shadowBlur=config.shadowBlur||10
    ctx.strokeStyle = strokeColor
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(newPosition.x, newPosition.y);
    ctx.stroke();
    ctx.closePath();

    if (depth < targetDepth) {
        makeFractalTree(newPosition, angle + angleIncrease, angleIncrease, size / sizeDivider, sizeDivider, depth + 1, targetDepth, config);
        makeFractalTree(newPosition, angle - angleIncrease, angleIncrease, size / sizeDivider, sizeDivider, depth + 1, targetDepth, config);
    }
}


function clear() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
}


var interval = null;

const config = tree
var angleOffset = config.minAngle;
var valueChanged = true;
var animationOn = false;

function onValueChange() {
    valueChanged = true;
}

function playAnimation() {
    valueChanged = true;
    let btn = document.getElementById("animation-btn");
    if (!animationOn) {
        animationOn = true;
        angleOffset = Math.round(angleOffset);
        btn.innerText = "Stop Animation";
        document.querySelector("input[name=angleOffset]").setAttribute("disabled", true);
        document.querySelector("input[name=startAngle]").setAttribute("disabled", true);
    } else {
        animationOn = false;
        btn.innerText = "Play Animation";
        document.querySelector("input[name=angleOffset]").removeAttribute("disabled");
        document.querySelector("input[name=startAngle]").removeAttribute("disabled");
    }
}

interval = setInterval(() => {
    if (!valueChanged && !animationOn) {
        return;
    }
    valueChanged = false;

    

    clear();

    let size = parseFloat(document.querySelector("input[name=size]").value);
    let sizeDivider = parseFloat(document.querySelector("input[name=sizeDivider]").value);
    let targetDepth = parseFloat(document.querySelector("input[name=targetDepth]").value);
    angleOffset =  parseFloat(document.querySelector("input[name=angleOffset]").value);
    let fractalAmount =  parseFloat(document.querySelector("input[name=fractalAmount]").value);
    let startAngle =  parseFloat(document.querySelector("input[name=startAngle]").value);

    if (animationOn) {
        angleOffset++;
    
        if (angleOffset === 360) {
            angleOffset = 0
        } 
        startAngle = angleOffset-180;
        document.querySelector("input[name=angleOffset]").value = angleOffset;
        document.querySelector("input[name=startAngle]").value = startAngle;
    }

    let yStart = canvas.height/2;


    for (let i = 1; i <= fractalAmount; i++) {
        makeFractalTree({x: canvas.width/2, y: yStart}, (i/fractalAmount*360)-360+startAngle, angleOffset, size, sizeDivider, 0, targetDepth, config);
    }
    
}, 20)

