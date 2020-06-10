var nodered = require('./nodered_env')
var env = nodered.env;
var flow = nodered.flow;
var global = nodered.global; 
var node = nodered.node;

module.exports = function(msg) {
///////////////////////////////////////////// Constants
// settings for set as overlay for heating locking
const Lock = {
	temperature: 5, // min temp to distinguish it from OFF. So we can drop saved overlay when locked
	terminationType: 'MANUAL',
	power: 'ON',
};

const Locks = [
	{
		name: 'window_opened',
		suppressable: false,
	},
	{
		name: 'manual_lock',
		suppressable: true,
		suppressedCb: function(by) { logInfo('manual disable suppressed by ' + by); },
	}
];

const ClearOverlay = {
	zoneId: env.get('zoneId')
};

const RoomName = env.get('zoneName');

///////////////////////////////////////////// Helpers
var formatDate = function(date) { 
	if (date === null) return '∞';
	return date;
};

const logger = global.get('system.logger');
var logInfo = function(msg) {
	logger.info(`Heating ${RoomName}: ${msg}`);
};


//////////////////////////////////////////// Functions
var tempFromOverlay = function (overlay) {
	if (overlay.setting.power === 'OFF') return 'OFF';
	else                                 return overlay.setting.temperature.celsius;
};

var logDebug = function(msg) { node.log(`Heating machine ${RoomName}: ${msg}`); };

var lockHeating = function() {
	retShouldSetOverlay = {
		zoneId: env.get('zoneId'),
		power: Lock.power,
		temperature: Lock.temperature,
		terminationType: Lock.terminationType,
	};
};

var isLockingOverlay = function(overlay) {
	if (overlay === null) return false;
	
	var isLocking = 
		(overlay.termination.type  === Lock.terminationType) &&
		(overlay.setting.power === Lock.power);
		
	if (overlay.setting.power === 'ON') {
		isLocking = isLocking && (tempFromOverlay(overlay) === Lock.temperature);
	}
	
	return isLocking;
};

var saveOverlay = function(overlay) {
	if (!overlay) return;
	
	logDebug(`saving overlay: ${JSON.stringify(overlay)}`)
	global.set(`${RoomName}.overlay`, overlay);
};

var restoreOverlay = function() {
	const savedOverlay = global.get(`${RoomName}.overlay`) || null;
	if (!savedOverlay) return;
	
	logDebug(`Saved overlay: ${JSON.stringify(savedOverlay)}`);

	// time can be expired, we need to restore it
	var remainingTime = function(overlay) {
		var oldExpiryDate = Date(overlay.termination.projectedExpiry);
		var untilExpireSec = (Date.now() - oldExpiryDate) / 1000;
		
		// overlay is about to expire, don't return it
		if (untilExpireSec < 60) return null;
		
		return untilExpireSec;
	};

	var newRemaining = null;
	if (savedOverlay.termination.type == 'TIMER') {
		newRemaining = remainingTime(savedOverlay);
		if (!newRemaining) {
			retShouldClearOverlay = ClearOverlay;
			logInfo(`overlay to restore expired, reset settings`);
			return;
		}
	}

	retShouldSetOverlay = {
			zoneId: env.get('zoneId'),
			power: savedOverlay.setting.power,
			temperature: savedOverlay.setting.temperature ? savedOverlay.setting.temperature.celsius : null,
			terminationType: savedOverlay.termination.type,
			terminationTimeout: newRemaining,
	};
	
	const state = savedOverlay.setting.power == "ON" ? `${savedOverlay.setting.temperature.celsius}°C` : 'OFF';
	logInfo(`settings are restored to: ${state} until ${formatDate(retShouldSetOverlay.terminationTimeout)}`);
};

var addLock = function(lock) {
	if (locks.length === 0) lockHeating(); // save overlay if the first lock
	if (!locks.includes(lock)) locks.push(lock);
};

var removeLock = function(lock) {
	const index = locks.indexOf(lock);
	if (index == -1) return;
	
	locks.splice(index, 1);
	if (locks.length === 0)
		restoreOverlay();
};

var suppressLock = function(locks, by) { // true if no locks or they can be suppressed
	var stillLocked = false;
	locks.forEach(function(lock, index, object) {
		var lockDesc = Locks.find(l => l.name === lock);
		if (lockDesc.suppressable === false) stillLocked = true;
		else {
			lockDesc.suppressedCb(by);
			retSuppressedLocks.push(lock);
			object.splice(index, 1);
		}
	});
	return stillLocked;
};

var isHeatingLocked = function() {
	return locks.length > 0;
};

var report = function(data) {
	var heatingState = data.setting.power == 'ON';
	
	var temp = null;
	if (data.setting.temperature) temp = data.setting.temperature.celsius;
	
	var until = null;
	var untilType ;
	if (data.overlay) {
		if (data.overlay.termination.type == 'MANUAL') {
			untilType = 'manual';
			until = null;
		} else 
		if (data.overlay.termination.type == 'TIMER') {
			untilType = 'timer';
			until = new Date(data.overlay.termination.projectedExpiry);
		}
	} else {
		until = new Date(data.nextScheduleChange.start);
		untilType = 'schedule';
	}
		
	return {
		payload: {
			heatingState: heatingState,
			temp: temp,
			until: until,
			untilType: untilType
		}
	};
};

var heatingActive = function(data) {
	const heatingNow = data.setting.power == 'ON';
	const canChangeAutomatically = 
		data.overlay === null ||
		data.payload.overlay.termination.type == 'TIMER';
	return heatingNow || canChangeAutomatically;
};


///////////////////////////////// CODE
if (!msg || !msg.topic) return [];

var locks = global.get(`${RoomName}.locks`) || [];

/// outputs to be processed after. In the return order
var retShouldSetOverlay = null;    // connect to TADO set overlay (format is conform)
var retShouldClearOverlay = null;  // connecto to TADO clear overlay (format is conform)
var retStatusReport = null;        // status of heating
var retSuppressedLocks = [];     // locks suppressed in this iteration. May be needed for UI button disabling


///////////////////////////////// Lock button
if (msg.topic === 'lock_heating') {
	logDebug(`lock_heating: ${msg.payload}`);
	if (msg.payload) {
		logInfo('heating locked and will not be enabled automatically');
		addLock('manual_lock');
	} else {
		logInfo('heating unlocked and can be automatically enabled');
		removeLock('manual_lock');
	}
}

///////////////////////////////// Window processing
else if (msg.topic === 'window_opened') {
	logDebug(`window_opened: ${msg.payload}`);
	if (msg.payload) {
		logInfo('window(s) opened, heating locked');
		addLock('window_opened');
	} else {
		logInfo('window(s) closed, unlock heating');
		removeLock('window_opened');
	}
}

//////////////////////////////// Tado data coming
else if (msg.topic === 'tado_update') {
	logDebug(`tado_update: ${JSON.stringify(msg.payload)}`);
	statusReport = report(msg.payload);
	
	if (!isLockingOverlay(msg.payload.overlay)) {
	    saveOverlay(msg.payload.overlay);
	}

	if (isHeatingLocked()) {
		logDebug(`heating is locked`);
		
		if (!isLockingOverlay(msg.payload.overlay)) {             // not our special locking mode
			if (suppressLock(locks, 'changing temperature manually')) { // can't suppress lock
				if (msg.payload.overlay !== null) {
				    logInfo(`settings changed during lock, save new: ${tempFromOverlay(msg.payload.overlay)}°C until ${formatDate(msg.payload.overlay.termination.projectedExpiry)}`);
				}
				
				logDebug(`overlay has changed, restore locking overlay`);
				lockHeating(); // new settings must go in order to lock heating
				statusReport = null; // skip this time, data is being changed right now
			} 
		}
	}
	
	retStatusReport = statusReport;
}

/////////////////////////////// Unknown command
else {
	return [];
}

// save updated locks
logDebug(`saving locks: ${locks}`);
global.set(`${RoomName}.locks`, locks);

const rv = [retShouldSetOverlay, retShouldClearOverlay, retStatusReport, retSuppressedLocks];
logDebug(`returning: ${JSON.stringify(rv)}`);
return rv;
}