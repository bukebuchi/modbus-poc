var ModBusProvider = require('./providers/ModBusProvider');
var FakeProvider = require('./providers/FakeProvider');
var WebSocketServer = require('websocket').server;
var http = require('http');

const args = process.argv.slice(2, process.argv.length);
let host, deviceNumber, provider;
if (args.length >= 2) {
	[host, deviceNumber] = args;
	provider = new ModBusProvider(host, parseInt(deviceNumber));
}
else if (args.length === 1 && args[0] === 'debug') {
	console.warn('DEBUG MODE: ModBus won\'t be used');
	provider = new FakeProvider('debug', -1);
}
else {
	console.log(`USAGE: node index.js <host> <device>`);
	console.log(`...... node index.js debug`);
	process.exit();
}

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
	// Set CORS headers
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');
	if (request.method === 'OPTIONS') {
		response.writeHead(200);
		response.end();
		return;
	}

    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 

let clients = [];
wsServer.on('request', function(request) {

    console.log((new Date()) + ' Connection accepted.');
	const connection = request.accept(null, request.origin);
	clients.push(connection);

	connection.on('message', function(message) {
		console.log('Received Message: ' + message.utf8Data);
		connection.sendUTF(message.utf8Data);
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		const connectionIndex = clients.indexOf(connection);
		if (connectionIndex !== -1) {
			clients = clients.splice(connectionIndex, 1);
		}
    });
});

setInterval(() => {
	provider.read(149, 3, (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('Received data: ' + data.data);
		const str = JSON.stringify(data.data);
		clients.forEach(c => {
			c.sendUTF(str);
		})
	})
}, 1000);
