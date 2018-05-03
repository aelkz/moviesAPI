import http from 'http';
import express from 'express';                              // https://npmjs.org/package/express
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';                       // https://github.com/expressjs/body-parser
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import setupConfig from './lib/setupConfig';
//
import compression from 'compression';
import config from './../config/config';
import csrf from 'csurf';
import expressValidator from 'express-validator';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import methodOverride from 'method-override';
import enforce from 'express-sslify';

require('babel-core/register');
require('babel-polyfill');

//var compression       = require('compression')              // https://github.com/expressjs/compression
//var config            = require('./../config/config');      // Get configuration file
//var csrf              = require('csurf');                   // https://github.com/expressjs/csurf
//var expressValidator  = require('express-validator');       // https://npmjs.org/package/express-validator
//var errorHandler      = require('errorhandler');            // https://github.com/expressjs/errorhandler
//var helmet            = require('helmet');                  // https://github.com/evilpacket/helmet
//var methodOverride    = require('method-override');         // https://github.com/expressjs/method-override
let debug               = require('debug')('skeleton');       // https://github.com/visionmedia/debug

let minute = 1000 * 60;   //     60000
let hour = (minute * 60); //   3600000
let day  = (hour * 24);   //  86400000
let week = (day * 7);     // 604800000

const cluster = require('cluster');

const app = module.exports = express();  // export app for testing ;)
app.server = http.createServer(app);

app.locals.application  = config.name;
app.locals.version      = config.version;
app.locals.description  = config.description;
app.locals.author       = config.author;
app.locals.keywords     = config.keywords;
app.locals.ga           = config.ga;

// 3rd party middleware
// https://github.com/expressjs/cors
app.use(cors({
    exposedHeaders: config.corsHeaders,
}));

// Body parsing middleware supporting
// JSON, urlencoded, and multipart requests.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({
    limit: config.bodyLimit,
}));

// Easy form validation!
// This line must be immediately after bodyParser!
app.use(expressValidator());

// Compress response data with gzip / deflate.
// This middleware should be placed "high" within
// the stack to ensure all responses are compressed.
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}

app.use(compression({filter: shouldCompress}));

// http://en.wikipedia.org/wiki/HTTP_ETag
// Google has a nice article about "strong" and "weak" caching.
// It's worth a quick read if you don't know what that means.
// https://developers.google.com/speed/docs/best-practices/caching
app.set('etag', true);  // other values 'weak', 'strong'

// If you want to simulate DELETE and PUT
// in your app you need methodOverride.
app.use(methodOverride());

/**
 * security Settings:
 *
 * Cross Domain protection for Flash content
 * Removing the X-Powered-by header
 * HSTS support
 * X-Download-Options for IE8+
 * Proper Cache-control headers
 * Clickjacking Protection
 * XSS Protection via the X-XSS-Protection header
 * src: https://github.com/helmetjs/helmet
 */
app.disable('x-powered-by');          // Don't advertise our server type
app.use(csrf());                      // Prevent Cross-Site Request Forgery
app.use(helmet());
app.use(helmet.ieNoOpen());           // X-Download-Options for IE8+
app.use(helmet.noSniff());            // Sets X-Content-Type-Options to nosniff
app.use(helmet.xssFilter());          // sets the X-XSS-Protection header
app.use(helmet.frameguard('deny'));   // Prevent iframe clickjacking

let isProduction = app.get('env') === 'production';

