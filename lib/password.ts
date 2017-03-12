//Interface stores the 3 passwords for the user, and what services they're for
const services = ['Email', 'Facebook', 'Bank', 'Amazon', 'eBay'];

interface PwdScheme {
    service: string;
    password: string;
    attempts: number;
}
interface PasswordObj {
    pw1: PwdScheme;
    pw2: PwdScheme;
    pw3: PwdScheme;
}

function createPwdScheme(): PwdScheme {
    const randomService = randomArrayElement(services);
    return {
        service: randomService,
        password: randomPass(),
        attempts: 3
    };
}

function createPasswordObj(): PasswordObj {
    return {
        pw1: createPwdScheme(), 
        pw2: createPwdScheme(),
        pw3: createPwdScheme()
    };
}

const randomArrayElement = function(arr:Array<any>):any {
    const randomIdx = randomInteger(0, arr.length -1);
    return arr[randomIdx];
}

const randomInteger = function (min:number, max:number):number{
    return Math.floor(Math.random() * (min - max) + min);
}

const randomPass = function() {
    return 'a';
}