import mongoose from 'mongoose';                    // https://npmjs.org/package/mongoose

let debug  = require('debug')('app');          // https://github.com/visionmedia/debug
let colors = require('colors');

export default ({ config }) => new Promise((resolve) => {
    console.log(`trying to acquire mongodb connection at ${config.mongo.uri}`);

    // connect to a database if needed, then pass it to `callback`:
    mongoose.set('debug', config.mongo.debug);
    mongoose.connect(config.mongo.uri);
    mongoose.connection.once('open', () => {
        resolve(mongoose.connection);

        debug('mongodb ' + 'connected!'.green.bold);
        console.log(`connected with mongodb instance at ${config.mongo.uri}`);

        // Log how we are running
        //debug('listening on port ' + app.get('port').toString().green.bold);
        //debug('listening in ' + app.settings.env.green.bold + ' mode.');
        debug('ctrl+c'.green.bold + ' to shut down.');

        // Exit cleanly on Ctrl+C
        process.on('SIGINT', function () {
            console.log('\n');
            debug('has ' + 'shutdown'.green.bold);
            debug('was running for ' + Math.round(process.uptime()).toString().green.bold + ' seconds.');
            process.exit(0);
        });
    }).once('error', () => {
        debug('mongodb connection error. please make sure mongodb is running.'.red.bold);
        process.exit(0);
    });
});

// http://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.message);
});