if (isProduction) {
    app.locals.pretty = false;
    app.locals.compileDebug = false;
    // Enable If behind nginx, proxy, or a load balancer (e.g. Heroku, Nodejitsu)
    //app.enable('trust proxy', 1);  // trust first proxy

    // Since our application has signup, login, etc. forms these should be protected
    // with SSL encryption. Heroku, Nodejitsu and other hosters often use reverse
    // proxies or load balancers which offer SSL endpoints (but then forward unencrypted
    // HTTP traffic to the server).  This makes it simpler for us since we don't have to
    // setup HTTPS in express. When in production we can redirect all traffic to SSL
    // by using a little middleware.
    //
    // In case of a non-encrypted HTTP request, enforce.HTTPS() automatically
    // redirects to an HTTPS address using a 301 permanent redirect. BE VERY
    // CAREFUL with this! 301 redirects are cached by browsers and should be
    // considered permanent.
    //
    // NOTE: Use `enforce.HTTPS(true)` if you are behind a proxy or load
    // balancer that terminates SSL for you (e.g. Heroku, Nodejitsu).
    app.use(enforce.HTTPS(true));
    // This tells browsers, "hey, only use HTTPS for the next period of time".
    // This will set the Strict Transport Security header, telling browsers to
    // visit by HTTPS for the next ninety days:
    // TODO: should we actually have this *and* app.use(enforce.HTTPS(true)); above?
    //       this seems more flexible rather than a hard redirect.
    let ninetyDaysInMilliseconds = 7776000000;
    app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds }));
    // Turn on HTTPS/SSL cookies
    config.session.proxy = true;
    config.session.cookie.secure = true;
}

if (isProduction) {
    // production error handler no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        debug('Error: ' + (err.status || 500).toString().red.bold + ' ' + err);
        res.json({'errors': {
            message: err.message,
            error: {}  // don't leak information
        }});
    });
}

if (!isProduction) {
    // logger
    app.use(morgan('dev'));
    app.use(errorHandler);
    // Jade options: Don't minify html, debug intrumentation
    app.locals.pretty = true;
    app.locals.compileDebug = true;
    // Turn on console logging in development
    app.use(morgan('dev'));
    // Turn off caching in development
    // This sets the Cache-Control HTTP header to no-store, no-cache,
    // which tells browsers not to cache anything.
    app.use(helmet.noCache());
}

// development error handler will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        debug('Error: ' + (err.status || 500).toString().red.bold + ' ' + err);

        res.status(err.status || 500);

        res.json({'errors': {
            message: err.message,
            error: err
        }});
    });

    // Final error catch-all just in case...
    app.use(errorHandler);
}

// keep user, csrf token and config available
app.use(function (req, res, next) {
    res.locals.user = req.user; // will exists if using some IDP
    res.locals.config = config;
    res.locals._csrf = req.csrfToken();
    next();
});

// https://github.com/expressjs/session
// app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

const jsonErrorHandler = (err, req, res, next) => {
    // console.error(err.stack)
    if (!err) return next();
    return res.json({
        error: {
            message: err.message,
        },
    });
};

const initApp = async () => {
    console.log('debug 1');
    const db = await initializeDb({ config });
    console.log('debug 2');
    await setupConfig();
    console.log('debug 3');
    app.use(middleware({ config, db }));
    console.log('debug 4');
    app.use('/', api({ config, db }));
    console.log('debug 5');
    app.use(jsonErrorHandler);
    return app;
};

// Dynamically include routes (via controllers)
//fs.readdirSync('./controllers').forEach(function (file) {
//    if (file.substr(-3) === '.js') {
//        var route = require('./controllers/' + file);
//        route.controller(app);
//    }
//});

const bindClusteredApp = async (appToBind) => {
    if (cluster.isMaster) {
        // Count the machine's CPUs
        const numWorkers = require('os').cpus().length;

        console.log('master cluster setting up ' + numWorkers + ' workers...');

        for (let i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('online', function(worker) {
            console.log('worker PID ' + worker.process.pid + ' is online');
        });

        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('starting a new worker');
            cluster.fork();
        });

    } else {
        appToBind.server.listen(config.bind.port, config.bind.host, () => {
            console.log(`started on port ${appToBind.server.address().port}`);
        });
    }

    if (cluster.isWorker) {
        console.log(`   worker ${cluster.worker.id} with PID ${cluster.worker.process.pid} started`);
        setInterval(function(){
            console.log(`   processing job from worker ${cluster.worker.id}`);
        }, 3000);
    }
};

export {
    app,
    initApp,
    bindClusteredApp,
    jsonErrorHandler,
};