"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passGens = require("./generator");
const services = ['Email', 'Facebook', 'Bank', 'Amazon', 'eBay'];
const shapes = Object.keys(passGens);
function createPasswordObj() {
    return {
        pw1: createPwdScheme(),
        pw2: createPwdScheme(),
        pw3: createPwdScheme()
    };
}
exports.createPasswordObj = createPasswordObj;
function createPwdScheme() {
    const randomService = randomArrayElement(services);
    return {
        service: randomService,
        shapes: createRandomShapes(),
        attempts: 3
    };
}
const createRandomShapes = function createRandomShapes() {
    const numOfShapes = randomInteger(2, 4);
    const shapeArr = [];
    for (let i = 0; i < numOfShapes; i++) {
        console.log(passGens[randomArrayElement(shapes)].name.split('_')[1]);
        const randomShape = passGens[randomArrayElement(shapes)];
        shapeArr.push({ type: randomShape.name.split('_')[1], shape: randomShape() });
    }
    return shapeArr;
};
const randomArrayElement = function (arr) {
    const randomIdx = randomInteger(0, arr.length - 1);
    return arr[randomIdx];
};
const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
//# sourceMappingURL=password.js.map