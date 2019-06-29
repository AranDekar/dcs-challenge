module.exports = function(middlewares) {
    var self = {};

    self.middleware = [
        middlewares.templateHandler('../video/router')
    ];

    self.routes = {
        '/component/video': self.middleware
    };

    return self;
};
