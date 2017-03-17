

$(function(){
	$.ajax({
		method:"GET",
		url:'/getPassword',
		success:setup,
		dataType:'json'
	});
	
	$("#passBox").keypress(function(ev){
		if(ev.which===13){
			console.log($(this).val());
		}
	});
});

const setup = function(data)
{
	$("#service").html("Here is your password for " + data.pw1.service);
	let pw1 = data.pw1.shapes;
	console.log(pw1);
	let k = shapesToCoords(pw1);
	console.log(k)
	let path = convertCoordsToSvg(k[0]);
	console.log(path);
	setPath(path);
	var path1 = anime.path('#motionPath path');

	var motionPath = anime({
	targets: '#motionPath .el',
	translateX: path1('x'),
	translateY: path1('y'),
	rotate: path1('angle'),
	easing: 'linear',
	duration: 2000,
	loop: true
	});

}

const setPath = function setPath(path){
	let e = document.getElementById('pwPath');
	e.setAttribute('d', path);
}

const shapesToCoords = function shapesToCoords(data)
{
	let retArr = [];
	for(let shape of data) {
		retArr.push(getShapeCoords(shape));
	}
	return retArr;
}

const convertCoordsToSvg = function convertCoordsToSvg(coords) {
	let svgd = '';
	for(let c of coords){
		if(svgd === ''){
			svgd += (`M${c.x},${c.y}, `);
		}
		else {
			svgd += (`L${c.x},${c.y}, `);
		}
	}
	svgd += ('z');
	return svgd;
}


const getShapeCoords = function getShapeCoords(str) {
	let arr = str.split('');
	let coordArr = [];
	for(let c of arr){
		coordArr.push(getCoordinates('_' + c));
	}
	return coordArr;
}

const getCoordinates = function getCoordinates(id){
	console.log(id);
	const element = document.getElementById(id);
	let ele = element.getClientRects()[0];
	let middleX = ele.left - 260;
	let middleY = ele.top - 40;
	return {
		x: Math.floor(middleX),
		y: Math.floor(middleY)
	};
};
/*
this.service = String;
this.allowedAttempts = Number;
this.attempts = Number;
this.givenShapes = Array;
this.receivedShapes = Array;
this.failed = Boolean;
this.loginTime = Number;
*/