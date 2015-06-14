var path = require('path');

module.exports = {
	development: {
		db: 'mongodb://localhost/kryptonite'
	},
	production: {
		db: 'mongodb://heroku_nw9xd3vv:laldboi884bgja098m6sa1npom@ds045882.mongolab.com:45882/heroku_nw9xd3vv'
	}
}