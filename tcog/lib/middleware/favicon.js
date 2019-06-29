module.exports = (req, res, next) => {
    // Don't spew errors about favicon into the logs
    // Exit early

    if (req.url === '/favicon.ico') {
        return res.end();
    }

    next();
};
