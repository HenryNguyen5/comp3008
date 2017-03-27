const max_attempts = 3;
let attempts = 0;
let givenShapes = [];
let receivedShapes = [];
let service = "";
let failed = false;
let loginTime = 0;
let time = 0;
let currPass = null;
let passwords = null;
let currShape = null;
let done = false;

const response_format = {
	pw1: {
		service: "",
		allowedAttempts: 0,
		attempts: 0,
		givenShapes: [],
		receivedShapes: [],
		failed: true,
		loginTime: 0
	},
	pw2: {
		service: "",
		allowedAttempts: 0,
		attempts: 0,
		givenShapes: [],
		receivedShapes: [],
		failed: true,
		loginTime: 0
	},
	pw3: {
		service: "",
		allowedAttempts: 0,
		attempts: 0,
		givenShapes: [],
		receivedShapes: [],
		failed: true,
		loginTime: 0
	}
}

let response = response_format;

const instructions = ["Here is part ", " of your password for: ", ". Please input \
	your password as shown by the animation."]

$(function () {
	$.ajax({
		method: "GET",
		url: '/getPassword',
		success: setup,
		dataType: 'json'
	});

	//enter key handler
	$("#pwBox").keypress(function (ev) {
		if (ev.which === 13) {
			response['pw' + currPass].receivedShapes.push($(this).val());
			if (validatePassword($(this).val())) {
				nextShape();
			} else {
				attempts += 1;
				$(this).val("");
				if (attempts === max_attempts) {
					end(false);
				}
			}
		}
	});

	//modal close handler
	$("#service").on('hidden.bs.modal', function () {
		if (done) return;

		time = performance.now();

		response['pw' + currPass].service = passwords['pw' + currPass].service
		response['pw' + currPass].givenShapes = passwords['pw' + currPass].shapes
		response['pw' + currPass].allowedAttempts = max_attempts;

		let pw = passwords['pw' + currPass].shapes;
		let k = shapesToCoords(pw);
		let path = convertCoordsToSvg(k[currShape]);
		setPath(path);
		var path1 = anime.path('#motionPath path');

		if (currShape > 0) {
			for (let c of pw[currShape - 1]) {
				let element = document.getElementById('_' + c);
				element.classList.remove("active");
			}
		}

		for (let c of pw[currShape]) {
			let element = document.getElementById('_' + c);
			element.classList.add("active");
		}

		console.log(passwords['pw' + currPass].shapes[currShape], passwords['pw' + currPass].shapes[currShape].split('').length);

		var motionPath = anime({
			targets: '#motionPath .el',
			translateX: path1('x'),
			translateY: path1('y'),
			rotate: path1('angle'),
			easing: 'linear',
			duration: 200 * passwords['pw' + currPass].shapes[currShape].split('').length,
			loop: true
		});
	});
});

const validatePassword = function (pw) {
	if (pw.toUpperCase() === passwords['pw' + currPass].shapes[currShape])
		return true;
	return false;
}

const setup = function (data) {
	console.log(data);
	passwords = data;
	currPass = 0;
	start();
}

const nextShape = function () {
	//finished current password
	if (currShape + 1 === passwords['pw' + currPass].shapes.length) {
		response['pw' + currPass].loginTime = performance.now() - time;
		response['pw' + currPass].attempts = response['pw' + currPass].receivedShapes.length - response['pw' + currPass].givenShapes.length;
		time = 0;
		start();
		return;
	}

	attempts = 0;
	$("#pwBox").val("");
	currShape += 1;
	$("#service").modal('show');
	$("#instructions").html(instructions[0] + (parseInt(currShape) + 1) + instructions[1] + passwords['pw' + currPass].service + instructions[2]);

}

const start = function () {
	if (currPass > 0) {
		for (let c of passwords['pw' + currPass].shapes[currShape]) {
			let element = document.getElementById('_' + c);
			element.classList.remove("active");
		}
		response['pw' + currPass].failed = false;
	}

	currPass += 1;
	if (currPass === 4) {
		end(true);
		return;
	}
	currShape = -1;
	nextShape();
}

const setPath = function setPath(path) {
	let e = document.getElementById('pwPath');
	e.setAttribute('d', path);
}

const shapesToCoords = function shapesToCoords(data) {
	let retArr = [];
	for (let shape of data) {
		retArr.push(getShapeCoords(shape));
	}
	return retArr;
}

const convertCoordsToSvg = function convertCoordsToSvg(coords) {
	let svgd = '';
	for (let c of coords) {
		if (svgd === '') {
			svgd += (`M${c.x},${c.y}, `);
		} else {
			svgd += (`L${c.x},${c.y}, `);
		}
	}
	svgd += ('z');
	return svgd;
}


const getShapeCoords = function getShapeCoords(str) {
	let arr = str.split('');
	let coordArr = [];
	for (let c of arr) {
		coordArr.push(getCoordinates('_' + c));
	}
	return coordArr;
}

const getCoordinates = function getCoordinates(id) {
	const keyboardDims = document.getElementById('keyboard-container').getC
	const element = document.getElementById(id);
	const offset = $("#_1").offset();
	const position = $("#_1").position();
	let ele = element.getClientRects()[0];
	let middleX = ele.left + (ele.width / 2) - (offset.left - position.left)
	let middleY = ele.top - (offset.top - position.top) + (ele.height / 3);
	return {
		x: Math.floor(middleX),
		y: Math.floor(middleY)
	};
};

const end = function end(success) {

	$("#service").modal('show');
	$("#instructions").html("You're done! Thanks for participating");

	//send reponse to the server here
	console.log(response);

	done = true;
}