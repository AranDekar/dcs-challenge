var modulePath = '../../../../lib/template-loader/process-view-name_implementation',
    expect = require('chai').expect,
    implementation = require(modulePath);

describe('processViewName', function() {
    var adapters = ['core', 'external'],
        dependencies;

    it('returns normalised view path and adapter', function(done) {
        var validation = implementation();

        validation('core/view', adapters, function(err, adapter, view) {
            expect(adapter).to.equal('core');
            expect(view).to.equal(
                'view');
            done();
        });
    });

    it('applies defaults if no valid adapter view adapter found', function(done) {
        var validation = implementation();

        validation('foobar/view', adapters, function(err, adapter, view) {
            expect(adapter).to.equal('core');
            expect(view).to.equal('foobar/view');
            done();
        });
    });

    it('diregards multiple slashes within a path', function(done) {
        var validation = implementation();

        validation('foobar//////view', adapters, function(err, adapter, view) {
            expect(adapter).to.equal('core');
            expect(view).to.equal('foobar/view');
            done();
        });
    });
});
