const song = new Audio("sounds/song.mp3");
const cardSound = new Audio("sounds/deal.mp3");
const flipSound = new Audio("sounds/flip.mp3");
const chipSound = new Audio("sounds/chip.mp3");
song.loop = true;
var play = false;
var bet = 10;
var lead = false;
const username = document.getElementById("lolol").innerHTML;
var chips = 100;
getChips();
getMuted();

document.getElementById("chipscount").innerHTML = chips;
document.getElementById("slider").min = Math.min(1, chips);
document.getElementById("slider").max = chips;
document.getElementById("slider").value = Math.min(10, chips);
rangeSlide(Math.min(10, chips));

//Initiates the game and prepares all variables
document.getElementById("deal").onclick = async function() {
    play = true;
    this.disabled = true;
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
    document.getElementById("doubledown").disabled = false;
    song.play();
    bet = parseInt(document.getElementById("betValue").innerHTML);
    document.getElementById("chipscount").innerHTML = chips;
    let amt = 0;
    if (bet < 20) {
        amt = bet;
    } else if (bet < 100) {
        amt = 30;
    } else { 
        amt = 50;
    }
    let prev = chips;
    for (let i = 0; i < amt; i++) {
        let chip = document.createElement("img");
        chip.src = "images/chip.png";
        chip.className = "chip";
        chip.onanimationend = function() {
            document.body.removeChild(chip);
        }
        document.body.appendChild(chip);
        chips -= bet / amt;
        document.getElementById("chipscount").innerHTML = Math.floor(chips);
        if (!song.muted) {
            let chipSound = new Audio("sounds/chip.mp3");
            chipSound.play();
        }
        await sleep(50);
    }

    document.getElementById("playerScore").hidden = false;
    if (cardWidth == 65) {
        document.getElementById("playerScore").style.left = "calc(50% - 100px)";
    } else {
        document.getElementById("playerScore").style.right = "calc(50% - 35px)";
    }
    document.getElementById("dealerScore").hidden = false;
    if (cardWidth == 65) {
        document.getElementById("dealerScore").style.left = "calc(50% - 100px)";
    } else {
        document.getElementById("dealerScore").style.right = "calc(50% - 35px)";
    }
    document.getElementById("info").innerHTML = ""
    chips = prev - bet;
    document.getElementById("chipscount").innerHTML = chips;
    if (chips < bet) {
        document.getElementById("doubledown").disabled = true;
    }
    updateChips();
    dealCards();
}

//Performs a hit for the user
document.getElementById("hit").onclick = async function() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("doubledown").disabled = true;
    const card = getRandomCard();
    let cardImage = document.createElement("img");
    cardImage.src = "images/cards/" + card + ".svg";
    cardImage.className = "card playerCard";
    playerHand.push(card);
    cardImage.style.setProperty('--per', calculateAnimation(playerHand.length) + "px");
    document.getElementById("playerCards").appendChild(cardImage);
    cardSound.play();
    await sleep(1000);
    if (cardWidth == 65) {
        document.getElementById("playerScore").style.left = calculateLeft(playerHand.length);
    } else {
        document.getElementById("playerScore").style.right = calculateLeft(playerHand.length);
    }
    let score = calculateScore(playerHand);
    document.getElementById("playerScore").innerHTML = score;

    if (score == 21) {
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = false;
    } else if (score > 21) {
        document.getElementById("deal").disabled = false;
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
        document.getElementById("info").innerHTML = "You lose"
        document.getElementById("hit").hidden = true;
        document.getElementById("stay").hidden = true;
        document.getElementById("deal").hidden = false;
        document.getElementById("slider").disabled = false;
        adjustBet();
        return "lost";
    } else {
        document.getElementById("hit").disabled = false;
        document.getElementById("stay").disabled = false;
    }
}

