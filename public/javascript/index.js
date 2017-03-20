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

const instructions = ["Here is part ", " of your password for: ", ". Please input \
	your password as shown by the animation."]

$(function(){
	$.ajax({
		method:"GET",
		url:'/getPassword',
		success:setup,
		dataType:'json'
	});
	
	//enter key handler
	$("#pwBox").keypress(function(ev){
		if(ev.which===13){
            if (validatePassword($(this).val()))
            {
                nextShape();
            }
            else
            {
                attempts += 1;
                if (attempts === max_attempts)
                {
                    end(false);
                }
            }
		}
	});
	
	//modal close handler
	$("#service").on('hidden.bs.modal', function()
	{
		time = performance.now();
		
		let pw = passwords['pw'+currPass].shapes;        
		let k = shapesToCoords(pw);
		let path = convertCoordsToSvg(k[currShape]);
		setPath(path);
		var path1 = anime.path('#motionPath path');
        
        if (currShape > 0)
        {
            for(let c of pw[currShape-1]){
                let element = document.getElementById('_' + c);
                element.classList.remove("active");
            }
        }
        
        for(let c of pw[currShape]){
            let element = document.getElementById('_' + c);
            element.classList.add("active");
        }

		var motionPath = anime({
			targets: '#motionPath .el',
			translateX: path1('x'),
			translateY: path1('y'),
			rotate: path1('angle'),
			easing: 'linear',
			duration: 750*pw.length,
			loop: true
		});
	});
});

const validatePassword = function(pw)
{
    if (pw.toUpperCase() === passwords['pw'+currPass].shapes[currShape])
        return true;
    return false;
}

const setup = function(data)
{
	console.log(data);
    passwords = data;
	currPass = 0;
    start();
}

const nextShape = function()
{
    if (currShape+1 === passwords['pw'+currPass].shapes.length)
    {
        start();
        return;
    }
    
    $("#pwBox").val("");
    currShape += 1;
    $("#service").modal('show');
	$("#instructions").html(instructions[0] + (parseInt(currShape)+1) + instructions[1] + passwords['pw'+currPass].service + instructions[2]);

}

const start = function()
{
    if (currPass > 0)
    for(let c of passwords['pw'+currPass].shapes[currShape]){
        let element = document.getElementById('_' + c);
        element.classList.remove("active");
    }
    
    currPass += 1;
    if (currPass === 4) end(true);
    currShape = -1;
    nextShape();
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
	const element = document.getElementById(id);
	let ele = element.getClientRects()[0];
	let middleX = ele.left - 150;
	let middleY = ele.top - 30;
	return {
		x: Math.floor(middleX),
		y: Math.floor(middleY)
	};
};

const end = function end(success)
{
    
}
/*
this.service = String;
this.allowedAttempts = Number;
this.attempts = Number;
this.givenShapes = Array;
this.receivedShapes = Array;
this.failed = Boolean;
this.loginTime = Number;
*/