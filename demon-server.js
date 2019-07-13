#!/usr/bin/node --harmony
const ModbusRTU = require("modbus-serial");

const vector = {
    getInputRegister: function(addr) { return addr; },
    getDiscreteInput: function(addr) { return (addr % 2) === 0; },
    getHoldingRegister: function(addr) { return addr + 123; },
    getMultipleInputRegisters: function(startAddr, length) {
        var values = [];
        for (var i = 0; i < length; i++) {
            values[i] = startAddr + i;
        }
        return values;
    },
    getMultipleHoldingRegisters: function(startAddr, length) {
        var values = [];
        for (var i = 0; i < length; i++) {
            values[i] = startAddr + i + 20;
        }
        return values;
    },
    getCoil: function(addr) { return (addr % 2) === 0; },
    setRegister: function(addr, value) { console.log("set register", addr, value); return; },
    setCoil: function(addr, value) { console.log("set coil", addr, value); return; },
    readDeviceIdentification: function(addr) {
        return {
            0x00: "MyVendorName",
            0x01: "MyProductCode",
            0x02: "MyMajorMinorRevision",
            0x05: "MyModelName",
            0x97: "MyExtendedObject1",
            0xAB: "MyExtendedObject2"
        };
    }
};

console.log("ModbusTCP listening on modbus://0.0.0.0:502");
const serverTCP = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 502, debug: true, unitID: 1 });

serverTCP.on("initialized", function() {
    console.log("initialized");
});

serverTCP.on("socketError", function(err) {
    console.error(err);
    serverTCP.close(() => {
        console.log("server closed");
    });
});
