var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style


var heating = require('./heating-machine');
var window = require('./window_processor.js')

var node_env = require('./nodered_env');
var resetContext = node_env.resetContext;
var env = node_env.env;
var global = node_env.global;

describe('heating machine test', function() {
	const DisabledForAlways = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"OFF","temperature":null},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"OFF","temperature":null},"termination":{"type":"MANUAL","typeSkillBasedApp":"MANUAL","projectedExpiry":null}},"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-05-31T18:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-05-31T12:31:21.093Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":15.59,"fahrenheit":60.06,"timestamp":"2020-05-31T12:40:34.347Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":40.4,"timestamp":"2020-05-31T12:40:34.347Z"}}};
	const DisabledFor1Hour = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"OFF","temperature":null},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"OFF","temperature":null},"termination":{"type":"TIMER","typeSkillBasedApp":"TIMER","durationInSeconds":3570,"expiry":"2020-05-31T13:39:57Z","remainingTimeInSeconds":3514,"projectedExpiry":"2020-05-31T13:39:57Z"}},"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-05-31T18:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-05-31T12:31:21.093Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":15.59,"fahrenheit":60.06,"timestamp":"2020-05-31T12:40:34.347Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":40.4,"timestamp":"2020-05-31T12:40:34.347Z"}}};
	const FiveForAlways = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"ON","temperature":{"celsius":5,"fahrenheit":41}},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":5,"fahrenheit":41}},"termination":{"type":"MANUAL","typeSkillBasedApp":"MANUAL","projectedExpiry":null}},"openWindow":null,"nextScheduleChange":{"start":"2020-05-31T20:00:00Z","setting":{"type":"HEATING","power":"OFF","temperature":null}},"nextTimeBlock":{"start":"2020-05-31T20:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-05-31T12:23:34.015Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":18.54,"fahrenheit":65.37,"timestamp":"2020-05-31T12:26:32.027Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":38.4,"timestamp":"2020-05-31T12:26:32.027Z"}}};
	const FiveFor1Hour = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"ON","temperature":{"celsius":5,"fahrenheit":41}},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":5,"fahrenheit":41}},"termination":{"type":"TIMER","typeSkillBasedApp":"TIMER","durationInSeconds":3600,"expiry":"2020-05-31T13:39:53Z","remainingTimeInSeconds":3595,"projectedExpiry":"2020-05-31T13:39:53Z"}},"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-05-31T18:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-05-31T12:31:21.093Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":15.53,"fahrenheit":59.95,"timestamp":"2020-05-31T12:35:48.362Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":40.1,"timestamp":"2020-05-31T12:35:48.362Z"}}};
	const TwentyFiveForAlways = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"ON","temperature":{"celsius":25,"fahrenheit":77}},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":25,"fahrenheit":77}},"termination":{"type":"MANUAL","typeSkillBasedApp":"MANUAL","projectedExpiry":null}},"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-05-31T18:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-05-31T15:31:33.314Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":15.52,"fahrenheit":59.94,"timestamp":"2020-05-31T15:45:32.459Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":39.9,"timestamp":"2020-05-31T15:45:32.459Z"}}};
	const TwentyFiveFor1Hour = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"ON","temperature":{"celsius":25,"fahrenheit":77}},"overlayType":"MANUAL","overlay":{"type":"MANUAL","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":25,"fahrenheit":77}},"termination":{"type":"TIMER","typeSkillBasedApp":"TIMER","durationInSeconds":3600,"expiry":"2020-05-31T16:48:58Z","remainingTimeInSeconds":3594,"projectedExpiry":"2020-05-31T16:48:58Z"}},"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-05-31T18:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":100,"timestamp":"2020-05-31T15:48:30.343Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":15.47,"fahrenheit":59.85,"timestamp":"2020-05-31T15:48:34.355Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":39.6,"timestamp":"2020-05-31T15:48:34.355Z"}}};
	const DisabledUntilSchedule = {"tadoMode":"HOME","geolocationOverride":false,"geolocationOverrideDisableTime":null,"preparation":null,"setting":{"type":"HEATING","power":"OFF","temperature":null},"overlayType":null,"overlay":null,"openWindow":null,"nextScheduleChange":{"start":"2020-06-05T22:00:00Z","setting":{"type":"HEATING","power":"ON","temperature":{"celsius":13,"fahrenheit":55.4}}},"nextTimeBlock":{"start":"2020-06-01T21:00:00.000Z"},"link":{"state":"ONLINE"},"activityDataPoints":{"heatingPower":{"type":"PERCENTAGE","percentage":0,"timestamp":"2020-06-01T14:52:53.092Z"}},"sensorDataPoints":{"insideTemperature":{"celsius":16.63,"fahrenheit":61.93,"timestamp":"2020-06-01T15:08:19.133Z","type":"TEMPERATURE","precision":{"celsius":1,"fahrenheit":1}},"humidity":{"type":"PERCENTAGE","percentage":42.3,"timestamp":"2020-06-01T15:08:19.133Z"}}};

	const WindowOpen  = { topic: 'window_opened', payload: true};
	const WindowClose = { topic: 'window_opened', payload: false};

	const HeatingLock   = {topic: 'lock_heating', payload: true};
	const HeatingUnlock = {topic: 'lock_heating', payload: true};

	beforeEach(function(){
		resetContext();
		env.set('zoneId', 1);
		env.set('zoneName', 'living');

		class Logger {
			warn(msg) { console.log(`global logger warn: ${msg}`)};
			info(msg) { console.log(`global logger info: ${msg}`)};
		}

		global.set('system.logger', new Logger());
	  });
	

	context('zero input', function() {
	  it('null msg', function() {
		var r = heating(null);
		expect(r.length).to.equal(0)
	  });

	  it('null topic', function() {
		var r = heating({topic: null});
		expect(r.length).to.equal(0)
	  });

	  it('wrong topic', function() {
		var r = heating({topic: 'bla'});
		expect(r.length).to.equal(0)
	  });
	});

	context('first read', function() {
		
		it('null msg', function() {
		  var r = heating(null);
		  expect(r.length).to.equal(0)
		});
  
		it('null topic', function() {
		  var r = heating({topic: null});
		  expect(r.length).to.equal(0)
		});
  
		it('wrong topic', function() {
		  var r = heating({topic: 'bla'});
		  expect(r.length).to.equal(0)
		});
	  });

	context('read settings', function() {
		it('heating disabled', function() {
			var r = heating({topic: 'tado_update', payload: DisabledForAlways});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(false);
			expect(rep.payload.temp).to.equal(null);
			expect(rep.payload.until).to.equal(null);
			expect(rep.payload.untilType).to.equal('manual');
		});

		it('heating disabled for 1 hour', function() {
			var r = heating({topic: 'tado_update', payload: DisabledFor1Hour});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(false);
			expect(rep.payload.temp).to.equal(null);
			expect(rep.payload.until.getTime()).to.equal(new Date('2020-05-31T13:39:57Z').getTime());
			expect(rep.payload.untilType).to.equal('timer');
		});

		it('locking setting for always (true lock)', function() {
			var r = heating({topic: 'tado_update', payload: FiveForAlways});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(true);
			expect(rep.payload.temp).to.equal(5);
			expect(rep.payload.until).to.equal(null);
			expect(rep.payload.untilType).to.equal('manual');
		});

		it('locking setting for 1 hour (not a lock actually)', function() {
			var r = heating({topic: 'tado_update', payload: FiveFor1Hour});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(true);
			expect(rep.payload.temp).to.equal(5);
			expect(rep.payload.until.getTime()).to.equal(new Date('2020-05-31T13:39:53Z').getTime());
			expect(rep.payload.untilType).to.equal('timer');
		});

		it('25 for always (sauna right now)', function() {
			var r = heating({topic: 'tado_update', payload: TwentyFiveForAlways});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(true);
			expect(rep.payload.temp).to.equal(25);
			expect(rep.payload.until).to.equal(null);
			expect(rep.payload.untilType).to.equal('manual');
		});

		it('25 for 1 hour (sauna temporary)', function() {
			var r = heating({topic: 'tado_update', payload: TwentyFiveFor1Hour});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(true);
			expect(rep.payload.temp).to.equal(25);
			expect(rep.payload.until.getTime()).to.equal(new Date('2020-05-31T16:48:58Z').getTime());
			expect(rep.payload.untilType).to.equal('timer');
		});

		it('disabled until schedule', function() {
			var r = heating({topic: 'tado_update', payload: DisabledUntilSchedule});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[3]).to.eql([]); // no locks suppressed
			
			var rep = r[2];
			expect(rep).to.not.equal(null);
			expect(rep.payload.heatingState).to.equal(false);
			expect(rep.payload.temp).to.equal(null);
			expect(rep.payload.until.getTime()).to.equal(new Date('2020-06-05T22:00:00.000Z').getTime());
			expect(rep.payload.untilType).to.equal('schedule');
		});
		
	});

	context('window', function() {
		it('heating disabled, open and close window', function() {
			heating({topic: 'tado_update', payload: DisabledForAlways});
			
			var r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"OFF", temperature: null, terminationTimeout: null, terminationType:"MANUAL"}); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});

		it('heating temporary disabled, open and close window', function() {
			heating({topic: 'tado_update', payload: DisabledFor1Hour});
			
			var r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			// overlay expired (TODO: mock now())
			r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.eql({zoneId: 1});
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});

		it('heating enabled, open and close window', function() {
			heating({topic: 'tado_update', payload: TwentyFiveForAlways});
			
			var r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:25, terminationType:"MANUAL", terminationTimeout: null})
			expect(r[1]).to.equal(null);
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});

		it('heating temporary enabled, open and close window', function() {
			heating({topic: 'tado_update', payload: TwentyFiveFor1Hour});
			
			var r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.eql({zoneId: 1});
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});
	});

	context('lock', function() {
		it('heating disabled, lock heating', function() {
			heating({topic: 'tado_update', payload: DisabledForAlways});
			
			var r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"OFF", temperature: null, terminationTimeout: null, terminationType:"MANUAL"}); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});

		it('heating enabled, lock heating', function() {
			heating({topic: 'tado_update', payload: TwentyFiveForAlways});
			
			var r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature: 25, terminationTimeout: null, terminationType:"MANUAL"}); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed
		});

		it('heating enabled, lock heating and change settings (override)', function() {
			heating({topic: 'tado_update', payload: TwentyFiveForAlways});
			
			var r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed


			// somebody changed settings manually
			r = heating({topic: 'tado_update', payload: TwentyFiveFor1Hour});

			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set (only report)
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.eql({payload:{ heatingState: true, temp: 25, until: new Date('2020-05-31T16:48:58.000Z'),untilType: 'timer'}}); 
			expect(r[3]).to.eql(["manual_lock"]); // manual lock suppressed
		});

		it('heating enabled, two locks, window is not suppressable', function() {
			heating({topic: 'tado_update', payload: TwentyFiveForAlways});
			
			var r = heating({topic: 'lock_heating', payload: false});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'lock_heating', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.eql({zoneId:1, power:"ON", temperature:5, terminationType:"MANUAL"}); // lock heating due to opened window
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			r = heating({topic: 'window_opened', payload: true});
			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null);
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.equal(null); // no report
			expect(r[3]).to.eql([]); // no locks suppressed

			// somebody changed settings manually
			r = heating({topic: 'tado_update', payload: TwentyFiveFor1Hour});

			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null); // nothing to set (only report)
			expect(r[1]).to.equal(null); // nothing to clean
			expect(r[2]).to.eql({payload: {heatingState: true, temp:25, until: new Date("2020-05-31T16:48:58.000Z"), untilType: "timer"}});
			expect(r[3]).to.eql(["manual_lock"]); // manual lock suppressed, but heating is still disabled

			// now close window, all locks are gone, temperature restored
			r = heating({topic: 'window_opened', payload: false});

			expect(r.length).to.equal(4);
			expect(r[0]).to.equal(null);      // nothing to set (only report)
			expect(r[1]).to.eql({zoneId: 1}); // timer expired (TODO: mock Date.now()), all cleared
			expect(r[2]).to.equal(null);      // no report on this event
			expect(r[3]).to.eql([]);
		});
	});
})
  

