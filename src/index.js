import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import nodeEnvConfiguration from 'node-env-configuration';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import setupConfig from './lib/setupConfig';
import configDefaults from '../config/defaults.json';

require('babel-core/register');
require('babel-polyfill');

const cluster = require('cluster');

const config = nodeEnvConfiguration({
    defaults: configDefaults,
    prefix: 'api',
});

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.corsHeaders,
}));

app.use(bodyParser.json({
    limit: config.bodyLimit,
}));

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
    const db = await initializeDb({ config });
    await setupConfig();
    app.use(middleware({ config, db }));
    app.use('/', api({ config, db }));
    app.use(jsonErrorHandler);
    return app;
};

const bindClusteredApp = async (appToBind) => {
    if (cluster.isMaster) {
        // Count the machine's CPUs
        const numWorkers = require('os').cpus().length;

        console.log('master cluster setting up ' + numWorkers + ' workers...');

        for (var i = 0; i < numWorkers; i++) {
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