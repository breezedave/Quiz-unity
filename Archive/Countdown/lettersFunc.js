window.selectedLetters = [];
window.dict = {};

const AudioContext = window.AudioContext
    || window.webkitAudioContext
    || false;

const context = new AudioContext();
let consonantBag = ["B","B","C","C","C","D","D","D","D","D","D","F","F","G","G","G","H","H","J","K","L","L","L","L","L","M","M","M","M","N","N","N","N","N","N","N","N","P","P","P","P","Q","R","R","R","R","R","R","R","R","R","S","S","S","S","S","S","S","S","S","T","T","T","T","T","T","T","T","T","V","W","X","Y","Z",];
let vowelBag = ["A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","I","I","I","I","I","I","I","I","I","I","I","I","I","O","O","O","O","O","O","O","O","O","O","O","O","O","U","U","U","U","U",];
let permArr = [];
let usedChars = [];

const fillDict = () => {
    fetch("dict.txt")
    .then(response => response.text())
    .then(response => response.split("\n"))
    .then(words => words.map(word => word.replace(String.fromCharCode(13), "")))
    .then(words => words.forEach(word => {
        window.dict[word] = true;
    }));
}

const addAConsonant = () => {
    if(window.selectedLetters.length >= 9) return;

    const pos = parseInt(Math.random() * 1000) % consonantBag.length
    const letter = consonantBag.splice(pos, 1)[0];

    window.selectedLetters.push(letter);
}

const addAVowel = () => {
    if(window.selectedLetters.length >= 9) return;

    const pos = parseInt(Math.random() * 1000) % vowelBag.length
    const letter = vowelBag.splice(pos, 1)[0];

    window.selectedLetters.push(letter);
}

const startGame = () => {
    if(window.selectedLetters.length >= 9 && !window.gameStarted) {
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
    solve();
}

const solve = () => {
    const potentialWords = permute(window.selectedLetters);
    window.foundWords = {};

    for(let i = window.selectedLetters.length; i > 0; i -= 1) {
        for(let x = 0; x < potentialWords.length; x += 1) {
            const word = potentialWords[x].slice(0, i).join("");
            if(window.dict[word]) {
                window.foundWords[word] = true;
                if(Object.keys(foundWords).length === 6) return;
            }
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

document.querySelector("#vowel").addEventListener("click", () => {addAVowel()});
document.querySelector("#consonant").addEventListener("click", () => {addAConsonant()});
document.querySelector("#start").addEventListener("click", () => {startGame()});
document.querySelector("#solve").addEventListener("click", () => {showSolution()});
document.querySelector("#newGame").addEventListener("click", () => {newGame()});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "v":
        addAVowel()
        break;
        case "c":
        addAConsonant();
        break;
        case " ":
        startGame()
        break;
        case "x":
        showSolution();
        break;
    }
});

fillDict();
