/* global $ */
let setup;


const instructions_str = ["Here is your password for: ", ". Please input \
	your password as shown by the animation."]

$(function() {
    $.ajax({
        method: "GET",
        url: '/getPassword',
        success: (data) => { setup = new Setup(data) },
        dataType: 'json'
    });

    //enter key handler
    $("#pwBox").keypress(function(ev) {
        if (ev.which === 13) {

            if (!setup.logging) {
                if (setup.validatePassword($(this).val())) {
                    setTruthKeyShadows(false);
                    setTimeout(function() {
                        clearKeyShadows();
                        setup.nextShape();
                    }, 750);


                } else {
                    setTruthKeyShadows(true);
                    setTimeout(function() {
                        clearKeyShadows();
                    }, 600);
                    console.log("dun goofed");
                }
            } else {
                setup.log.attempts += 1;
                if (setup.log.validatePassword($(this).val())) {
                    setup.addLog();
                } else {
                    console.log("whoops");
                }

            }

            $(this).val("");
        }
    });

    //modal close handler
    $("#service").on('hidden.bs.modal', function() {
        console.log("closed");
    });
});


class Setup {
    constructor(data) {
        this.data = data;
        this.passwords = [];
        for (let o of Object.keys(data)) this.passwords.push(data[o]);
        this.currPass = 0;
        this.currShape = 0;
        this.setModal(this.passwords[this.currPass], instructions_str);
        this.logging = false;
        this.response = { pw1: {}, pw2: {}, pw3: {} };
        this.log = null;
        nextAnim(this.getShape());
    }
    getShape() {
        return this.passwords[this.currPass].shapes[this.currShape].shape;
    }
    validatePassword(pw) {
        return pw.toUpperCase() === this.getShape();
    }
    addLog() {
        this.response['pw' + (3 - this.passwords.length)] = this.log.toObj();
        this.nextLog();
    }
    nextLog() {
        if (this.passwords.length === 0) end(true);
        let index = Math.floor(Math.random() * this.passwords.length);
        this.log = new Log(this.passwords[index]);
        this.passwords.splice(index, 1);
    }
    nextShape() {

        this.currShape += 1;
        if (this.currShape === this.passwords[this.currPass].shapes.length) {
            this.currPass += 1;
            if (this.currPass === this.password.length) {
                this.logging = true;
                this.nextLog();
                return;
            }
            this.currShape = -1;
            this.nextShape();
            this.setModal(this.passwords[this.currPass], instructions_str);
            return;
        }
        nextAnim(this.getShape());
    }
    setModal(pw, instructions) {
        $("#service").modal('show');
        $("#instructions").html(instructions[0] + pw.service + instructions[1]);
        $("#serviceBar").html(pw.service);
    }
}
/*
    service: "",
	allowedAttempts: 0,
	attempts: 0,
	givenShapes: [],
	receivedShapes: [],
	failed: true,
	loginTime: 0
*/
class Log {
    constructor(pw) {
        this.givenShapes = pw.shapes;
        this.pass = "";
        for (let i of this.givenShapes)
            this.pass += i.shape;
        this.service = pw.service;
        this.receivedShapes = [];
        this.failed = false;
        this.time = performance.now();
        this.loginTime = 0;
        this.attempts = 0;
        this.max_attempts = 3;
        setup.setModal(pw, ["Please enter your password for: ", "."]);
    }
    validatePassword(pw) {
        if (pw.toUpperCase() === this.pass) {
            this.loginTime = performance.now() - this.time;
            receivedShapes = pw;
            return true;
        } else return false;
    }
    toObj() {
        return {
            service: this.service,
            allowedAttempts: this.max_attempts,
            attempts: this.attempts,
            givenShapes: this.givenShapes,
            receivedShapes: this.receivedShapes,
            failed: this.failed,
            loginTime: this.loginTime
        };
    }
}

const end = function end(success) {

    $("#service").modal('show');
    $("#instructions").html("You're done! Thanks for participating");

    //send reponse to the server here
    console.log(response);

    done = true;
}

//shape : string
const nextAnim = function(shape) {
    let coords = getShapeCoords(shape);
    let path = convertCoordsToSvg(coords);
    setPath(path);
    var path1 = anime.path('#motionPath path');
    const duration = 300 * shape.split('').length;
    const delay = 300;

    var motionPath = anime({
        targets: '#motionPath .el',
        delay,
        easing: 'easeInOutQuad',
        translateX: path1('x'),
        translateY: path1('y'),
        rotate: path1('angle'),
        duration,
        /*update: function (anim) {
            if (Math.ceil(anim.currentTime) === duration + delay) {
                anim.pause();
                setTimeout(() =>
                    anim.restart(), delay);
            }
        },*/
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
    const element = document.getElementById(id);
    const offset = $("#_1").offset();
    const position = $("#_1").position();


    element.onkeydown = function() {
        alert('onkeydown');
    }
    let ele = element.getClientRects()[0];
    let middleX = ele.left + (ele.width / 1.4) - (offset.left - position.left)
    let middleY = ele.top - (offset.top - position.top) + (ele.height / 1.9);
    return {
        x: Math.floor(middleX),
        y: Math.floor(middleY)
    };
};


const keyPressProperties = ["-webkit-box-shadow", "-moz-box-shadow", "box-shadow"];
const keyErr = "0px 0px 102px -3px rgba(255,59,59,0.82)"
const keySucc = " 0px 0px 50px 14px rgba(136, 209, 153, 0.77)";
let keyArr = []

function uniCharCode(event) {
    //const keyPressProperties = ["-webkit-box-shadow", "-moz-box-shadow", "box-shadow"];
    const keyPressValue = " 0px 0px 42px 8px rgba(136, 209, 153, 0.77)";
    console.log(event.key)
    try {
        if (event.key === 'Backspace') {
            let keyToRm = keyArr.pop();
            for (let x of keyPressProperties) {
                keyToRm.style[x] = null;
            }
        } else {
            const element = document.getElementById(`_${event.key.toUpperCase()}`);
            for (let x of keyPressProperties) {
                element.style[x] = keyPressValue;
            }
            keyArr.push(element)
        }

    } catch (e) {
        console.log(e)
    }
}

function setTruthKeyShadows(err) {
    const keys = document.querySelectorAll(".row .keys .letter");
    console.log(keys)
    for (let element of keyArr) {
        for (let x of keyPressProperties) {
            element.style[x] = (err ? keyErr : keySucc);
        }
    }
}

function clearKeyShadows() {
    const keys = document.querySelectorAll(".row .keys .letter");
    console.log(keys)
    for (let element of keyArr) {
        for (let x of keyPressProperties) {
            element.style[x] = null;
        }
    }

    keyArr.length = 0;
}
$(document).keyup(function(e) {
    $('.modal').modal('hide');
    document.getElementById('pwBox').focus();
});