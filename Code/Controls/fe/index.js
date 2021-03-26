window.sock = new WebSocket('ws://localhost:3100/');


document.querySelector("#control").addEventListener("click", () => {
    document.querySelector("#screen_control").className = "";
    document.querySelector("#screen_scores").className = "hidden";
    document.querySelector("#screen_countdown").className = "hidden";
});

document.querySelector("#scores").addEventListener("click", () => {
    document.querySelector("#screen_control").className = "hidden";
    document.querySelector("#screen_scores").className = "";
    document.querySelector("#screen_countdown").className = "hidden";
});

document.querySelector("#countdown").addEventListener("click", () => {
    document.querySelector("#screen_control").className = "hidden";
    document.querySelector("#screen_scores").className = "hidden";
    document.querySelector("#screen_countdown").className = "";
});

document.querySelector("#raise_screen").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "RaiseScreen",
        "message": "",
    }));
});

document.querySelector("#lower_screen").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "LowerScreen",
        "message": "",
    }));
});

document.querySelector("#send_to_screen").addEventListener("click", () => {
    const questionObj = document.querySelector('input[name="options"]:checked');
    const type =  questionObj.getAttribute("data-type");
    const fileName = questionObj.getAttribute("data-val");
    const ans = questionObj.getAttribute("data-answer");
    const question = questionObj.getAttribute("data-question");
    const answer = questionObj.getAttribute("data-answer");

    document.querySelector("#current_question").value = `${question}

${answer}
    `;

    window.sock.send(JSON.stringify({
        "method": "ShowOnScreen",
        "message": JSON.stringify(
            {
                type,
                fileName,
                question: question.toUpperCase(),
                answer: ans,
            }
        ),
    }));
});

document.querySelector("#clear_screen").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "ClearScreen",
        "message": "",
    }));
})

document.querySelector("#raise_countdown").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "RaiseCountdown",
        "message": "",
    }));
    window.prepForNewRound();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));
});

document.querySelector("#lower_countdown").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "LowerCountdown",
        "message": "",
    }));
    window.prepForNewRound();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));
});

document.querySelector("#add_consonant").addEventListener("click", () => {
    addAConsonant();
    updateCountdown();
    window.sock.send(JSON.stringify({
        "method": "CountdownLetters",
        "message": JSON.stringify(window.selectedLetters),
    }));
    showSolved();
});

document.querySelector("#add_vowel").addEventListener("click", () => {
    addAVowel();
    updateCountdown();
    window.sock.send(JSON.stringify({
        "method": "CountdownLetters",
        "message": JSON.stringify(window.selectedLetters),
    }));
    showSolved();
});

document.querySelector("#show_letters").addEventListener("click", () => {
    window.prepForNewRound();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));

    setTimeout(() => {
        window.sock.send(JSON.stringify({
            "method": "ShowLetters",
            "message": "",
        }));
    }, 100);
})

document.querySelector("#show_numbers").addEventListener("click", () => {
    window.prepForNewRound();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));

    setTimeout(() => {
        window.sock.send(JSON.stringify({
            "method": "ShowNumbers",
            "message": "",
        }));
    }, 100);
})

document.querySelector("#show_conundrum").addEventListener("click", () => {
    window.prepForNewRound();
    window.chooseConundrum();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));

    setTimeout(() => {
        window.sock.send(JSON.stringify({
            "method": "ShowLetters",
            "message": "",
        }));
    }, 100);

    for(let i = 0; i < 9; i += 1) {
        document.querySelector("#letter" + (i + 1)).innerHTML = window.conundrumLetters[i];
        document.querySelector("#letterA" + (i + 1)).innerHTML = window.conundrum[i];
    }
})

document.querySelector("#add_big_num").addEventListener("click", () => {
    addABig();
    updateCountdown();
    window.sock.send(JSON.stringify({
        "method": "CountdownNumbers",
        "message": JSON.stringify(window.selectedNumbers),
    }));
    if(window.target){
        window.sock.send(JSON.stringify({
            "method": "CountdownNumbersTarget",
            "message": JSON.stringify(String(window.target).split("")),
        }));
    }
});

document.querySelector("#add_small_num").addEventListener("click", () => {
    addASmall();
    updateCountdown();
    window.sock.send(JSON.stringify({
        "method": "CountdownNumbers",
        "message": JSON.stringify(window.selectedNumbers),
    }));
    if(window.target){
        window.sock.send(JSON.stringify({
            "method": "CountdownNumbersTarget",
            "message": JSON.stringify(String(window.target).split("")),
        }));
    }
});

document.querySelector("#clear_board").addEventListener("click", () => {

    window.prepForNewRound();
    window.sock.send(JSON.stringify({
        "method": "ClearCountdownBoard",
        "message": "",
    }));
});

document.querySelector("#show_answer").addEventListener("click", () => {
    window.sock.send(JSON.stringify({
        "method": "ShowLettersAnswer",
        "message": JSON.stringify(window.conundrum || window.largestFoundWord),
    }))
});

