import http from 'http';
import express from 'express';                                  // https://expressjs.com/
import bodyParser from 'body-parser';                           // https://github.com/expressjs/body-parser
import expressValidator from 'express-validator';               // https://github.com/express-validator/express-validator
import methodOverride from 'method-override';                   // https://github.com/expressjs/method-override
import compression from 'compression';                          // https://github.com/expressjs/compression
import helmet from 'helmet';                                    // https://github.com/helmetjs/helmet
import enforce from 'express-sslify';                           // https://github.com/florianheinemann/express-sslify
import cors from 'cors';                                        // https://github.com/expressjs/cors
import morgan from 'morgan';                                    // https://github.com/expressjs/morgan
import api from './api';
import config from '../config/config';
import initializeDb from './db';
import middleware from './api/middleware/index';
import setupConfig from './lib/setupConfig';

const cluster           = require('cluster');                   // https://github.com/LearnBoost/cluster
// should evaluate node-inspector.                              // https://github.com/node-inspector/node-inspector
let debug               = require('debug')('app');              // https://github.com/visionmedia/debug
let babelCore           = require('babel-core/register');       // https://babeljs.io/docs/usage/babel-register/
let babelPolyfill       = require('babel-polyfill');            // https://babeljs.io/docs/usage/polyfill/
let colors              = require('colors');                    // https://github.com/Marak/colors.js
let validate                  = require('express-validation');

let minute = 1000 * 60;   //     60000
let hour = (minute * 60); //   3600000
let day  = (hour * 24);   //  86400000
let week = (day * 7);     // 604800000

const app = express();

app.server = http.createServer(app);

app.locals.application  = config.name;
app.locals.version      = config.version;
app.locals.description  = config.description;
app.locals.author       = config.author;
app.locals.keywords     = config.keywords;
app.locals.ga           = config.ga;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    limit: config.bodyLimit,
}));

// This line must be immediately after bodyParser!
app.use(expressValidator());

// If you want to simulate DELETE and PUT in your app you need methodOverride.
app.use(methodOverride());

// compress response data with gzip / deflate.
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
app.use(helmet());
app.use(helmet.ieNoOpen());           // X-Download-Options for IE8+
app.use(helmet.noSniff());            // Sets X-Content-Type-Options to nosniff
app.use(helmet.xssFilter());          // sets the X-XSS-Protection header
app.use(helmet.frameguard('deny'));   // Prevent iframe clickjacking

let isProduction = config.environment === 'production';

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
    app.use(function(err, req, res) {

        //debug('Error: ' + (err.status || 500).toString().red.bold + ' ' + err);

        res.json({'errors': {
            message: err.message,
            error: {}  // don't leak information
        }});
    });
}

if (!isProduction) {
    if (!cluster.isMaster) {
        debug('development mode enabled'.bgRed.bold);
    }

    // logger
    app.use(morgan('dev'));
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

// error handler
app.use(function (err, req, res, next) {
    // specific for validation errors
    console.log('a-1 '+err.message);
    console.log('a-2 '+err.statusCode);

    if (err instanceof validate.ValidationError) {
        console.log('a-4 ');

        return res.status(err.status).json(err);
    }

    console.log('a-5 ');

    // other type of errors, it *might* also be a Runtime Error
    // example handling
    if (config.environment !== 'production') {
        console.log('a-6 ');

        return res.status(500).send(err.stack);
    } else {
        console.log('a-7 ');

        return res.status(500);
    }

});

const initApp = async (config) => {
    if (!cluster.isMaster) {
        const db = await initializeDb({ config });
        await setupConfig();
        app.use(middleware({ config, db }));
        app.use('/', api({ config, db }));
    }

    return app;
};

const bindClusteredApp = async (appToBind) => {
    if (cluster.isMaster) {
        config.cluster.isMaster = true;

        // Count the machine's CPUs
        const numWorkers = require('os').cpus().length;

        debug('master cluster setting up ' + numWorkers + ' ' + 'workers'.bgYellow);

        for (let i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('online', function(worker) {
            debug('worker PID ' + worker.process.pid + ' ' + 'is online'.green.bold);
        });

        cluster.on('exit', function(worker, code, signal) {
            debug('worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            debug('starting a new worker...');
            cluster.fork();
        });

    } else {
        var server_port = process.env.OPENSHIFT_NODEJS_PORT || config.bind.port;
        var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || config.bind.host;

        console.log('listening server at:'+server_ip_address+':'+server_port);
        // appToBind.server.listen(config.bind.port, config.bind.host, () => {
        appToBind.server.listen(server_port, server_ip_address, () => {
            debug(`started on ` + `${config.bind.host}` + ':' + `${appToBind.server.address().port}`);
        });
    }

    if (cluster.isWorker) {
        debug('   ' + `worker ${cluster.worker.id} with PID ${cluster.worker.process.pid} started`.white.bold);
        /*
        setInterval(function(){
            debug(`   processing job from worker ${cluster.worker.id}`);
        }, 3000);
        */
    }
};

module.exports = {
    app,
    initApp,
    bindClusteredApp
};
