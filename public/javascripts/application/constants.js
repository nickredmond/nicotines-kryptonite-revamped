var SECONDS_PER_DEATH = 5.35;
var MILLIS_PER_SECOND = 1000;
var DEATH_UPDATE_INTERVAL = 10000;
var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var USER_LINK_TEMPLATE = '##URL here:::link text here##';

var DAY_OF_WEEK_MAPPINGS = {
	'0': 'Sunday',
	'1': 'Monday',
	'2': 'Tuesday',
	'3': 'Wednesday',
	'4': 'Thursday',
	'5': 'Friday',
	'6': 'Saturday'
};
var DAYS_PER_WEEK = 7;
var DAYS_PER_TWO_WEEKS = 14;

var COLOR_DOMINANCE_THRESHOLD = 150;