//Interface stores the 3 passwords for the user, and what services they're for
import * as passGens from './generator';
const services = ['Email', 'Facebook', 'Bank', 'Amazon', 'eBay'];
const shapes = Object.keys(passGens);

interface Shapes {
    type: string;
    shape: string;
}

interface PwdScheme {
    service: string;
    attempts: number;
    shapes: Array<Shapes>;
}
interface PasswordObj {
    pw1: PwdScheme;
    pw2: PwdScheme;
    pw3: PwdScheme;
}

function createPasswordObj(): PasswordObj {
    return {
        pw1: createPwdScheme(),
        pw2: createPwdScheme(),
        pw3: createPwdScheme()
    };
}

function createPwdScheme(): PwdScheme {
    const randomService = randomArrayElement(services);
    return {
        service: randomService,
        shapes: createRandomShapes(),
        attempts: 3
    };
}

const createRandomShapes = function createRandomShapes(): Array<Shapes> {
    const numOfShapes = randomInteger(2, 4);

    const shapeArr: Array<Shapes> = [];
    for (let i = 0; i < numOfShapes; i++) {
        console.log(passGens[randomArrayElement(shapes)].name.split('_')[1]);

        const randomShape = passGens[randomArrayElement(shapes)];
        //console.log(`Shape selected: ${randomShape}`);
        shapeArr.push({ type: randomShape.name.split('_')[1], shape: randomShape() });
    }
    return shapeArr;
};

const randomArrayElement = function (arr: Array<any>): any {
    const randomIdx = randomInteger(0, arr.length - 1);
    return arr[randomIdx];
};

const randomInteger = function (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export { createPasswordObj, PasswordObj, PwdScheme }