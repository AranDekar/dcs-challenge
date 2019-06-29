var modulePath = '../../../../lib/template-loader/sandbox_implementation',
    åexpect = require('chai').expect,
    implementation = require(modulePath);

describe('External Template Loader', function() {
    describe('Sandbox', function() {
        var dependencies = {},
            vmScript;

        beforeEach(function() {
            vmScript = function() {
                return {
                    runInNewContext: function() {
                        throw new Error('Not Mocked!');
                    }
                };
            };

            dependencies = {
                clone: function(input) {
                    return input;
                },
                vm: {
                    Script: vmScript
                },
                jade: { runtime: {} }
            };
        });

        it('Returns a function', function() {
            var sandbox =
                    implementation(
                        dependencies.clone,
                        dependencies.vm,
                        dependencies.jade),

                result = sandbox('blah', 'blah');

            expect(result).to.be.a('function');
        });

        it(
            'Returned function executes vm.runInNewContext with source, scope, and filename',
            function(done) {
                dependencies.vm.Script = function(code, options) {
                    return {
                        runInNewContext: function(scope) {
                            expect(code).to.equal('source');
                            expect(options.filename).to.equal('filename');

                            expect(scope).to.be.an('object');

                            expect(scope.jade).to.be.an('object');
                            expect(scope.jade).to.eql(dependencies.jade.runtime);

                            expect(scope.data).to.be.an('object');
                            expect(scope.data).to.eql(data);

                            done();
                        }
                    };
                };

                var sandbox =
                        implementation(
                            dependencies.clone,
                            dependencies.vm,
                            dependencies.jade),

                    runner = sandbox('filename', 'source'),
                    data = {
                        'foo': 'bar',
                        'fibble': 'crunk',
                        'bogus': 3
                    };

                runner(data);
            });

        it('Returned function outputs result of sandbox.output', function() {
            dependencies.vm.Script = function(code, filename) {
                return {
                    runInNewContext: function(context) {
                        context.output = 'foooo';
                    }
                };
            };

            var sandbox =
                    implementation(
                        dependencies.clone,
                        dependencies.vm,
                        dependencies.jade),

                runner = sandbox('filename', 'source'),
                data = {},
                output;

            output = runner(data);
            expect(output).to.equal('foooo');
        });
    });
});
