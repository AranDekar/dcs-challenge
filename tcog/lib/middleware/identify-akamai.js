module.exports = (req, res, next) => {
    // For security reasons, as well as to know what domain we're serving,
    // we need to know whether we're behind Akamai. We look at either the
    // `surrogate-capability` header — OR — (as the `surrogate-capability`
    // header doesn't appear in prod) we use akamai-origin-hop instead.

    if (req.headers['surrogate-capability'] ||
        req.headers['akamai-origin-hop']) {
        req.isAkamai = res.isAkamai = true;
    }

    next();
};
