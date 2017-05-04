'use strict';

module.exports = class BaseProvider {
	constructor(host, deviceNumber) {
		this.host = host;
		this.deviceNumber = deviceNumber;
	}

	read(address, nbRegisters, callback) {
		throw new Error('Not implemented');
	}
}
