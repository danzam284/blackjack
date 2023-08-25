(function($) {

	"use strict";


})(jQuery);
var userInfo;

if ((document.getElementById("lolol")).innerHTML != "&lt;%= msg %&gt;") {
	document.getElementById("bad").innerHTML = document.getElementById("lolol").innerHTML;
	document.getElementById("bad").style.display = "block";
}

getUsers();
let button = document.getElementById("switchButton");
button.onclick = async function() {
	//await getUsers();
	let animationTimeout;
	let animationTimeout2;
	clearTimeout(animationTimeout);
	clearTimeout(animationTimeout2);
	document.getElementById("bad").style.display = "none";
	if (button.innerHTML == "Sign Up") {
		$("#parent").addClass('animation-right');
		animationTimeout = setTimeout(() => {
			$("#parent").removeClass('animation-right'); 
			$("#parent").removeClass('animation-left');
			button.innerHTML = "Sign In";
			document.getElementById("header").innerHTML = "Sign Up";
			document.getElementById("final").innerHTML = "Sign Up";
			document.getElementById("form").action = "/signup";
			document.getElementById("message").innerHTML = "Already have an account?";
			document.getElementById("textBox").style.background = "linear-gradient(-45deg, #FFD700 0%, black 100%)";
			document.getElementById("final").style.background = "linear-gradient(-45deg, #FFD700 0%, black 100%)";
		}, 600);
	} else {
		$("#parent").addClass('animation-left');
		animationTimeout = setTimeout(() => {
			$("#parent").removeClass('animation-right'); 
			$("#parent").removeClass('animation-left');
			button.innerHTML = "Sign Up";
			document.getElementById("header").innerHTML = "Sign In";
			document.getElementById("final").innerHTML = "Sign In";
			document.getElementById("form").action = "/login";
			document.getElementById("message").innerHTML = "Don't have an account?";
			document.getElementById("textBox").style.background = "linear-gradient(-45deg, #50fa58 0%, #30387b 100%)";
			document.getElementById("final").style.background = "linear-gradient(-45deg, #B19CD9 0%, #30387b 100%)";
		}, 600);
	}
}

function submitForm() {
	if (document.getElementById("form").action.endsWith("/login")) {
		return true;
	} else {
		let username = document.getElementById("username");
		let password = document.getElementById("password");

		if (requirements == 4 && requirements2 == 4) {
			button.click();
			document.getElementById("congrats").style.display = "block";
			return true;
		} else {
			$("#shaker").addClass('shake');
			let animationTimeout3;
			clearTimeout(animationTimeout3);
			animationTimeout3 = setTimeout(() => {
				$("#shaker").removeClass('shake');
			}, 820);
			return false;
		}
	}
}

async function getUsers() {
	const userJ = await fetch('/getUser');
	userInfo = await userJ.json();
} 

let password = document.getElementById("password");
let username = document.getElementById("username");
let validation = document.getElementById("form-validation");
let validation2 = document.getElementById("user-validation");

password.onfocus = function() {
	if (document.getElementById("form").action.endsWith("/signup")) {
		validation.style.display = "block";
	}
}
password.onblur = function() {
	validation.style.display = "none";
}

username.onfocus = function() {
	if (document.getElementById("form").action.endsWith("/signup")) {
		validation2.style.display = "block";
	}
}
username.onblur = function() {
	validation2.style.display = "none";
}

var requirements;
password.onkeyup = function() {
	requirements = 0
	var lowerCaseLetters = /[a-z]/g;
	if (password.value.match(lowerCaseLetters)) {
		requirements++;
		document.getElementById("lowercase").style.color = "green";
		document.getElementById("lowercase").innerHTML = "✔" + document.getElementById("lowercase").innerHTML.slice(1);
	} else {
		document.getElementById("lowercase").style.color = "red";
		document.getElementById("lowercase").innerHTML = "✖" + document.getElementById("lowercase").innerHTML.slice(1);
	}

	var upperCaseLetters = /[A-Z]/g;
	if (password.value.match(upperCaseLetters)) {
		requirements++;
		document.getElementById("uppercase").style.color = "green";
		document.getElementById("uppercase").innerHTML = "✔" + document.getElementById("uppercase").innerHTML.slice(1);
	} else {
		document.getElementById("uppercase").style.color = "red";
		document.getElementById("uppercase").innerHTML = "✖" + document.getElementById("uppercase").innerHTML.slice(1);
	}

	var numbers = /[0-9]/g;
	if (password.value.match(numbers)) {
		requirements++;
		document.getElementById("numbers").style.color = "green";
		document.getElementById("numbers").innerHTML = "✔" + document.getElementById("numbers").innerHTML.slice(1);
	} else {
		document.getElementById("numbers").style.color = "red";
		document.getElementById("numbers").innerHTML = "✖" + document.getElementById("numbers").innerHTML.slice(1);
	}

	if (password.value.length >= 8) {
		requirements++;
		document.getElementById("characters").style.color = "green";
		document.getElementById("characters").innerHTML = "✔" + document.getElementById("characters").innerHTML.slice(1);
	} else {
		document.getElementById("characters").style.color = "red";
		document.getElementById("characters").innerHTML = "✖" + document.getElementById("characters").innerHTML.slice(1);
	}
}

var requirements2;
username.onkeyup = function() {
	requirements2 = 0;
	if (username.value.length >= 3) {
		requirements2++;
		document.getElementById("chars").style.color = "green";
		document.getElementById("chars").innerHTML = "✔" + document.getElementById("chars").innerHTML.slice(1);
	} else {
		document.getElementById("chars").style.color = "red";
		document.getElementById("chars").innerHTML = "✖" + document.getElementById("chars").innerHTML.slice(1);
	}

	if (username.value.length <= 10) {
		requirements2++;
		document.getElementById("chars2").style.color = "green";
		document.getElementById("chars2").innerHTML = "✔" + document.getElementById("chars2").innerHTML.slice(1);
	} else {
		document.getElementById("chars2").style.color = "red";
		document.getElementById("chars2").innerHTML = "✖" + document.getElementById("chars2").innerHTML.slice(1);
	}
	
	var alphanumeric = /^[a-z0-9]+$/gi;
	if (username.value.match(alphanumeric)) {
		requirements2++;
		document.getElementById("none").style.color = "green";
		document.getElementById("none").innerHTML = "✔" + document.getElementById("none").innerHTML.slice(1);
	} else {
		document.getElementById("none").style.color = "red";
		document.getElementById("none").innerHTML = "✖" + document.getElementById("none").innerHTML.slice(1);
	}
	var found = false;
	for (let i = 0; i < userInfo.length; i++) {
		if (userInfo[i].name == username.value) {
			document.getElementById("exist").style.color = "red";
			document.getElementById("exist").innerHTML = "✖" + document.getElementById("exist").innerHTML.slice(1);
			found = true;
			break
		}
	}
	if (!found) {
		requirements2++;
		document.getElementById("exist").style.color = "green";
		document.getElementById("exist").innerHTML = "✔" + document.getElementById("exist").innerHTML.slice(1);
	}
}