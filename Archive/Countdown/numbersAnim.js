

const animate = () => {
    canv.width = canv.width;

    ctx.drawImage(bg, 0, 0, 1600, 900);

    const clockTime = Math.min(window.currTime? (new Date().getTime() - window.currTime) / 1000: 0, 30);

    drawRotated(ctx, arrowBack, 800, 276, clockTime / 30 * 180 + 180 );
    drawRotated(ctx, arrow, 800, 276, clockTime / 30 * 180);

    for(i = 0; i < window.selectedNumbers.length; i += 1) {
        const offsetX  = 325;
        const offsetY  = 830;
        const paddingX = 20;
        const width = 140;
        const height = 110;

        ctx.fillStyle = "white";
        ctx.font = "bold 76px arial";
        ctx.textAlign = "center";
        ctx.fillText(window.selectedNumbers[i], i * (width + paddingX) + (offsetX + width /2), offsetY);
    }

    if(window.selectedNumbers.length >= 6) {
        ctx.fillStyle = "#bdda2a";
        ctx.font = "160px digital-7_monomono";
        ctx.textAlign = "center";

        let str = String(window.target);
        let displayed = str[0] + " " + str[1] + " " + str[2];

        ctx.fillText(displayed, 800, 680);
    }

    if(window.prettySolution) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#2b4380";
        ctx.lineWidth = 6;
        ctx.fillRect(1120, 40, 420, 420);
        ctx.strokeRect(1120, 40, 420, 420);

        ctx.fillStyle = "#333";
        ctx.font = "bold 48px arial";
        ctx.textAlign = "left";

        const lines = window.prettySolution.split("\n");
        for(let i = 0; i < lines.length; i += 1) {
            ctx.fillText(lines[i], 1150, 100 + i * 60);
        }
    }

    window.requestAnimationFrame(animate);
}

const createArrow = () => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 240;
    canv.height = 40;

    ctx.drawImage(createCircle("#7f796d", 20), -20, 0);
    ctx.fillStyle = "#7f796d";

    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(240, 20);
    ctx.lineTo(0, 35);
    ctx.fill();

    ctx.drawImage(createCircle("#1f4784", 12), -12, 8);
    ctx.fillStyle = "#1f4784";

    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(160, 20);
    ctx.lineTo(0, 28);
    ctx.fill();

    return canv;
}
const createArrowBack = () => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 240;
    canv.height = 40;

    ctx.drawImage(createCircle("#7f796d", 20), -20, 0);
    ctx.drawImage(createCircle("#1f4784", 12), -12, 8);
    return canv;
}

const createCircle = (color, r) => {
        const canv = document.createElement("canvas");
        const ctx = canv.getContext("2d");

        canv.width = r*2;
        canv.height = r*2;
        ctx.fillStyle = color;

        const x = canv.width / 2;
        const y = canv.height / 2;
        const radius = r;
        const startAngle = 0 * Math.PI;
        const endAngle = 2 * Math.PI;
        const counterClockwise = false;

        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);

        ctx.fillStyle = color;
        ctx.fill();

        return canv;
}

const createCrossPart = () => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 240;
    canv.height = 8;

    ctx.fillStyle = "rgba(59, 56, 56, .1)";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "#3b3838";
    ctx.fillRect(0, 0, canv.width, canv.height - 2);

    return canv;
}

const createMajorMark = () => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 220;
    canv.height = 12;

    ctx.fillStyle = "#3b3838";
    ctx.fillRect(180, 0, 40, canv.height);

    return canv;
}

const createMinorMark = () => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 250;
    canv.height = 20;

    const r = 3;
    const circle = createCircle("white", r);
    ctx.drawImage(circle, 242, 6);

    return canv;
}

const drawRotated = (ctx2, img, x, y, d) => {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = parseInt((img.width ** 2 + img.height ** 2) ** .5 * 2);
    canv.height = parseInt((img.width ** 2 + img.height ** 2) ** .5 * 2);

    ctx.save();
    ctx.translate(canv.width / 2, canv.height / 2);
    ctx.rotate((d - 90) * Math.PI / 180);
    ctx.drawImage(img, 0, 0 - img.height / 2);
    ctx.restore();
    ctx2.drawImage(canv, x - canv.width / 2, y - canv.height / 2);
}

const drawBg = function() {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");

    canv.width = 1600;
    canv.height = 900;

    //bg
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1600, 900);

    //table
    ctx.strokeStyle = "#2b4380";
    ctx.fillStyle = "#4472C4";
    ctx.lineWidth = 6;
    ctx.fillRect(3, 550, 1594, 347);
    ctx.strokeRect(3, 550, 1594, 347);

    ctx.fillStyle = "#589cc7";
    ctx.fillRect(280, 710, 1040, 177);
    ctx.strokeRect(280, 710, 1040, 177);

    ctx.fillStyle = "#333";
    ctx.fillRect(600, 560, 400, 140);
    ctx.strokeRect(600, 560, 400, 140);

    //letters
    ctx.fillStyle = "#14165f";
    for( let i = 0; i < 6; i += 1) {
        const offsetX  = 326;
        const offsetY  = 730;
        const paddingX = 20;
        const width = 140;
        const height = 140;
        ctx.fillRect(i * (width + paddingX) + offsetX, offsetY, width, height);
    }

    //clockCircles
    let r = 260;
    let circle = createCircle("#7f7f7f", r);
    ctx.drawImage(circle, canv.width /2 - r, 276 - r);

    r = 250;
    circle = createCircle("#225167", r);
    ctx.drawImage(circle, canv.width /2 - r, 276 - r);

    r = 240;
    circle = createCircle("#fbfaca", r);
    ctx.drawImage(circle, canv.width /2 - r, 276 - r);

    //clockCross
    const crossPart = createCrossPart();
    for( let i = 0; i < 4; i += 1) drawRotated(ctx, crossPart, 800, 276, 360 / 4 * i)

    //majorMarks
    const majorMark = createMajorMark()
    for( let i = 0; i < 12; i += 1) {
        if(i%3 !== 0) drawRotated(ctx, majorMark, 800, 276, 360 / 12 * i)
    }

    //minorMarks
    const minorMark = createMinorMark()
    for( let i = 0; i < 60; i += 1) {
        drawRotated(ctx, minorMark, 800, 276, 360 / 60 * i)
    }

    r = 10;
    circle = createCircle("#fbfaca", r);
    ctx.drawImage(circle, canv.width /2 - r, 276 - r);


    ctx.fillStyle = "#333";
    ctx.font = "bold 48px arial";
    ctx.textAlign = "left";
    ctx.fillText("BIG", 10, 100);
    ctx.fillText("SMALL", 10, 180);
    ctx.fillText("START", 10, 260);
    ctx.fillText("SOLVE", 10, 340);
    ctx.fillText("NEW GAME", 10, 420);
    return canv;
}

const canv = document.querySelector("#canvas");
const ctx = canv.getContext("2d");

canv.width = 1600
canv.height = 900;

// Create gradient
var grd = ctx.createLinearGradient(0, 0, 1600, 0);
grd.addColorStop(0, "#8eaee2");
grd.addColorStop(.5, "#dae4f5");
grd.addColorStop(1, "#8eaee2");

const arrowBack = createArrowBack();
const arrow = createArrow();
const bg = drawBg();
animate();
