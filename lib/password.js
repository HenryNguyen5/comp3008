//Interface stores the 3 passwords for the user, and what services they're for
var services = ['Email', 'Facebook', 'Bank', 'Amazon', 'eBay'];
function createPwdScheme() {
    var randomService = randomArrayElement(services);
    return {
        service: randomService,
        password: randomPass(),
        attempts: 3
    };
}
function createPasswordObj() {
    return {
        pw1: createPwdScheme(),
        pw2: createPwdScheme(),
        pw3: createPwdScheme()
    };
}
var randomArrayElement = function (arr) {
    var randomIdx = randomInteger(0, arr.length - 1);
    return arr[randomIdx];
};
var randomInteger = function (min, max) {
    return Math.floor(Math.random() * (min - max) + min);
};
var randomPass = function () {
    return 'a';
};
