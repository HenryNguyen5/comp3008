/* global anime */
let setup;
let data;
let logData = false;
let logs = [];

const keyPressProperties = ["-webkit-box-shadow", "-moz-box-shadow", "box-shadow"];
const keyErr = "0px 0px 102px -3px rgba(255,59,59,0.82)"
const keySucc = " 0px 0px 50px 14px rgba(136, 209, 153, 0.77)";
let keyArr = []

$(function () {
    $.ajax({
        method: "GET",
        url: '/getPassword',
        success: (recvData) => {
            data = recvData;
            setup = new Setup(data, logData);
            setup.renderNextShape();
        },
        dataType: 'json'
    });



    //enter key handler
    $("#pwBox").keypress(function (ev) {
        let input = $(this).val();

        if (ev.which === 13) {
            let valid = validUserInput(input);
            (valid ? checkLast() : null);
            $(this).val("");
        }

        function validUserInput(input) {
            let valid = setup.validPassword(input);
            if (logData) {
                updateLog(valid);
            }
            setTruthKeyShadows(valid);
            setTimeout(() => (valid ? setup.renderNextShape() : null), 600);
            setTimeout(() => clearKeyShadows(), 600);
            return valid;
        }

        function updateLog(valid) {
            let logsLen = logs.length - 1;
            console.log(logs)
            if (valid) {
                logs[logsLen].stopPwTimer()
            } else {
                logs[logsLen].incFailures()
            }
            if (logs[logsLen].failed) {
                setup.skipPw();
                logs.push(new Log(setup.getCurrentServiceAndShapes()));
            }
        }

        function checkLast() {
            console.log('checkLast called', setup.checkLastPassword(), setup.checkLastShape(), !logData)
            if (setup.checkLastPassword() && setup.checkLastShape() && !logData) {
                logMode();
            } else if (setup.checkLastPassword() && setup.checkLastShape() && logData) {
                end();
            }
        }

        function logMode() {
            //randomize data set here 
            removeAnimation();
            logData = true;
            setup = new Setup(data, logData);
            logs.push(new Log(setup.getCurrentServiceAndShapes()));
            setup.renderNextShape();
        }
    });

    class Password {
        constructor(pw) {
            Object.assign(this, pw);
            this.shapeIdx = 0;
            this.firstShape = true;
        }
        getCurShape() {
            console.log(this.shapeIdx)
            return this.shapes[this.shapeIdx].shape;
        }
        validShape(shape) {
            console.log(this.getCurShape(), shape)
            return this.getCurShape() === shape.toUpperCase();
        }
        incShape() {
            this.shapeIdx++;
            this.firstShape = false;
        }
        isLastShape() {
            return this.shapeIdx === this.shapes.length - 1;
        }
        reset() {
            this.shapeIdx = 0;
        }
    }
    class Passwords {

        constructor(pws) {
            this.passwords = this.intializePws(pws);
            this.currentPasswordIdx = 0;
        }
        intializePws(pws) {
            let pwKeys = Object.keys(pws);
            return pwKeys.map(key => new Password(pws[key]));
        }
        getCurrentPassword() {
            return this.passwords[this.currentPasswordIdx];
        }
        getCurrentService() {
            return this.getCurrentPassword().service;
        }
        getShapesFromCurPw() {
            return this.getCurrentPassword().shapes;
        }
        isLastPass() {
            return this.currentPasswordIdx === this.passwords.length - 1;
        }
        isLastShape() {
            return this.getCurrentPassword().isLastShape();
        }
        incPassword() {
            if (this.currentPasswordIdx < this.passwords.length)
                this.currentPasswordIdx++;
        }
        validUserInput(ui) {
            console.log("validating password")
            let curPass = this.getCurrentPassword();

            if (curPass.validShape(ui)) {
                if (this.isLastShape()) {
                    this.incPassword();
                }
                curPass.incShape();
                return true;
            } else {
                return false;
            }
        }

    }

    /**
     * sets the shapes underneath the input bar
     * @param {Array} shapes
     */
    const setShapeIcons = function (shapes) {
        let domIdx = 0;
        for (let shape of shapes) {
            let icon = '';
            (shape.type === 'rect' ? icon = '▱' : icon = '━');
            $(`#shape${domIdx}`).html(icon);
            domIdx++;
        }
    }

    class Setup {
        constructor(data, loggingMode) {
            this.passwords = new Passwords(data);
            this.loggingMode = loggingMode;
            console.log("setup started")
        }
        getCurrentServiceAndShapes() {
            return {
                shapes: this.passwords.getShapesFromCurPw(),
                service: this.passwords.getCurrentService()
            }
        }
        checkLastShape() {
            return this.passwords.isLastShape();
        }
        checkLastPassword() {
            return this.passwords.isLastPass();
        }
        skipPw() {
            this.passwords.incPassword();
        }
        renderNextShape() {
            //show the animation if we're not logging
            console.log(this.passwords.getCurrentPassword())
            if (!this.loggingMode) {
                renderAnimation(this.passwords.getCurrentPassword().getCurShape());
            }
            setShapeIcons(this.passwords.getShapesFromCurPw());
            //if its the first shape then render the modal too
            if (this.passwords.getCurrentPassword().firstShape) {
                this.setServiceModal(this.passwords.getCurrentService());
            }

        }
        validPassword(input) {
            if (this.loggingMode) {
                logs[logs.length - 1].setReceivedShapes(input);
            }
            let valid = this.passwords.validUserInput(input)
            console.log('validPassword', valid);
            return valid;
        }
        setServiceModal(service) {
            $("#service").modal('show');
            let modalInstructions = '';
            if (!this.loggingMode) {
                modalInstructions = `Here is your password for: <b>${service}</b>. Your password consists of a <b> combination of TWO shapes </b>. Input your password by following the arrow.`
            } else {
                modalInstructions = `Enter your password that was previously given to you for  <b>${service}</b>. Remeber, Your password consists of a <b> combination of TWO shapes </b>.`
            }

            $("#instructions").html(modalInstructions);
            $("#serviceBar").html((this.loggingMode ? `Enter password for: ${service}` : `Generated password for: ${service}`));
        }
    }

    class Log {
        constructor(data) {
            this.givenShapes = data.shapes;
            this.service = data.service;
            this.receivedShapes = [];
            this.failed = false;
            this.loginTime = 0;
            this.attempts = 0;
            this.max_attempts = 3;
        }

        beginPwTimer() {
            this.loginTime = performance.now()
        }
        stopPwTimer() {
            this.loginTime = performance.now() - this.loginTime;
        }
        setReceivedShapes(userInput) {
            this.receivedShapes.push(userInput);
        }
        incFailures() {
            this.attempts++;
            if (this.attempts === this.max_attempts) {
                this.failed = true;
                this.stopPwTimer();
            }
        }
        toJSON() {
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
        console.log(logs);
        $("#service").modal('show');
        $("#instructions").html("You're done! Thanks for participating");
        let results = logs.map(l => l.toJSON());
        //send reponse to the server here
        $.post("/testResults", JSON.stringify(results, null, 2));
    }

    function removeAnimation() {
        $('#motionPath').remove();
    };

    /**
     * Loads the arrow animation
     * 
     * @param {String} shape 
     */
    const renderAnimation = function (shape) {
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
        let e = document.getElementById('pwPath');
        e.setAttribute('d', path);
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


        let ele = element.getClientRects()[0];
        let middleX = ele.left + (ele.width / 1.4) - (offset.left - position.left)
        let middleY = ele.top - (offset.top - position.top) + (ele.height / 1.9);
        return {
            x: Math.floor(middleX),
            y: Math.floor(middleY)
        };
    };





    function setTruthKeyShadows(err) {
        //console.log(keys)
        for (let element of keyArr) {
            for (let x of keyPressProperties) {
                element.style[x] = (!err ? keyErr : keySucc);
            }
        }
    }

    function clearKeyShadows() {
        //console.log(keys)
        for (let element of keyArr) {
            for (let x of keyPressProperties) {
                element.style[x] = null;
            }
        }
        keyArr.length = 0;
    }

    $(document).click(() => {
        $('#pwBox').focus();
    })
});
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