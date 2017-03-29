/*
	Alexandre Skipper
	100978454
*/

const keyboard = [
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
	["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
];

const width = 5; //columns
const height = 4; //rows
const min_rect_size = 3; //min size of a rectangle
const min_line_size = 3; //min size of a line

/*
	returns a string of characters forming a rectangle
*/
const generate_rect = function generate_rect() {
	let str = "";
	//top left corner of rectangle
	const start_x = rand_int(0, width - min_rect_size);
	const start_y = rand_int(0, height - min_rect_size);
	//bottom right corner of rectangle
	const end_x = rand_int(start_x + min_rect_size, width);
	const end_y = rand_int(start_y + min_rect_size, height);

	//top of rectangle
	for (let x = start_x; x <= end_x; x++) {
		str += keyboard[start_y][x];
	}

	//right side of rectangle
	for (let y = start_y + 1; y <= end_y; y++) {
		str += keyboard[y][end_x];
	}

	//bottom of rectangle
	for (let x = end_x - 1; x > start_x; x--) {
		str += keyboard[end_y][x];
	}

	//left side of rectangle
	for (let y = end_y; y > start_y; y--) {
		str += keyboard[y][start_x];
	}


	return str;
};

/*
	returns a string of characters forming a line
*/
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

/*
	@param min : minimum value
	@param max : maximum value
	@return : random integer in the range [min, max)
*/
const rand_int = function (min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
};

console.log(generate_line());

export { generate_line, generate_rect }