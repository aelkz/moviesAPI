import mongoose from 'mongoose';                    // https://npmjs.org/package/mongoose

export default ({ config }) => new Promise((resolve) => {
    console.log(`trying to acquire mongodb connection at ${config.mongo.uri}`);
    // connect to a database if needed, then pass it to `callback`:
    mongoose.connect(config.mongo.uri, { useMongoClient: true });
    mongoose.set('debug', config.mongo.debug);
    mongoose.connection.once('open', () => {
        resolve(mongoose.connection);
    });
}).on('open', function () {
    debug('Mongodb ' + 'connected!'.green.bold);
    console.log(`connected with mongodb instance at ${config.mongo.uri}`);

    // Log how we are running
    //debug('listening on port ' + app.get('port').toString().green.bold);
    //debug('listening in ' + app.settings.env.green.bold + ' mode.');
    debug('Ctrl+C'.green.bold + ' to shut down. ;)');

    // Exit cleanly on Ctrl+C
    process.on('SIGINT', function () {
        console.log('\n');
        debug('has ' + 'shutdown'.green.bold);
        debug('was running for ' + Math.round(process.uptime()).toString().green.bold + ' seconds.');
        process.exit(0);
    });

}).on('error', function () {
    debug('MongoDB Connection Error. Please make sure MongoDB is running.'.red.bold);
    process.exit(0);
});