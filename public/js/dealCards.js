var cards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S",
"8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];

var playerHand = [];
var dealerHand = [];

function getRandomCard() {
    const index = Math.floor(Math.random() * cards.length);
    return cards.splice(index, 1)[0];
}

function calculateAnimation(n) {
    return ((window.innerWidth / 2) - (65 * n) - 65);
}

function calculateLeft(n) {
    return "calc(50% - " + (n * 65 + 100) + "px)";
}

function calculateScore(deck) {
    const cardValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10,
        'J': 10, 'Q': 10, 'K': 10, 'A': 11
    };
    let sum = 0;
    let numAces = 0;

    for (const card of deck) {
        const type = card[0];
        if (type === "A") {
            numAces++;
        }
        sum += cardValues[type];
    }

    while (sum > 21 && numAces > 0) {
        sum -= 10;
        numAces--;
    }
    return sum;
}

async function dealCards() {
    document.getElementById("slider").disabled = true;
    document.getElementById("deal").hidden = true;
    cards = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S",
"8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];
    playerHand = [];
    dealerHand = [];
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";
    document.getElementById("playerScore").innerHTML = "??";
    document.getElementById("dealerScore").innerHTML = "??";
    for (let i = 0; i < 4; i++) {
        const card = getRandomCard();
        let cardImage = document.createElement("img");
        cardImage.src = "images/cards/" + card + ".svg";
        cardSound.play();
        if (i % 2 == 0) {
            cardImage.style.setProperty('--per', calculateAnimation(playerHand.length) + "px");
            cardImage.className = "card playerCard";
            playerHand.push(card);
            document.getElementById("playerCards").appendChild(cardImage);
        } else {
            cardImage.style.setProperty('--per', calculateAnimation(dealerHand.length) + "px");
            cardImage.className = "card dealerCard";
            dealerHand.push(card);
            if (i == 3) {
                flippedCard = document.createElement("div");
                flippedCard.className = "card dealerCard";
                flippedCard.id = "flipped";
                content = document.createElement("div");
                content.className = "";
                content.id = "content";
                flippedCard.appendChild(content);
                front = document.createElement("img");
                front.className = "card";
                front.src = "images/cards/2B.svg";
                front.id = "front";
                content.appendChild(front);
                back = document.createElement("img");
                back.hidden = true;
                back.className = "card";
                back.src = "images/cards/" + card + ".svg";
                back.id = "back";
                content.appendChild(back);
                document.getElementById("dealerCards").appendChild(flippedCard);
            } else {
                document.getElementById("dealerCards").appendChild(cardImage);
            }
            
        }
        await sleep(1000);
        document.getElementById("playerScore").innerHTML = calculateScore(playerHand);
        document.getElementById("playerScore").style.left = calculateLeft(playerHand.length);
        document.getElementById("dealerScore").style.left = calculateLeft(dealerHand.length);
    }

    if (calculateScore(playerHand) == 21) {
        document.getElementById("hit").disabled = true;
        document.getElementById("doubledown").disabled = true;
    }
    document.getElementById("hit").hidden = false;
    document.getElementById("stay").hidden = false;
    document.getElementById("doubledown").hidden = false;
}

async function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}