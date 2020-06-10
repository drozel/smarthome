
var nodered = require('./nodered_env')
var env = nodered.env;
var flow = nodered.flow;
var global = nodered.global; 
var node = nodered.node;

module.exports = function(msg) {
const Rooms = [
    {
        sensors: ['window'],
        name: 'bedroom',
    },
    {
        sensors: ['window', 'balcony_door'],
        name: 'living',
    },
];

// find room for sensor
var room;
var sensor;
Rooms.forEach(r => {
    for (var s of r.sensors) {
        if (msg.topic == `${r.name}.${s}.opened`) {
            room = r;
            sensor = s;
        }
    }
});
    
if (!room || !sensor) {
    node.warn(`couldn't interpret sensor: ${msg.topic}`);
    return;
}

// save current state
global.set(`${room.name}.${sensor}_state`, msg.payload);

node.log(`${room.name} sensor: ${msg.topic}, state: ${msg.payload}`);

var rv = {
    topic: `${room.name}.any_window.opened`,
    payload: null,
};

if (msg.payload === true) { // current window opened, return opened independent on other sensors
    node.log(`result state: true`);
    rv.payload = true;
    return rv;
}

// current window is closed but we should check other ones
// get all room sensor states (current one is also saved there in actual state)
var allSensorStates = [];
for (var s of room.sensors) {
    var currentState = global.get(`${room.name}.${s}_state`);
    node.log(`existing sensor ${s}: ${currentState}`);
    
    if (currentState === undefined) return; // one of room sensors is unknown yet, we will proceed in the next iteration
    allSensorStates.push(currentState);
}

// room is opened if one of windows opened
var roomState = false;
allSensorStates.forEach(function(st) {
    roomState = roomState || st;
});

node.log(`result state: ${roomState}`);

return {
    topic: `${room.name}.any_window.opened`,
    payload: roomState,
};

}