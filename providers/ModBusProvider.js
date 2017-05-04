var ModbusRTU = require("modbus-serial");
var BaseProvider = require('./BaseProvider.js');

module.exports = class ModBusProvider extends BaseProvider {
    constructor(host, deviceNumber) {
        super(host, deviceNumber);
        this.client = new ModbusRTU();
        this.init();
    }

    init() {
        this.client.connectTCP(this.host);
        this.client.setID(this.deviceNumber);
    }

    read(address, nbRegisters, callback) {
        this.client.readHoldingRegisters(address, nbRegisters, callback);
    }
}
