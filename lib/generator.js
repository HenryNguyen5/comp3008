"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
];
const width = 10;
const height = 4;
const min_rect_size = 3;
const min_line_size = 3;
const generate_rect = function generate_rect() {
    let str = "";
    const start_x = rand_int(0, width - min_rect_size);
    const start_y = rand_int(0, height - min_rect_size);
    const end_x = rand_int(start_x + min_rect_size, width);
    const end_y = rand_int(start_y + min_rect_size, height);
    for (let x = start_x; x <= end_x; x++) {
        str += keyboard[start_y][x];
    }
    for (let y = start_y + 1; y <= end_y; y++) {
        str += keyboard[y][end_x];
    }
    for (let x = end_x - 1; x > start_x; x--) {
        str += keyboard[end_y][x];
    }
    for (let y = end_y; y > start_y; y--) {
        str += keyboard[y][start_x];
    }
    return str;
};
exports.generate_rect = generate_rect;
const generate_line = function generate_line() {
    let str = "";
    const horizontal = Math.random() < 0.5 ? true : false;
    if (horizontal) {
        const y = rand_int(0, height);
        const start_x = rand_int(0, width - min_line_size);
        const end_x = rand_int(start_x + min_line_size, width);
        for (let x = start_x; x < end_x; x++) {
            str += keyboard[y][x];
        }
    }
    else {
        const x = rand_int(0, width);
        const start_y = rand_int(0, height - min_line_size);
        const end_y = rand_int(start_y + min_line_size, height);
        for (let y = start_y; y < end_y; y++) {
            str += keyboard[y][x];
        }
    }
    return str;
};
exports.generate_line = generate_line;
const rand_int = function (min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
};
console.log(generate_line());
//# sourceMappingURL=generator.js.map