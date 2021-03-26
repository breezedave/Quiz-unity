window.getTitle = (name, val) => {
    return `Choose any combination of these ${name}. The closest total to ${val} without going over wins. You can only choose one of each product.`;
};

fetch("./Shopping.json")
.then(response => response.json())
.then(vals => {
    window.vals = vals;
    window.showAmazon()
});

window.showTesco = () => {
    window.currObj = "tesco";
    window.createObjs();
    window.createTitle("Tesco products", "£10");
};

window.showMiller = () => {
    window.currObj = "miller";
    window.createObjs();
    window.createTitle("Miller & Carter (Worcester) menu items", "£25");
};

window.showAmazon = () => {
    window.currObj = "amazon";
    window.createObjs();
    window.createTitle("Amazon products", "£50")
};

window.showCars = () => {
    window.currObj = "cars";
    window.createObjs();
    window.createTitle("New cars (from AutoTrader)", "£100,000");
};

window.showLondon = () => {
    window.currObj = "london";
    window.createObjs();
    window.createTitle("London Houses", "£5,000,000");
};

window.createObjs = () => {
    document.querySelector("#root").innerHTML = "";
    const objs = window.vals[window.currObj];

    objs.forEach((obj, i) => {
        const domObj = window.createObj(obj, i);

        document.querySelector("#root").appendChild(domObj);
    });
}

window.createObj = (obj, i) => {
    const hold = document.createElement("div");
    const nameObj = document.createElement("div");
    const imgHold = document.createElement("div");

    hold.className = "hold " + "pos" + i;
    nameObj.className ="name";
    nameObj.innerHTML = obj.name;
    imgHold.className = "imgHold";
    imgHold.style.backgroundImage = `url(${"./img/" + obj.img})`;

    hold.appendChild(nameObj);
    hold.appendChild(imgHold);
    
    return hold;
}

window.createTitle = (txt, val) => {
    const title = document.createElement("div");
    title.className = "title";
    const titleTxt = window.getTitle(txt, val);
    title.innerHTML = titleTxt;
    document.querySelector("#root").appendChild(title);
}
