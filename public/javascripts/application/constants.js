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

// PARTICLE CONSTANTS
var COLOR_DOMINANCE_THRESHOLD = 150;

var PARTICLE_COUNT_MAPPINGS = {
  '0': 2,
  '1': 8,
  '2': 15,
  '3': 30,
  '4': 60
};

var PARTICLE_SIZE_MAPPINGS = {
  '0': 1,
  '1': 5,
  '2': 10,
  '3': 15,
  '4': 30
};

var PARTICLE_SPEED_MAPPINGS = {
  '0': [0.1, 1],
  '1': [0.5, 2],
  '2': [1, 5],
  '3': [3, 12],
  '4': [3, 25]
};

var AIR_RESISTANCE_MAPPINGS = {
  '0': 0.001,
  '1': 0.5,
  '2': 1,
  '3': 4,
  '4': 10
};

var WIND_MAPPINGS = {
  '0': 1,
  '1': 20,
  '2': 50,
  '3': 150,
  '4': 600
};