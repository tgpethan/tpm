const tmi = require("tmi.js");
const client = new tmi.client({
    options: {
        debug: false
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    channels: ["gamerzatnight"]
});
const robot = require("robotjs");
// replace this with robotjs?
// no idea why I used this over robotjs
// I took most of this code from my 2018 code
// and I was bad back then, still am lol.
const ks = require("node-key-sender");
ks.setOption("globalDelayPressMillisec", 1000);

let newMousePos = [0, 0];
let mouselol;

// Get the 0, 0 coordinate of minecraft on the screen
// Very constant, can probably get this info from X
const window00 = [
	(1920 / 2) - (1280 / 2),
	(1080 / 2) - (720 / 2)
];

let sprintState = false;
let crouchState = false;
let leftClickState = false;
let rightClickState = false;

const validCommands = [
	// View commands
	"up", "down", "left", "right",
	"sup", "sdown", "sleft", "sright",
	"nup", "ndown", "nleft", "nright",

	// Movement commands
	"w", "s", "a", "d",
	"long_w", "long_s", "long_a", "long_d",
	"jump", "sprint", "crouch",

	// Mouse
	"lclick", "rclick",
	"tlclick", "trclick",

	// Interface commands
	"e"
]

client.on("connected", (address, port) => {
	console.clear();
    console.log("======- Twitch plays Minecraft -======");
	console.log("");
	console.log(" - Made by Holly (C) 2021");
	console.log(" - Licensed under MIT");
	console.log("");
	console.log("   https://github.com/tgpethan/tpm");
	console.log("");
	console.log("======================================");

	// Interval for smooth camera movement
	setInterval(() => {
		mouselol = robot.getMousePos();
		newMousePos[0] = newMousePos[0] / 2;
		newMousePos[1] = newMousePos[1] / 2;
		if ((newMousePos[0] < 1 && newMousePos[0] > -1) || (newMousePos[0] > -1 && newMousePos[0] < 1)) newMousePos[0] = 0;
		if ((newMousePos[1] < 1 && newMousePos[1] > -1) || (newMousePos[1] > -1 && newMousePos[1] < 1)) newMousePos[1] = 0;

		if (newMousePos[0] != 0 || newMousePos[1] != 0)
			if (
				(mouselol.x + newMousePos[0]) > window00[0] && (mouselol.x + newMousePos[0] < (window00[0] + 1280)) &&
				(mouselol.y + newMousePos[1]) > window00[1] && (mouselol.y + newMousePos[1]) < (window00[1] + 720)
			) {
				robot.moveMouse(mouselol.x + newMousePos[0], mouselol.y + newMousePos[1]);
			}
	}, 1000 / 24);
});

client.connect();

client.on("chat", (channel, user, msg, self) => {
	
	if (!validCommands.includes(msg)) return;

	switch (msg) {
		case "up":
			newMousePos[0] = 0;
			newMousePos[1] = -250;
			break;

		case "down":
			newMousePos[0] = 0;
			newMousePos[1] = 250;
			break;

		case "left":
			newMousePos[0] = -250;
			newMousePos[1] = 0;
			break;

		case "right":
			newMousePos[0] = 250;
			newMousePos[1] = 0;
			break;

		case "sup":
			newMousePos[0] = 0;
			newMousePos[1] = -125;
			break;

		case "sdown":
			newMousePos[0] = 0;
			newMousePos[1] = 125;
			break;

		case "sleft":
			newMousePos[0] = -125;
			newMousePos[1] = 0;
			break;

		case "sright":
			newMousePos[0] = 125;
			newMousePos[1] = 0;
			break;

		case "nup":
			newMousePos[0] = 0;
			newMousePos[1] = -25;
			break;

		case "ndown":
			newMousePos[0] = 0;
			newMousePos[1] = 25;
			break;

		case "nleft":
			newMousePos[0] = -25;
			newMousePos[1] = 0;
			break;

		case "nright":
			newMousePos[0] = 25;
			newMousePos[1] = 0;
			break;

		case "sprint":
			sprintState = !sprintState;
			robot.keyToggle("control", sprintState ? "down" : "up");
			break;

		case "crouch":
			crouchState = !crouchState;
			robot.keyToggle("shift", crouchState ? "down" : "up");

		case "jump":
			robot.keyToggle("space", "down");
			setTimeout(() => robot.keyToggle("space", "up"), 50);
			break;

		case "w":
		case "s":
		case "a":
		case "d":
			ks.setOption('globalDelayPressMillisec', 1000);
			ks.sendKey(msg);
			break;

		case "long_w":
		case "long_s":
		case "long_a":
		case "long_d":
			ks.setOption('globalDelayPressMillisec', 5000);
			ks.sendKey(msg.split("_")[1]);
			break;

		case "e":
			// unpress problematic keys & buttons
			if (leftClickState) robot.mouseToggle("up");
			if (rightClickState) robot.mouseToggle("up");
			if (sprintState) robot.keyToggle("control", "up");
			if (crouchState) robot.keyToggle("shift", "up");

			ks.setOption('globalDelayPressMillisec', 50);
        	ks.sendKey("e");
			break;

		case "lclick":
			leftClickState = true;
			robot.mouseToggle("down");
			setTimeout(() => {
				leftClickState = false;
				robot.mouseToggle("up")
			}, 50);
			break;

		case "rclick":
			rightClickState = true;
			robot.mouseToggle("down", "right");
			setTimeout(() => {
				rightClickState = false;
				robot.mouseToggle("up", "right")
			}, 50);
			break;

		case "tlclick":
			leftClickState = !leftClickState;
			robot.mouseToggle(leftClickState ? "down" : "up");
			break;

		case "trclick":
			rightClickState = !rightClickState;
			robot.mouseToggle(rightClickState ? "down" : "up", "right");
			break;
	}
});