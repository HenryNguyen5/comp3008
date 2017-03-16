#!/usr/bin/env node

/* -*-mode: javascript-*- */
/* The above line forces this file into javascript mode in emacs */

/**
 * Module dependencies.
 */
//172.31.192.36/
const app = require('../app');
import http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.argv[2] || process.env.PORT || '3000');
app.set('port', port);

const ipAddress = (process.argv[3] || 'localhost');
/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, ipAddress);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ?
		'Pipe ' + port :
		'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ?
		'pipe ' + addr :
		'port ' + addr.port;
	console.log('Listening on ' + bind);
}

const serverDown = function () {
	console.log("Server shutting down.");
	process.exit(0);
};

process.on('SIGINT', serverDown);
