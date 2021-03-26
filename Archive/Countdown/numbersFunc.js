window.selectedNumbers = [];
window.target = parseInt(Math.random()* 899 + 100);
window.prettySolution = false;

const AudioContext = window.AudioContext
    || window.webkitAudioContext
    || false;

const context = new AudioContext();
let largeBag = [25, 50, 75, 100,];
let smallBag = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,];
let challenges = [];
let numbers = [];

const addABig = () => {
    if(window.selectedNumbers.length >= 6 || largeBag.length <= 0) return;

    const pos = parseInt(Math.random() * 1000) % largeBag.length
    const number = largeBag.splice(pos, 1)[0];

    window.selectedNumbers.push(number);
}

const addASmall = () => {
    if(window.selectedNumbers.length >= 6) return;

    const pos = parseInt(Math.random() * 1000) % smallBag.length
    const number = smallBag.splice(pos, 1)[0];

    window.selectedNumbers.push(number);
}

const startGame = () => {
    if(window.selectedNumbers.length >= 6 && !window.gameStarted) {
        try {
            playTheme(themeBuffer);
        } catch (err) {}
        window.gameStarted = true;
        window.currTime = new Date().getTime();
    }
}

const newGame = () => {
    location.href = location.href;
}

const getTheme = () => {
    const URL = 'Countdown.mp3';

    let themeBuffer;

    window.fetch(URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(arrayBuffer => window.themeBuffer = arrayBuffer);
}
getTheme();

const playTheme = () => {
    const source = context.createBufferSource();
    source.buffer = themeBuffer;
    source.connect(context.destination);
    source.start();
}

const showSolution = () => {
    if(Math.min(window.currTime? (new Date().getTime() - window.currTime) / 1000: 0, 30) < 30) return;
    numbers = window.selectedNumbers.map((num, i) => { return {val: num, id: i}});
    solve();
}

const prettifyActions = (actions) => {
    let str = String(actions[0]);
    let val = actions[0];
    for(let i = 1; i < actions.length; i += 2) {
        str += " " + actions[i] + " " + actions[i+1];
        val = eval(val + actions[i] + actions[i+1]);
        str += " = " + val + "\n" + val;
    }
    window.prettySolution = str;
}

const solve = () => {
    for(let i = 0; i < numbers.length; i += 1) {
        const firstNum = numbers[i];
        const challenge = {
            used: [firstNum],
            val: firstNum.val,
            action: [firstNum.val],
        }
        checkResult(challenge);
    }
    findClosest();
}

const nextStage = (challenge) => {
    const remaining = numbers.filter(_ => challenge.used.map(u => u.id).indexOf(_.id) < 0);

    for(let i = 0; i < remaining.length; i += 1) {
            const num = remaining[i];

            attemptAddition(challenge, num);
            attemptDivision(challenge, num);
            attemptSubtraction(challenge, num);
            attemptMultiplication(challenge, num);
    }
};

const findClosest = () => {
    const results = challenges.sort((a, b) => {
        const aDistFromTarget = Math.pow(Math.pow(a.val - window.target, 2), .5)
        const bDistFromTarget = Math.pow(Math.pow(b.val - window.target, 2), .5);

        if(aDistFromTarget - bDistFromTarget === 0) {
            return a.used.length - b.used.length;
        } else {
            return aDistFromTarget - bDistFromTarget;
        }
    });

    window.closest = results[0];

    prettifyActions(window.closest.action);

};

const checkResult = (challenge) => {
    if(parseInt(challenge.val) !== challenge.val) return;
    if(challenge.val < 0) return;

    challenges.push(challenge);
    if(challenge.val == window.target) {
        return;
    }
    nextStage(challenge);
};

const attemptAddition = (prevChallenge, number) => {
    const challenge = {
        used: [],
        val: prevChallenge.val,
        action: [],
    };
    for(let i = 0; i < prevChallenge.used.length; i += 1) challenge.used.push(prevChallenge.used[i]);
    for(let i = 0; i < prevChallenge.action.length; i += 1) challenge.action.push(prevChallenge.action[i]);

    challenge.used.push(number);
    challenge.action.push("+");
    challenge.action.push(number.val);
    challenge.val += number.val;

    checkResult(challenge);
};

const attemptSubtraction = (prevChallenge, number) => {
    const challenge = {
        used: [],
        val: prevChallenge.val,
        action: [],
    };
    for(let i = 0; i < prevChallenge.used.length; i += 1) challenge.used.push(prevChallenge.used[i]);
    for(let i = 0; i < prevChallenge.action.length; i += 1) challenge.action.push(prevChallenge.action[i]);

    challenge.used.push(number);
    challenge.action.push("-");
    challenge.action.push(number.val);
    challenge.val -= number.val;

    checkResult(challenge);
};

const attemptMultiplication = (prevChallenge, number) => {
    const challenge = {
        used: [],
        val: prevChallenge.val,
        action: [],
    };
    for(let i = 0; i < prevChallenge.used.length; i += 1) challenge.used.push(prevChallenge.used[i]);
    for(let i = 0; i < prevChallenge.action.length; i += 1) challenge.action.push(prevChallenge.action[i]);

    challenge.used.push(number);
    challenge.action.push("*");
    challenge.action.push(number.val);
    challenge.val *= number.val;

    checkResult(challenge);
};

const attemptDivision = (prevChallenge, number) => {
    const challenge = {
        used: [],
        val: prevChallenge.val,
        action: [],
    };
    for(let i = 0; i < prevChallenge.used.length; i += 1) challenge.used.push(prevChallenge.used[i]);
    for(let i = 0; i < prevChallenge.action.length; i += 1) challenge.action.push(prevChallenge.action[i]);

    challenge.used.push(number);
    challenge.action.push("/");
    challenge.action.push(number.val);
    challenge.val /= number.val;

    checkResult(challenge);
};


document.querySelector("#big").addEventListener("click", () => {addABig()});
document.querySelector("#small").addEventListener("click", () => {addASmall()});
document.querySelector("#start").addEventListener("click", () => {startGame()});
document.querySelector("#newGame").addEventListener("click", () => {newGame()});
document.querySelector("#solution").addEventListener("click", () => {showSolution()});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "b":
        addABig()
        break;
        case "s":
        addASmall();
        break;
        case " ":
        startGame()
        break;
        case "x":
        showSolution();
        break;
    }
});
