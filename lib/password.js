"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passGens = require("./generator");
const services = ['Email', 'Facebook', 'Bank'];
const shapes = Object.keys(passGens);
function createPasswordObj() {
    return {
        pw1: createPwdScheme(0),
        pw2: createPwdScheme(1),
        pw3: createPwdScheme(2)
    };
}
exports.createPasswordObj = createPasswordObj;
function createPwdScheme(serviceIdx) {
    return {
        service: services[serviceIdx],
        shapes: createRandomShapes(),
        attempts: 3
    };
}
const createRandomShapes = function createRandomShapes() {
    const numOfShapes = randomInteger(2, 3);
    const shapeArr = [];
    for (let i = 0; i < numOfShapes; i++) {
        let shapesCpy = Object.create(shapes);
        const randomShape = passGens[randomArrayElement(shapesCpy)];
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