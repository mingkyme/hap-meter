const hap = require("hap-nodejs");
const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

const mqtt = require('mqtt');
const mqttOption = require('./secret/mqtt.json');
const meterOption = require('./secret/meter.json');

const client  = mqtt.connect(mqttOption.host,mqttOption);
client.on("connect", () => { });
client.subscribe(`iot/meter/${meterOption.meterId}/state`);

var temperature = 0.0;
var humidity = 0;
client.on('message',(topic,payload,packet) =>{
    temperature = JSON.parse(payload).temperature.c;
    humidity = JSON.parse(payload).humidity;
});

// Temperature Sensor
const tAccessoryUuid = hap.uuid.generate("me.mingky.temperature");
const tAccessory = new Accessory("temperature sensor", tAccessoryUuid);
const tMeterService = new Service.TemperatureSensor("temperature sensor");
const currentTemperatureCharacteristic = tMeterService.getCharacteristic(Characteristic.CurrentTemperature);
currentTemperatureCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    callback(undefined, temperature);
});
tAccessory.addService(meterService);
tAccessory.publish({
    username: "17:51:07:F4:BC:9B",
    pincode: "123-45-678",
    port: 47130,
    category: hap.Categories.SENSOR,
});

// Humidity Sensor
const hAccessoryUuid = hap.uuid.generate("me.mingky.humidity");
const hAccessory = new Accessory("humidity sensor", hAccessoryUuid);
const hMeterService = new Service.HumiditySensor("humidity sensor");
const currentRelativeHumidityCharacteristic = hMeterService.getCharacteristic(Characteristic.CurrentRelativeHumidity);
currentRelativeHumidityCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    callback(undefined, humidity);
});
hAccessory.addService(meterService);
hAccessory.publish({
    username: "17:51:07:F4:BC:5A",
    pincode: "123-45-678",
    port: 47131,
    category: hap.Categories.SENSOR,
});

console.log("Accessory setup finished!");
