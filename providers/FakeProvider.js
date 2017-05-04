var ModbusRTU = require("modbus-serial");
var BaseProvider = require('./BaseProvider.js');

module.exports = class FakeProvider extends BaseProvider {
    constructor(host, deviceNumber) {
        super(host, deviceNumber);
    }

    read(address, nbRegisters, callback) {
		const values = [];
		for (let i = 0 ; i < nbRegisters ; i++) {
			values[i] = Math.round(((address + i) + Math.random()) * 10);
		}

		return callback(false, {data: values});
    }
}