document.querySelector("#start_stop_countdown").addEventListener("click", () => {
    if(window.conundrumLetters) {
        window.sock.send(JSON.stringify({
            "method": "CountdownLetters",
            "message": JSON.stringify(window.conundrumLetters),
        }));
    }
    window.sock.send(JSON.stringify({
        "method": "ToggleClock",
        "message": "",
    }));
});

document.querySelector("#update_scores").addEventListener("click", () => {
    var playersObj = document.querySelectorAll("#screen_scores tr");
    var players = [];

    for(var i = 1; i < playersObj.length; i += 1) {
        var player = +playersObj[i].querySelector(".total").innerHTML;

        players.push(player);
    }
    window.sock.send(JSON.stringify({
        "method": "UpdateScore",
        "message": JSON.stringify(players),
    }));
})

window.prepForNewRound = () => {
    delete window.largestFoundWord;
    delete window.selectedLetters;
    delete window.largestFoundWord;
    delete window.foundWords;
    delete window.consonantBag;
    delete window.vowelBag;
    delete window.permArr;
    delete window.usedChars;

    delete window.selectedNumbers;
    delete window.conundrum;
    delete window.conundrumLetters;
    delete window.target;

    window.consonantBag = ["B","B","C","C","C","D","D","D","D","D","D","F","F","G","G","G","H","H","J","K","L","L","L","L","L","M","M","M","M","N","N","N","N","N","N","N","N","P","P","P","P","Q","R","R","R","R","R","R","R","R","R","S","S","S","S","S","S","S","S","S","T","T","T","T","T","T","T","T","T","V","W","X","Y","Z",];
    window.vowelBag = ["A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","I","I","I","I","I","I","I","I","I","I","I","I","I","O","O","O","O","O","O","O","O","O","O","O","O","O","U","U","U","U","U",];
    window.permArr = [];
    window.usedChars = [];
    window.foundWords = [];
    window.prettySolution = "";

    window.resetLetters();
    window.resetNumbers();

    for(let i = 0; i < 9; i += 1) {
        document.querySelector("#letter" + (i + 1)).innerHTML = "";
        document.querySelector("#letterA" + (i + 1)).innerHTML = "";
    }
    for(let i = 0; i < 6; i += 1) {
        document.querySelector("#number" + (i + 1)).innerHTML = "";
    }
    document.querySelector("#numberA").innerHTML = "";
    document.querySelector("#solution").innerHTML = "";
}

window.updateCountdown = () => {
    for(let i = 0; i < 9; i += 1) {
        document.querySelector("#letter" + (i + 1)).innerHTML = (window.selectedLetters && window.selectedLetters[i])? window.selectedLetters[i]: "";
    }
    for(let i = 0; i < 6; i += 1) {
        document.querySelector("#number" + (i + 1)).innerHTML = (window.selectedNumbers && window.selectedNumbers[i])? window.selectedNumbers[i]: "";
    }
    document.querySelector("#numberA").innerHTML = window.target || "";
    document.querySelector("#solution").innerHTML = window.prettySolution || "";
};

window.showSolved = () => {
    if(!window.largestFoundWord) return;
    for(let i = 0; i < 9; i += 1) {
        document.querySelector("#letterA" + (i +1)).innerHTML = window.largestFoundWord[i] || "";
    }
}



fetch("players.json")
.then(_ => _.json())
.then(_ => {
    _.players.forEach(player => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${player.name}</td>
            <td><input id="${player.id}_1" value=""/></td>
            <td><input id="${player.id}_2" value=""/></td>
            <td><input id="${player.id}_3" value=""/></td>
            <td><input id="${player.id}_4" value=""/></td>
            <td><input id="${player.id}_5" value=""/></td>
            <td><input id="${player.id}_6" value=""/></td>
            <td class="total" id="${player.id}_total">0</td>
        `;

        tr.id = player.id + "_row";

        document
        .querySelector("#screen_scores")
        .querySelector("tbody")
        .appendChild(tr);


        const inputs = document.querySelectorAll("#" + player.id + "_row input");

        for(let i = 0; i < inputs.length; i += 1) {
            let a = inputs[i];

            a.addEventListener("change", () => {
                let val = 0;

                let b = document.querySelectorAll("#" + player.id + "_row input");
                for(let i2 = 0; i2 < b.length; i2 += 1) {
                    let c = b[i2];

                    val += (+c.value);
                }

                document.querySelector("#" + player.id + "_total").innerHTML = val;
            });

        }

    });
});


fetch("quiz.json")
.then(_ => _.json())
.then(_ => {
    _.quiz.forEach(question => {
        const option = document.createElement("label");

        option.innerHTML = `
            <span>${question.round} - ${question.fileName}</span>
            <input
                data-round="${question.round}"
                data-type="${question.type}"
                data-val="${question.fileName}"
                data-answer="${question.answer}"
                data-question="${question.question}"
                name="options"
                type="radio"
            />
        `;
        option.className = "option";

        document.querySelector("#option_list").appendChild(option);
    });
});
