/*
    Alexandre Skipper
    100978454
*/
var keyboard = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
];
var width = 10; //columns
var height = 4; //rows
var min_rect_size = 3; //min size of a rectangle
var min_line_size = 3; //min size of a line
/*
    returns a string of characters forming a rectangle
*/
var generate_rect = function () {
    var string = "";
    //top left corner of rectangle
    var start_x = rand_int(0, width - min_rect_size);
    var start_y = rand_int(0, height - min_rect_size);
    //bottom right corner of rectangle
    var end_x = rand_int(start_x + min_rect_size, width);
    var end_y = rand_int(start_y + min_rect_size, height);
    //top of rectangle
    for (var x = start_x; x <= end_x; x++)
        string += keyboard[start_y][x];
    //right side of rectangle
    for (var y = start_y + 1; y <= end_y; y++)
        string += keyboard[y][end_x];
    //bottom of rectangle
    for (var x = end_x - 1; x > start_x; x--)
        string += keyboard[end_y][x];
    //left side of rectangle
    for (var y = end_y; y > start_y; y--)
        string += keyboard[y][start_x];
    return string;
};
/*
    returns a string of characters forming a line
*/
var generate_line = function () {
    var string = "";
    var horizontal = Math.random() < 0.5 ? true : false;
    if (horizontal) {
        var y = rand_int(0, height);
        var start_x = rand_int(0, width - min_line_size);
        var end_x = rand_int(start_x + min_line_size, width);
        for (var x = start_x; x < end_x; x++)
            string += keyboard[y][x];
    }
    else {
        var x = rand_int(0, width);
        var start_y = rand_int(0, height - min_line_size);
        var end_y = rand_int(start_y + min_line_size, height);
        for (var y = start_y; y < end_y; y++)
            string += keyboard[y][x];
    }
    return string;
};
/*
    @param min : minimum value
    @param max : maximum value
    @return : random integer in the range [min, max)
*/
var rand_int = function (min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
};
console.log(generate_line());
