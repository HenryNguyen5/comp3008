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

const width = keyboard[0].length; //columns
const height = keyboard.length; //rows
const min_rect_size = 1; //min size of a rectangle -1?
const max_rect_size = 4; //max size of a rectangle
const min_line_size = 3; //min size of a line
const min_tri_size = 2;
const max_tri_size = 4;

/*
	returns a string of characters forming a rectangle
*/
const generate_rect = function generate_rect() {
	let str = "";
	//top left corner of rectangle
	const start_x = rand_int(0, width - min_rect_size);
	const start_y = rand_int(0, height - min_rect_size);
	//bottom right corner of rectangle
	let end_x = rand_int(start_x + min_rect_size, start_x + max_rect_size);
	end_x > width-1 ? end_x = width-1 : end_x; //
	let end_y = rand_int(start_y + min_rect_size, height);
	
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

	let size_x = end_x - start_x+1;
	let size_y = end_y - start_y+1;

	let r = Math.random();
	let index;
	//choose corner
	if (r < 0.25) {
		index = 0;
	}
	else if (r < 0.5) {
		index = size_x;
	}
	else if (r < 0.75) {
		index = size_x; + size_y;
	}
	else {
		index = size_x*2 + size_y;
	}

	let arr = str.split('');
	let end = arr.splice(index, arr.length-index+1);
	arr = end.concat(arr);
	str = arr.join('');

	//reverse
	if (Math.random() < 0.5) str = str.split('').reverse().join('');

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

	if (Math.random() < 0.5) str = str.split('').reverse().join('');

	return str;
};

/*
	returns a string of characters forming a triangle
*/
const generate_triangle = function generate_triangle() {
	let str = "";
	//choose size (2-4)
	const size = rand_int(min_tri_size, max_tri_size+1);
	//choose top corner of triangle
	const start_x = rand_int(size-1, width);
	const start_y = rand_int(0, height-(size-1));
	//add right side
	for (let i=0; i<size; i++) {
		str += keyboard[start_y+i][start_x];
	}
	//add bottom
	for (let i=1; i<size; i++) {
		str += keyboard[start_y+size-1][start_x-i];
	}
	//add left side
	for (let i=1; i<size-1; i++) {
		str += keyboard[start_y+(size-1)-i][start_x-(size-1)+i];
	}

	if (Math.random() < 0.5) str = str.split('').reverse().join('');

	return str;
}

/*
	@param min : minimum value
	@param max : maximum value
	@return : random integer in the range [min, max)
*/
const rand_int = function (min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
};
console.log(generate_triangle());
export { generate_line, generate_rect, generate_triangle }