module.exports = async (err, req, res, next) => {
    // console.error(err.stack)
    if (!err) return next();

    const errorStatus = Number.isInteger(err.status) ? err.status : 500;
    res.status = errorStatus;

    return res.json({
        error: {
            message: err.message,
        },
    });
};
