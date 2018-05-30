import mongoose from 'mongoose';                    // https://npmjs.org/package/mongoose

let debug  = require('debug')('app');
let colors = require('colors');

export default ({ config }) => new Promise((resolve) => {

    if(process.env.OPENSHIFT_MONGODB_PASSWORD){
        console.log(`trying to acquire mongodb connection with openshift parameters`);

        let mongoServiceName = process.env.OPENSHIFT_DATABASE_SERVICE_NAME.toUpperCase();

        config.mongo.uri = process.env.OPENSHIFT_DATABASE_SERVICE_NAME + '://' +
            process.env.OPENSHIFT_MONGODB_USER + ":" +
            process.env.OPENSHIFT_MONGODB_PASSWORD + "@" +
            process.env[mongoServiceName + '_SERVICE_HOST'] + ':' +
            process.env[mongoServiceName + '_SERVICE_PORT'] + '/' +
            process.env.OPENSHIFT_MONGODB_DATABASE;

        console.log(`config.mongo.uri=${config.mongo.uri}`);
    }

    console.log(`trying to acquire mongodb connection at ${config.mongo.uri}`);

    // connect to a database if needed, then pass it to `callback`:
    mongoose.set('debug', config.mongo.debug);
    mongoose.connect(config.mongo.uri);
    mongoose.connection.once('open', () => {
        resolve(mongoose.connection);

        debug('mongodb ' + 'connected!'.green.bold);
        console.log(`connected with mongodb instance at ${config.mongo.uri}`);

        debug('ctrl+c'.green.bold + ' to shut down.');

        // exit cleanly on Ctrl+C
        process.on('SIGINT', function () {
            console.log('\n');
            debug('has ' + 'shutdown'.green.bold);
            debug('was running for ' + Math.round(process.uptime()).toString().green.bold + ' seconds.');
            process.exit(0);
        });
    }).once('error', () => {
        //debug('mongodb connection error. please make sure mongodb is running.'.red.bold);
        process.exit(0);
    });
});

// http://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.message);
});