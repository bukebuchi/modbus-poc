# ModBus-Websocket prototype

Proof of concept about reading registers from modbus device into a browser with websockets.

Simple nodejs project with two dependencies:
* modbus-serial
* websocket

Comes with  HTML file to read the values from websocket (charts based on Smoothie Charts).

The server reads the same 3 registers each second and broadcast it to all clients.

## Usage

First: `npm install`, then...

### Server

Two modes are available: connected or faked (debug/offline mode).

`node index.js <host> <slave_id>`

Establish a TCP connection and read the register 40150, 40151, 40152 (based on Schneider Electric ION 7650 register map). Respectively Ia, Ib, Ic.

`node index.js debug`

Fake a ModBus provider and throw random values.

### Client

Open `index.html` in a browser (tested with Firefox and Chrome) and look at the values.
