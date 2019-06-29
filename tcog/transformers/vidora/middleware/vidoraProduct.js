const config = require('../../../conf');

module.exports = (req, res, next) => {
    const vidoraProductName = req.query['t_vidora_product'];

    if (!vidoraProductName) {
        return next();
    }

    const vidoraProduct = config.products[vidoraProductName];

    if (!vidoraProduct) {
        return next();
    }

    res.locals.vidoraProduct = {
        capiV2Key: vidoraProduct.capiV2APIKey,
        capiV3Key: vidoraProduct.capiV3APIKey,
        vidoraKey: vidoraProduct.vidoraApiKey
    };

    next();
};
