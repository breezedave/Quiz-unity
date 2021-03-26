window.selectedLetters = [];
window.dict = {};
window.pauseTime = 0;

const AudioContext = window.AudioContext
    || window.webkitAudioContext
    || false;

const context = new AudioContext();
const context2 = new AudioContext();
let consonantBag = ["B","B","C","C","C","D","D","D","D","D","D","F","F","G","G","G","H","H","J","K","L","L","L","L","L","M","M","M","M","N","N","N","N","N","N","N","N","P","P","P","P","Q","R","R","R","R","R","R","R","R","R","S","S","S","S","S","S","S","S","S","T","T","T","T","T","T","T","T","T","V","W","X","Y","Z",];
let vowelBag = ["A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","I","I","I","I","I","I","I","I","I","I","I","I","I","O","O","O","O","O","O","O","O","O","O","O","O","O","U","U","U","U","U",];
let permArr = [];
let usedChars = [];

const fillDict = () => {
    fetch("conundrumDict.txt")
    .then(response => response.text())
    .then(response => response.split("\n"))
    .then(words => words.map(word => word.replace(String.fromCharCode(13), "")))
    .then(words => words.filter(word => word.length === 9))
    .then(words => words.forEach(word => {
        window.dict[word] = true;
    }))
    .then(() => {
        chooseWord();
    })
}

const chooseWord = () => {
    const word = Object.keys(window.dict)[parseInt(Math.random() * 100000)%Object.keys(window.dict).length];
    checkUnique(word);
    if(Object.keys(window.foundWords).length !== 1) {
        window.potentialWords = {};
        window.foundWords = {}
        permArr = [];
        usedChars = [];
        return chooseWord();
    } else {
        window.target = word;
    }
}

const solve = () => {
    window.selectedLetters = window.target.split("");
    window.solved = true;
}

const checkAnswer = () => {
    if(document.querySelector("#guess").value.toUpperCase() === window.target.toUpperCase()) {
        solve();
    } else {
        try {
            playBuzzer();
        } catch(err) {
            alert("Incorrect");
        }
    }
}

const pause = () => {
    if(window.paused) return;
    window.pauseTime += (new Date().getTime() - window.currTime);
    window.running= false;
    window.paused = true;
    window.themeSource.stop();
}

const resume = () => {
    window.paused = false;
    window.currTime = new Date().getTime();
    playTheme(window.pauseTime / 1000);
}

const displayLetters = () => {
    window.selectedLetters = window.target
        .split("")
        .sort((a,b) => Math.random() - Math.random());
}

const startGame = () => {
    if(window.running || window.solved) return;
    window.running = true;
    if(window.paused) return resume();
    displayLetters();
    try {
        playTheme();
    } catch (err) {}
    window.gameStarted = true;
    window.currTime = new Date().getTime();
}

const newGame = () => {
    location.href = location.href;
}

const getTheme = () => {
    const URL = 'Countdown.mp3';

    window.fetch(URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(arrayBuffer => window.themeBuffer = arrayBuffer);
}
getTheme();

const playTheme = (ts) => {
    window.themeSource = context.createBufferSource();
    window.themeSource.buffer = themeBuffer;
    window.themeSource.connect(context.destination);
        window.themeSource.start(0, ts || 0);
}

const getBuzzer = () => {
    const URL = "Buzzer.mp3";

    window.fetch(URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(arrayBuffer => window.buzzerBuffer = arrayBuffer);
}
getBuzzer();

const playBuzzer = () => {
    const source = context.createBufferSource();
    source.buffer = buzzerBuffer;
    source.connect(context.destination);
    source.start();
}

const checkUnique = (word) => {
    const letters = word.split("");
    const potentialWords = permute(letters);
    window.foundWords = {};

    for(let x = 0; x < potentialWords.length; x += 1) {
        const word = potentialWords[x].slice(0, 9).join("");
        if(window.dict[word]) {
            window.foundWords[word] = true;
        }
    }
}

function permute(input) {
  let i;
  let ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};

document.querySelector("#start").addEventListener("click", () => {startGame()});
document.querySelector("#pause").addEventListener("click", () => {pause()});
document.querySelector("#solve").addEventListener("click", () => {solve()});
document.querySelector("#newGame").addEventListener("click", () => {newGame()});
document.querySelector("#checkAnswer").addEventListener("click", () => {checkAnswer()});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case " ":
        startGame();
        break;
    }
});

fillDict();
