//Interface stores the 3 passwords for the user, and what services they're for
import * as passGens from './generator';
const services = ['Email', 'Facebook', 'Bank'];
const shapes = Object.keys(passGens);
/**
 * @name {createPasswordObj}
 * Creates an object of 3 password schemes
 * @returns {PasswordObj} 
 */
/**
 * @name {createPwdScheme}
 * Creates a random password scheme
 * @param {any} serviceIdx 
 * @returns {PwdScheme} 
 */
/**
 * @name {createRandomShapes}
 * Creates a random array of shapes based on shapes imported from generator
 * @returns {Array<Shapes>} 
 */
/**
 * @name {randomArrayElement}
 * Selects a random element in an array
 * @param arr
 * @returns A random array element
 */
/**
 * @name {randomInteger}
 * Selects a random number between min and max
 * @param min 
 * @param max 
 */

/**
 * @interface Shapes
 */
interface Shapes {
    type: string;
    shape: string;
}

/**
 * @interface PwdScheme
 */
interface PwdScheme {
    service: string;
    attempts: number;
    shapes: Array<Shapes>;
}

/**
 * @interface PasswordObj
 */
interface PasswordObj {
    pw1: PwdScheme;
    pw2: PwdScheme;
    pw3: PwdScheme;
}


function createPasswordObj(): PasswordObj {
    return {
        pw1: createPwdScheme(0),
        pw2: createPwdScheme(1),
        pw3: createPwdScheme(2)
    };
}


function createPwdScheme(serviceIdx): PwdScheme {
    return {
        service: services[serviceIdx],
        shapes: createRandomShapes(),
        attempts: 3
    };
}


function createRandomShapes(): Array<Shapes> {
    const numOfShapes = 2;

    const shapeArr: Array<Shapes> = [];
    for (let i = 0; i < numOfShapes; i++) {
        const shapesCpy = Object.create(shapes);
        const randomShape = passGens[randomArrayElement(shapesCpy)];
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