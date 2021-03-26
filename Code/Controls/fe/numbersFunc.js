window.resetNumbers = () => {
    window.selectedNumbers = [];
    window.prettySolution = false;

    window.largeBag = [25, 50, 75, 100,];
    window.smallBag = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,];
    window.challenges = [];
    window.numbers = [];

}
window.resetNumbers();


window.addABig = () => {
    if(window.selectedNumbers.length >= 6 || window.largeBag.length <= 0) return;

    const pos = parseInt(Math.random() * 1000) % window.largeBag.length
    const number = window.largeBag.splice(pos, 1)[0];

    window.selectedNumbers.push(number);

    if(window.selectedNumbers.length === 6) {
       window.target = parseInt(Math.random()* 899 + 100);
       window.showSolution();
       return;
    }
}

window.addASmall = () => {
    if(window.selectedNumbers.length >= 6) return;

    const pos = parseInt(Math.random() * 1000) % window.smallBag.length
    const number = window.smallBag.splice(pos, 1)[0];

    window.selectedNumbers.push(number);

    if(window.selectedNumbers.length === 6) {
       window.target = parseInt(Math.random()* 899 + 100);
       window.showSolution();
       return;
    }
}


window.showSolution = () => {
    window.numbers = window.selectedNumbers.map((num, i) => { return {val: num, id: i}});
    numSolve();
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

const numSolve = () => {
    for(let i = 0; i < window.numbers.length; i += 1) {
        const firstNum = window.numbers[i];
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
    const remaining = window.numbers.filter(_ => challenge.used.map(u => u.id).indexOf(_.id) < 0);

    for(let i = 0; i < remaining.length; i += 1) {
            const num = remaining[i];

            attemptAddition(challenge, num);
            attemptDivision(challenge, num);
            attemptSubtraction(challenge, num);
            attemptMultiplication(challenge, num);
    }
};

const findClosest = () => {
    const results = window.challenges.sort((a, b) => {
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

    window.challenges.push(challenge);
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