describe('window_processor test', function() {
	beforeEach(function(){
		resetContext();
	});

	context('one-window room', function() {
		const BedroomOpened = {topic: 'bedroom.window.opened', payload: true };
		const BedroomClosed = {topic: 'bedroom.window.opened', payload: false};
		const AnyWindow = 'bedroom.any_window.opened';
		
		it('test', function() {
			var ret = window(BedroomOpened);                         // open window
			expect(ret).to.eql({topic: AnyWindow, payload: true});   // any opened
			ret = window(BedroomOpened);                             // open again (should'n happen)
			expect(ret).to.eql({topic: AnyWindow, payload: true});   // is ok, still opened
			ret = window(BedroomClosed);                             // close 
			expect(ret).to.eql({topic: AnyWindow, payload: false});  // all closed
			ret = window(BedroomClosed);                             // close again (sensor, are you kidding me?)
			expect(ret).to.eql({topic: AnyWindow, payload: false});  // still closed
		});
	});

	context('two-window room', function() {
		const LivingDoorOpened = {topic: 'living.balcony_door.opened', payload: true  };
		const LivingDoorClosed = {topic: 'living.balcony_door.opened', payload: false };
		const LivingWndwOpened = {topic: 'living.window.opened',       payload: true  };
		const LivingWndwClosed = {topic: 'living.window.opened',       payload: false };

		const AnyWindow = 'living.any_window.opened';
		
		it('one window', function() {
			var ret = window(LivingDoorOpened);                         // open the door
			expect(ret).to.eql({topic: AnyWindow, payload: true});   	// any opened
			ret = window(LivingWndwClosed);                             // but the window is closed
			expect(ret).to.eql({topic: AnyWindow, payload: true});      // is ok, room is opened
			ret = window(LivingDoorClosed);                             // close the door 
			expect(ret).to.eql({topic: AnyWindow, payload: false});  	// the room is closed now
		});

		it('one wiindow 2 (another one', function() {
			var ret = window(LivingWndwOpened);                         // open the window
			expect(ret).to.eql({topic: AnyWindow, payload: true});   	// any opened
			ret = window(LivingDoorClosed);                             // but the door is closed
			expect(ret).to.eql({topic: AnyWindow, payload: true});      // is ok, room is opened
			ret = window(LivingWndwClosed);                             // close the window 
			expect(ret).to.eql({topic: AnyWindow, payload: false});  	// the room is closed now
		});

		it('open both', function() {
			var ret = window(LivingWndwOpened);                         // open the window
			expect(ret).to.eql({topic: AnyWindow, payload: true});   	// any opened
			ret = window(LivingDoorOpened);                             // now open the door as well
			expect(ret).to.eql({topic: AnyWindow, payload: true});      // is ok, room is opened
			ret = window(LivingDoorClosed);                             // close the door 
			expect(ret).to.eql({topic: AnyWindow, payload: true});  	// but the room is still opened (close all windows!)
			ret = window(LivingWndwClosed);                             // close the window 
			expect(ret).to.eql({topic: AnyWindow, payload: false});  	// now we are closed!
		});



	});
});