//Performs a stay for the user
document.getElementById("stay").onclick = async function() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("doubledown").disabled = true;
    flipCard();
    document.getElementById("dealerScore").innerHTML = calculateScore(dealerHand);
    await sleep(1000);

    document.getElementById("dealerCards").childNodes[1].src = "images/cards/" + dealerHand[1] + ".svg";
    while (calculateScore(dealerHand) < 17) {
        const card = getRandomCard();
        let cardImage = document.createElement("img");
        cardImage.src = "images/cards/" + card + ".svg";
        cardImage.className = "card dealerCard";
        cardImage.style.setProperty('--per', calculateAnimation(dealerHand.length) + "px");
        dealerHand.push(card);
        document.getElementById("dealerCards").appendChild(cardImage);
        cardSound.play();
        await sleep(1000);
        if (cardWidth == 65) {
            document.getElementById("dealerScore").style.left = calculateLeft(dealerHand.length);
        } else {
            document.getElementById("dealerScore").style.right = calculateLeft(dealerHand.length);
        }

    }
    let dealerScore = calculateScore(dealerHand);
    let playerScore = calculateScore(playerHand);
    document.getElementById("dealerScore").innerHTML = dealerScore;
    document.getElementById("deal").disabled = false;

    if (dealerScore > 21) {
        document.getElementById("info").innerHTML = "You win"
        if (playerScore == 21 && playerHand.length == 2) { //Blackjack
            await winChips(3 * bet);
        } else {
            await winChips(2 * bet);
        }
    } else if (dealerScore == playerScore) {
        document.getElementById("info").innerHTML = "Draw"
        await winChips(bet);
    } else if (dealerScore > playerScore) {
        document.getElementById("info").innerHTML = "You lose"
    } else {
        document.getElementById("info").innerHTML = "You win"
        await winChips(2 * bet);
    }
    updateChips();
    document.getElementById("chipscount").innerHTML = chips;

    document.getElementById("hit").hidden = true;
    document.getElementById("stay").hidden = true;
    document.getElementById("doubledown").hidden = true;
    document.getElementById("deal").hidden = false;
    document.getElementById("slider").disabled = false;
    adjustBet();
}

//Performs a double down for the user
document.getElementById("doubledown").onclick = async function() {
    this.disabled = true;
    document.getElementById('hit').disabled = true;
    document.getElementById("stay").disabled = true;
    let amt = 0;
    if (bet < 20) {
        amt = bet;
    } else if (bet < 100) {
        amt = 30;
    } else { 
        amt = 50;
    }
    let prev = chips;
    for (let i = 0; i < amt; i++) {
        let chip = document.createElement("img");
        chip.src = "images/chip.png";
        chip.className = "chip";
        chip.onanimationend = function() {
            document.body.removeChild(chip);
        }
        document.body.appendChild(chip);
        chips -= bet / amt;
        document.getElementById("chipscount").innerHTML = Math.floor(chips);
        if (!song.muted) {
            let chipSound = new Audio("sounds/chip.mp3");
            chipSound.play();
        }
        await sleep(50);
    }
    chips = prev - bet;
    bet *= 2;
    document.getElementById("chipscount").innerHTML = chips;
    updateChips();
    let ret = await document.getElementById("hit").onclick();
    if (!ret) {
        document.getElementById('hit').disabled = true;
        document.getElementById("stay").disabled = true;
        document.getElementById("stay").onclick();
    }
}

//Plays the card flip animation
function flipCard() {
    flipSound.play();
    document.getElementById("flipped").className += " flip";
    document.getElementById("content").className = "content";
    document.getElementById("front").className += " front";
    document.getElementById("back").className += " back";
    document.getElementById("back").hidden = false;
}

//Toggles the volume and updates the database
document.getElementById("volume").onclick = function() {
    if (this.src.endsWith("images/unmute.png")) {
        this.src = "images/mute.png";
        song.muted = true;
        chipSound.muted = true;
        flipSound.muted = true;
        cardSound.muted = true;
    } else {
        this.src = "images/unmute.png"
        song.muted = false;
        chipSound.muted = false;
        flipSound.muted = false;
        cardSound.muted = false;
    }
    updateMuted();
}

//Updates the slider text value
function rangeSlide(value) {
    document.getElementById('betValue').innerHTML = value;
}

//Updates the slider values
function adjustBet() {
    document.getElementById("slider").min = Math.min(1, chips);
    document.getElementById("slider").max = chips;
    document.getElementById("slider").value = Math.min(parseInt(document.getElementById("slider").value), chips);
    rangeSlide(document.getElementById("slider").value);

    if (chips == 0) {
        document.getElementById("deal").disabled = true;
        document.getElementById("bail").hidden = false;
    }
}

//Plays animation for winning chips
async function winChips(n) {
    let amt = 0;
    if (n < 20) {
        amt = n;
    } else if (n < 100) {
        amt = 30;
    } else { 
        amt = 50;
    }
    let prev = chips;

    for (let i = 0; i < amt; i++) {
        let chip = document.createElement("img");
        chip.src = "images/chip.png";
        chip.className = "chipWin";
        chip.onanimationend = function() {
            document.body.removeChild(chip);
        }
        document.body.appendChild(chip);
        chips += n / amt;
        document.getElementById("chipscount").innerHTML = Math.floor(chips);
        if (!song.muted) {
            let chipSound = new Audio("sounds/chip.mp3");
            chipSound.play();
        }
        await sleep(50);
    }
    chips = prev + n;
    document.getElementById("chipscount").innerHTML = chips;
}

