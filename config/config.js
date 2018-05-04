'use strict';

var pkg    = require('../package.json');
var dotenv = require('dotenv'); // https://www.npmjs.com/package/dotenv

// *For Development Purposes*
// Read in environment vars from .env file
// In production I recommend setting the
// environment vars directly
dotenv.load();

/**
 * [application configuration file]
 * Why like this?
 *  - All environmental variables documented in one place
 *  - If I use "." notation it's easy to cut/paste into code
 *  - Unlike JSON, javascript allows comments (which I like)
 *  - Reading package.json here centralizes all config info
 */

var hour                        = 3600000;
var day                         = (hour * 24);
var week                        = (day * 7);

var config                      = {};

config.prefix                   = 'api';

// From package.json
config.name                     = pkg.name;
config.version                  = pkg.version;
config.description              = pkg.description;
config.company                  = pkg.company;
config.author                   = pkg.author;
config.keywords                 = pkg.keywords;
config.engine                   = pkg.engines.node;

config.ga                       = process.env.GA || 'google analytics key';

config.logging                  = process.env.LOGGING || false;

config.mongodb                  = {};
config.mongodb.url              = process.env.MONGODB_URL || 'localhost';

config.loginAttempts            = {};
config.loginAttempts.forIp      = 50;
config.loginAttempts.forUser    = 5;
config.loginAttempts.expires    = '20m';

config.corsHeaders              = [];

config.bodyLimit                = 100000; // 100Kb

config.session                  = {};
config.session.secret           = process.env.SESSION_SECRET || 'my big secret';
config.session.name             = 'sid';  // Generic - don't leak information
config.session.proxy            = false;  // Trust the reverse proxy for HTTPS/SSL
config.session.resave           = false;  // Forces session to be saved even when unmodified
config.session.saveUninitialized = false; // forces a session that is "uninitialized" to be saved to the store
config.session.cookie           = {};
config.session.cookie.httpOnly  = true;   // Reduce XSS attack vector
config.session.cookie.secure    = false;  // Cookies via HTTPS/SSL
config.session.cookie.maxAge    = process.env.SESSION_MAX_AGE || week;

config.cluster                  = {};
config.cluster.isMaster         = false;

config.bind                     = {};
config.bind.port                = 3005;

config.mongo                    = {};
config.mongo.uri                = 'mongodb://mongodb.io/moviesAPI';
config.mongo.debug              = true;

config.admin                    = {};
config.admin.username           = 'admin';
config.admin.email              = 'raphael.alex@gmail.com';
config.admin.password           = 'admin12345';

module.exports = config;