var modulePath =
        '../../../../../lib/template-loader/adapters/core_implementation',
    expect = require('chai').expect,
    implementation = require(modulePath);

describe('template adapter', function() {
    describe('core', function() {
        it('calls back with an error if cannot find file', function(done) {
            var adapter = implementation(null, {});

            adapter('/idonotexist/index', function(err, data) {
                expect(err).to.be.ok;
                expect(data).to.not.be.ok;
                done();
            });
        });

        describe('#compileJade', function() {
            it('calls jade.compileClient', function(done) {
                var called = false,
                    path = 'path/to/template/index',
                    cwd = '',
                    jade = {
                        compileClient: function(template, options) {
                            called = true;
                            expect(template).to.equal('p=foo');
                            expect(path + '.jade').to.equal(options.filename);
                            return compiled;
                        }
                    },

                    compiled = 'function template () {};',
                    adapter = implementation(null, {}, jade, cwd),
                    compileJade = adapter.compileJade;

                adapter.resolveLegacyPath = function(path) {
                    return path + '.jade';
                };

                compileJade(path, 'p=foo', function(err, data) {
                    if (err) throw err;
                    var output = compiled + '\noutput = template(data);';
                    expect(called).to.equal(true);
                    expect(data).to.equal(output);
                    done();
                });
            });

            it('callback with an error if jade.compileClient fails', function(done) {
                var called = false,
                    path = 'path/to/template/index',
                    cwd = '',
                    jade = {
                        compileClient: function(template, options) {
                            called = true;
                            throw new Error('fail');
                        }
                    },

                    adapter = implementation(null, {}, jade, cwd),
                    compileJade = adapter.compileJade;

                adapter.resolveLegacyPath = function(path) {
                    return path + '.jade';
                };

                compileJade(path, 'p=foo', function(err, data) {
                    expect(called).to.equal(true);
                    expect(err).to.be.ok;
                    expect(err.message).to.equal('fail');
                    expect(data).to.not.be.ok;
                    done();
                });
            });
        });

        describe('#resolveLegacyPath', function() {
            it('resolves non-node_module paths', function() {
                var adapter = implementation({
                        join: function() {
                            return [].slice.call(arguments)
                                .join('/').replace(/\/\//g, '/');
                        }
                    }, {}, null, '/views/common/'),
                    resolveLegacyPath = adapter.resolveLegacyPath;

                expect(resolveLegacyPath('foo/bar'))
                    .to.equal('/views/common/foo/bar.jade');
            });

            it('resolves legacy node_module paths', function() {
                var adapter = implementation(
                        require('path'), {}, null, '/views/common/'),
                    resolveLegacyPath = adapter.resolveLegacyPath,
                    result = 'node_modules' +
                        resolveLegacyPath('node_modules/foo/bar')
                            .split('node_modules')[1];

                expect(result)
                    .to.equal('node_modules/foo/bar.jade');
            });
        });
    });
});
