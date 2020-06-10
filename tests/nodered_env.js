class Storage {
	constructor(name) {
		this.name = name;
		this.storage = {};
	}

	set(key, data) {
		console.log(`${this.name}.${key} is set to ${data}`);
		this.storage[key] = data;
	}

	get(key) {
		var rv = this.storage[key];
		console.log(`${this.name}.${key} is gotten as ${rv}`);
		return rv;
	}
}

class Logger {
	constructor(name) {
		this.name = name;
	}

	log(msg) {
		console.log(`log ${this.name}: ${msg}`);
	}

	warn(msg) {
		console.log(`warn ${this.name}: ${msg}`);
	}
}

var env;
var global;
var flow;

var resetContext = function() {
	console.log('context resetted!');
	env = new Storage('env');
	global = new Storage('global');
	flow = new Storage('flow');
	node = new Logger('node');
};

resetContext();

module.exports = {
	env: env,
	global: global,
	flow: flow,

	resetContext: resetContext,

	node: new Logger('node'),
};
