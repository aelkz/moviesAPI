let debug = require('debug')('app');

module.exports = async (err, req, res, next) => {
    // console.error(err.stack)
    if (!err) return next();

    const errorStatus = Number.isInteger(err.status) ? err.status : 500;
    res.status = errorStatus;
    debug('Error: ' + (err.status || 500).toString().red.bold + ' ' + err);

    return res.json({
        error: {
            message: err.message,
        },
    });
};
