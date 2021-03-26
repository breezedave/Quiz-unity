window.conDict = {};

let permArr = [];
let usedChars = [];

const fillConundrumDict = () => {
    fetch("conundrumDict.txt")
    .then(response => response.text())
    .then(response => response.split("\n"))
    .then(words => words.map(word => word.replace(String.fromCharCode(13), "")))
    .then(words => words.filter(word => word.length === 9))
    .then(words => words.forEach(word => {
        window.conDict[word] = true;
    }))
}

window.chooseConundrum = () => {
    const word = Object.keys(window.conDict)[parseInt(Math.random() * 100000)%Object.keys(window.conDict).length];
    checkUnique(word);
    if(Object.keys(window.foundWords).length !== 1) {
        window.potentialWords = {};
        window.foundWords = {}
        permArr = [];
        usedChars = [];
        return window.chooseConundrum();
    } else {
        window.conundrum = word.split("");
        window.conundrumLetters = word
            .split("")
            .sort((a,b) => Math.random() - Math.random());
    }
}

const checkUnique = (word) => {
    const letters = word.split("");
    const potentialWords = conundrumPermute(letters);
    window.foundWords = {};

    for(let x = 0; x < potentialWords.length; x += 1) {
        const word = potentialWords[x].slice(0, 9).join("");
        if(window.conDict[word]) {
            window.foundWords[word] = true;
        }
    }
}

function conundrumPermute(input) {
  let i;
  let ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    conundrumPermute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};

fillConundrumDict();
