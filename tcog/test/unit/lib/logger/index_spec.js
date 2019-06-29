const npath = require('path'),
    noop = function() {},
    fileUnderTest = '../../../../lib/logger/index_implementation',
    implementation = require(fileUnderTest),
    expect = require('chai').expect;

const getImplementation = function(deps) {
    deps = deps || {};

        // defaults

    deps.bunyan = deps.bunyan || {
        createLogger: function(obj) {
            return obj;
        }
    };

    deps.fs = deps.fs || { existsSync: noop, mkdirSync: noop };
    deps.path = deps.path || { join: noop, resolve: noop };
    deps.config = deps.config || {};
    deps.basePath = deps.basePath || 'Some/base/Path/logger';

    return implementation(deps.basePath, deps.bunyan, deps.config, deps.fs,
            deps.path, deps.pid);
};

describe('Logging', function() {
    it('Constructs appropriate LOG_DIR at root of project dir', function() {
        var logger = getImplementation({
            fs: {
                existsSync: function(LOG_DIR) {
                    expect(LOG_DIR).to.equal('Some/base/logs');
                },
                mkdirSync: function() {
                    return true;
                }
            },
            path: {
                join: function(a, b) {
                    expect(a).to.equal('Some/base/Path/logger');
                    expect(b).to.equal('../../logs');
                    return 'Some/base/Path/logger/../../logs';
                },
                resolve: function() {
                    return 'Some/base/logs';
                }
            }
        });
    });
});
