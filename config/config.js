'use strict';

// Module Dependencies
var pkg    = require('../package.json');
var dotenv = require('dotenv'); // https://www.npmjs.com/package/dotenv

// *For Development Purposes*
// Read in environment vars from .env file
// In production I recommend setting the
// environment vars directly
dotenv.load();

/**
 * Configuration File
 *
 * Why like this?
 *
 *  - All environmental variables documented in one place
 *  - If I use "." notation it's easy to cut/paste into code
 *  - Unlike JSON, javascript allows comments (which I like)
 *  - Reading package.json here centralizes all config info
 *
 */

var config            = {};

config.prefix         = 'api';

// From package.json
config.name           = pkg.name;
config.version        = pkg.version;
config.description    = pkg.description;
config.company        = pkg.company;
config.author         = pkg.author;
config.keywords       = pkg.keywords;
config.engine         = pkg.engines.node || pkg.engines.iojs;

config.logging        = process.env.LOGGING || false;

config.mongodb        = {};
config.mongodb.url    = process.env.MONGODB_URL || 'localhost';

var hour              = 3600000;
var day               = (hour * 24);
var week              = (day * 7);

config.loginAttempts           = {};
config.loginAttempts.forIp     = 50;
config.loginAttempts.forUser   = 5;
config.loginAttempts.expires   = '20m';

module.exports = config;