//Plays animation for bail
document.getElementById("bail").onclick = async function() {
    for (let i = 0; i < 10; i++) {
        let chip = document.createElement("img");
        chip.src = "images/chip.png";
        chip.className = "chipWin";
        chip.onanimationend = function() {
            document.body.removeChild(chip);
        }
        document.body.appendChild(chip);
        chips++;
        document.getElementById("chipscount").innerHTML = chips;
        if (!song.muted) {
            let chipSound = new Audio("sounds/chip.mp3");
            chipSound.play();
        }
        await sleep(50);
    }
    document.getElementById("chipscount").innerHTML = chips;
    document.getElementById("bail").hidden = true;
    document.getElementById("slider").min = Math.min(1, chips);
    document.getElementById("slider").max = chips;
    document.getElementById("slider").value = Math.min(10, chips);
    document.getElementById("deal").disabled = false;
    rangeSlide(Math.min(10, chips));
    updateChips();
}

//Displays / Hides leaderboard 
document.getElementById("leader").onclick = function() {
    lead = !lead;
    if (lead) {
        getLeaderboard();
    } else {
        document.getElementById("leaderboard").innerHTML = "";
    }
}

//Call to server to alter chip count
function updateChips() {
    $.ajax ({
        type: "POST",
        url: "/updateChips",
        data: {user: username, chips: chips}
    });
}

//Call to server to get chip count
function getChips() {
    $.ajax ({
        type: "GET",
        url: `/getChips?name=${encodeURIComponent(username)}`,
        dataType: "json",
        success: function (data) {
            chips = data.return;
            document.getElementById("chipscount").innerHTML = chips;
            document.getElementById("slider").min = Math.min(1, chips);
            document.getElementById("slider").max = chips;
            document.getElementById("slider").value = Math.min(10, chips);
            rangeSlide(Math.min(10, chips));
            if (chips == 0) {
                document.getElementById("bail").hidden = false;
            }
        }
    });
}

//Call to server to alter mute status
function updateMuted() {
    var muted = "unmuted";
    if (song.muted) {
        muted = "muted";
    }
    $.ajax ({
        type: "POST",
        url: "/updateMuted",
        data: {user: username, muted: muted}
    });
}

//Call to server to get mute status
function getMuted() {
    $.ajax({
        type: "GET",
        url: `/getMuted?name=${encodeURIComponent(username)}`,
        dataType: "json",
        success: function(data) {
            let muted = data.return;
            if (muted == "muted") {
                document.getElementById("volume").src = "images/mute.png";
                song.muted = true;
                chipSound.muted = true;
                flipSound.muted = true;
                cardSound.muted = true;
            } else {
                document.getElementById("volume").src = "images/unmute.png"
                song.muted = false;
                chipSound.muted = false;
                flipSound.muted = false;
                cardSound.muted = false;
            }
        }
    });
}

//Call to server to get leaderboard data
function getLeaderboard() {
    $.ajax({
        type: "GET",
        url: "/viewLeaderboard",
        dataType: "json",
        success: function(data) {
            const style = 'text-decoration: underline; font-weight: bold; font-size: 10px'
            let entry = document.createElement("div");
            entry.style.height = "30px";
            entry.className = "entry";
            entry.innerHTML = "<div style='" + style + "' class='lplace'>Rank</div><div style='" + style + "' class='lname'>User</div><div style='" + style + "' class='lcount'>Chips</div>";
            document.getElementById("leaderboard").appendChild(entry);
            for (let i = 0; i < data.length; i++) {
                let entry = document.createElement("div");
                entry.className = "entry";
                if (data[i].name == username) {
                    entry.style.background = "gold";
                }
                let place = document.createElement("div");
                place.innerHTML = i + 1;
                place.className = "lplace";
                entry.appendChild(place);
                let name = document.createElement("div");
                name.innerHTML = data[i].name;
                name.className = "lname";
                entry.appendChild(name);
                let count = document.createElement("div");
                count.innerHTML = data[i].chips;
                count.className = "lcount";
                entry.appendChild(count);
                document.getElementById("leaderboard").appendChild(entry);
            }
        }
    });
}
