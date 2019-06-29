const expect = require('chai').expect,
    leche = require('leche'),
    sinon = require('sinon');

describe('requireAll', function() {
    it('reads files from ./lib/middleware', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([]) },
            require('string'),
            function() {}
        );

        requireAll(process.cwd() + '/lib/middleware');
        expect(requireAll.fs.readdirSync.getCall(0).args[0]).to.equal(process.cwd() + '/lib/middleware');
    });

    it('"requires" javascript files returned from readdirSync', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([
                'a-test-module.js',
                'another-module.js'
            ]) },
            require('string'),
            sinon.spy()
        );
        requireAll(process.cwd() + '/lib/middleware');
        expect(requireAll.require.getCall(0).args[0]).to.equal(process.cwd() + '/lib/middleware/a-test-module.js');
        expect(requireAll.require.getCall(1).args[0]).to.equal(process.cwd() + '/lib/middleware/another-module.js');
    });

    it('ignores non-javascript files returned from readdirSync', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([
                'a-test-module.js',
                'logfile.log',
                'another-module.js',
                'index.html',
                'data.json'
            ]) },
            require('string'),
            sinon.spy()
        );
        requireAll(process.cwd() + '/lib/middleware');
        expect(requireAll.require.getCall(0).args[0]).to.equal(process.cwd() + '/lib/middleware/a-test-module.js');
        expect(requireAll.require.getCall(1).args[0]).to.equal(process.cwd() + '/lib/middleware/another-module.js');
        expect(requireAll.require.calledTwice).to.equal(true);
    });

    it('ignores index.js files returned from readdirSync', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([
                'a-test-module.js',
                'index.js',
                'another-module.js'
            ]) },
            require('string'),
            sinon.spy()
        );
        requireAll(process.cwd() + '/lib/middleware');
        expect(requireAll.require.getCall(0).args[0]).to.equal(process.cwd() + '/lib/middleware/a-test-module.js');
        expect(requireAll.require.getCall(1).args[0]).to.equal(process.cwd() + '/lib/middleware/another-module.js');
        expect(requireAll.require.calledTwice).to.equal(true);
    });

    it('uses the camelized filenames as the returned object properties', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([
                'a-test-module.js',
                'another-module.js'
            ]) },
            require('string'),
            sinon.stub().returns('blah')
        );
        var middlewares = requireAll(process.cwd() + '/lib/middleware');
        expect(Object.keys(middlewares).length).to.equal(2);
        expect(middlewares.aTestModule).to.equal('blah');
        expect(middlewares.anotherModule).to.equal('blah');
    });

    it('does not export files that are ignored', function() {
        var requireAll = require('./../../../lib/require-all_implementation')(
            { readdirSync: sinon.stub().returns([
                'a-test-module.js',
                'another-module.js'
            ]) },
            require('string'),
            sinon.stub().returns('blah')
        );
        var middlewares = requireAll(process.cwd() + '/lib/middleware', { ignore: [ 'another-module.js' ] });
        expect(Object.keys(middlewares).length).to.equal(1);
        expect(middlewares.aTestModule).to.equal('blah');
    });
});
