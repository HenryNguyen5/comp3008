/* global anime */
let setup, data, done = false;
let modalState = true;



$(function() {
    $.ajax({
        method: "GET",
        url: '/getPassword',
        success: (d) => {
            setup = new Setup(d);
            setup.start();
            data = d;
        },
        dataType: 'json'
    });

    $("#service").on('hidden.bs.modal', function() {
        $("#pwBox").focus();
        modalState = false;
    });

    $("#goBack").click(() => {
        let temp = setup.currPass;
        setup = new Setup(data);
        setup.currPass = temp;
        setup.start();
        $("#motionPath").toggle();
        $("#pwBox").focus();
    });

    $("#tryAgain").click(() => {
        $("#pwBox").focus();
    });

    //enter key handler
    $("#pwBox").keypress(function(ev) {
        if (ev.which === 13 && !modalState) {
            try {
                if (setup.passwords[setup.currPass].verified) {
                    if (setup.validateCompletePassword($(this).val())) {
                        $("#motionPath").toggle();
                        setTruthKeyShadows(false);
                        setTimeout(function() {
                            clearKeyShadows();
                        }, 600);
                        setup.nextShape();
                    } else {
                        $("#redo").modal('show');
                        $("#goBack").focus();
                        setTruthKeyShadows(true);
                        setTimeout(function() {
                            clearKeyShadows();
                        }, 600);
                    }
                    $(this).val("");
                    return;
                }
            } catch (e) { console.log("to be expected"); }
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
                    setTruthKeyShadows(false);
                    setTimeout(function() {
                        clearKeyShadows();
                    }, 750);

                    setup.addLog();
                } else {
                    setTruthKeyShadows(true);
                    setTimeout(function() {
                        clearKeyShadows();
                    }, 750);

                    if (setup.log.attempts > setup.log.max_attempts) {
                        setup.log.failed = true;
                        setup.addLog();
                    }
                }

            }

            $(this).val("");
        }
    });
});

class Setup {
    constructor(data) {
        this.data = data;
        this.passwords = [];
        for (let o of Object.keys(data)) this.passwords.push(data[o]);
        for (let p of this.passwords) {
            p.logged = false;
            p.verified = false;
        }
        this.currPass = 0;
        this.currShape = 0;
        this.logging = false;
        this.response = [];
        this.log = null;
    }
    start() {
        this.setModal(this.passwords[this.currPass]);
        setShapes(this.passwords, this.currPass, true);
        nextAnim(this.getShape());
    }
    getShape() {
        return this.passwords[this.currPass].shapes[this.currShape].shape;
    }
    validatePassword(pw) {
        return pw.toUpperCase() === this.getShape();
    }
    validateCompletePassword(pw) {
        let str = "";
        for (let i = 0; i < this.passwords[this.currPass].shapes.length; i++)
            str += this.passwords[this.currPass].shapes[i].shape;
        return pw.toUpperCase() === str;
    }
    addLog() {
        this.response.push(this.log.toObj());
        this.nextLog();
    }
    nextLog() {
        clearKeyShadows();
        if (this.passwords.length === 0) {
            end();
            return;
        }
        let index = Math.floor(Math.random() * this.passwords.length);
        this.log = new Log(this.passwords[index]);
        if (this.passwords[index].logged === true)
            this.passwords.splice(index, 1);
        else
            this.passwords[index].logged = true;
    }
    nextShape() {
        this.currShape += 1;
        if (this.currShape === this.passwords[this.currPass].shapes.length) {
            if (!this.passwords[this.currPass].verified) {
                this.currShape -= 1;
                this.passwords[this.currPass].verified = true;
                $("#motionPath").toggle();
                setShapes(0, 0, false);
                this.setModal(this.passwords[this.currPass], 'confirmation');
                return;
            }
            this.currPass += 1;
            setShapes(this.passwords, this.currPass, true);
            if (this.currPass === this.passwords.length) {
                this.logging = true;
                $('#motionPath').remove();
                this.nextLog();
                return;
            }
            this.currShape = -1;
            this.nextShape();
            this.setModal(this.passwords[this.currPass]);
            return;
        }
        nextAnim(this.getShape());
    }
    setModal(pw, mode) {
        modalState = true;
        $("#service").modal('show');
        $("#closeModal").focus();
        let instructions = '';

        if (mode === 'confirmation') {
            instructions = `Please confirm your password for your: <b>${pw.service}</b> account. <b>Enter the two shapes together</b>.`
        } else if (mode === 'log') {
            instructions = `Please enter your given password for your: <b>${pw.service}</b> account. <b>Enter the two shapes previously given together</b>`
        } else {
            instructions = `Here is your password for your: <b>${pw.service}</b> account. It is given in <b>two seperate parts</b>. Please input your password as shown by the animation. You can use the given shapes below the entry box to help you memorize your password`;
        }
        $("#instructions").html(instructions);
        $("#serviceBar").html(pw.service);
    }
}

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
        this.max_attempts = 2;
        setup.setModal(pw, 'log');
    }
    validatePassword(pw) {
        this.receivedShapes.push(pw);
        if (pw.toUpperCase() === this.pass) {
            this.loginTime = performance.now() - this.time;
            return true;
        } else {
            return false;
        }
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

const end = function end() {
    if (done) return;
    done = true;
    console.log(setup.response);
    //send reponse to the server here
    $.ajax({
        type: "POST",
        url: "/testResults",
        data: JSON.stringify(setup.response),
        contentType: "application/json"
    });
    $("#service").modal('show');
    $("#instructions").html("You're done! Thanks for participating.<br> Please take this survey: tinyurl.com/comp3008survey");


}

/**
 * sets the shapes underneath the input bar
 * @param {Object} pw 
 * @param {Integer} cp 
 * @param {Bool} flag
 */
const setShapes = function(pw, cp, flag) {
    if (!flag) {
        for (let i = 0; i < 2; i++) $('#shape' + i).html("");
    }
    if (pw[cp] === undefined) return;
    for (let i = 0; i < 2; i++) {
        if (pw[cp].shapes[i].type === 'rect')
            $('#shape' + i).html("Starts with: " + pw[cp].shapes[i].shape[0] + '<br>▱');
        else if (pw[cp].shapes[i].type == 'line')
            $('#shape' + i).html("Starts with: " + pw[cp].shapes[i].shape[0] + '<br>━');
        else $('#shape' + i).html("Starts with: " + pw[cp].shapes[i].shape[0] + '<br>▲');
    }
}

/**
 * Loads the arrow animation
 * 
 * @param {String} shape 
 */
const nextAnim = function(shape) {
    let coords = getShapeCoords(shape);
    let path = convertCoordsToSvg(coords);
    setPath(path);
    var path1 = anime.path('#motionPath path');
    const duration = 300 * shape.split('').length;
    const delay = 300;

    anime({
        targets: '#motionPath .el',
        delay,
        easing: 'easeInOutQuad',
        translateX: path1('x'),
        translateY: path1('y'),
        rotate: path1('angle'),
        duration,
        loop: true
    });
}

const setPath = function setPath(path) {
    try {
        let e = document.getElementById('pwPath');
        e.setAttribute('d', path);
    } catch (e) {
        console.log(e);
    }
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
        //console.log(e)
    }
}

function setTruthKeyShadows(err) {
    //console.log(keys)
    for (let element of keyArr) {
        for (let x of keyPressProperties) {
            element.style[x] = (err ? keyErr : keySucc);
        }
    }
}

function clearKeyShadows() {
    for (let element of keyArr) {
        for (let x of keyPressProperties) {
            element.style[x] = null;
        }
    }

    keyArr.length = 0;
}