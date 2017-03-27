const max_attempts = 3;

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

const instructions = ["Here is your password for: ", ". Please input \
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
			if (setup.validatePassword($(this).val())) {
                setup.nextShape();
			} else {
                console.log("you fucked up");
			}
			$(this).val("");
		}
	});

	//modal close handler
	$("#service").on('hidden.bs.modal', function () {
		
	});
});

const validatePassword = function (pw) {
	if (pw.toUpperCase() === setup.getShape())
		return true;
	return false;
}

const setup = function (data) {
	let passwords = [];
    for (let o of Object.keys(data)) passwords.push(data[o]);
    let currPass = 0;
    let currShape = 0;
    
    function getShape()           { return passwords[currPass].shapes[currShape].shape; }
    function validatePassword(pw) { return pw.toUpperCase() === getShape();             }
    function nextShape()
    {
        currShape += 1;
        if (currShape === passwords[currPass].shapes.length)
        {
            currPass += 1;
            currShape = -1;
            nextShape();
            return;
        }
        nextAnim(getShape());
    }
    
    nextAnim(getShape());
}

const end = function end(success) {

	$("#service").modal('show');
	$("#instructions").html("You're done! Thanks for participating");

	//send reponse to the server here
	console.log(response);

	done = true;
}

/*
const start = function () {
	if (currPass > 0) {
		for (let c of passwords['pw' + currPass].shapes[currShape]) {
			let element = document.getElementById('_' + c);
			element.classList.remove("active");
		}
	}

	currPass += 1;
	if (currPass === 4) {
		end(true);
		return;
	}
	currShape = -1;
    $("#service").modal('show');
	$("#instructions").html(instructions[0] + passwords['pw' + currPass].service + instructions[1]);
	nextShape();
}
*/

//shape : string
const nextAnim = function(shape)
{
    let coords = getShapeCoords(shape);
    let path = convertCoordsToSvg(coords);
    setPath(path);
    var path1 = anime.path('#motionPath path');

    if (currShape > 0) {
        for (let c of shape) {
            let element = document.getElementById('_' + c);
            element.classList.remove("active");
        }
    }

    for (let c of shape) {
        let element = document.getElementById('_' + c);
        element.classList.add("active");
    }

    var motionPath = anime({
        targets: '#motionPath .el',
        translateX: path1('x'),
        translateY: path1('y'),
        rotate: path1('angle'),
        easing: 'linear',
        duration: 400 * shape.split('').length,
        loop: true
    });
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