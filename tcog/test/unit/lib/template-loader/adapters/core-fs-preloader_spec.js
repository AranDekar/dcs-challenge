const expect = require('chai').expect;

describe('The core view preloader', function() {
    var modulePath = '../../../../../lib/template-loader/adapters/core-fs-preloader_implementation';

    it('should return a map of the view files on the filesystem', function() {
        var callCount = 0,
            baseViewPath = './views',
            files = {
                './views/foo/bar.jade': 'bar',
                './views/foo/baz.jade': 'baz',
                './views/clock/woz.jade': 'clock woz'
            },
            directories = {
                './views/': [ 'foo', 'clock' ],
                './views/foo': [ 'baz.jade', 'bar.jade' ],
                './views/clock': [ 'woz.jade' ]
            },
            dirListMock = function(dir) {
                callCount++;
                return directories[dir];
            },
            readFileMock = function(path) {
                callCount++;
                return files[path];
            },
            statSyncMock = function(path) {
                callCount++;
                return {
                    'isDirectory': function() {
                        return path in directories;
                    }
                };
            },
            coreViewMap =
                require(modulePath)(dirListMock, readFileMock, statSyncMock, baseViewPath);

        expect(callCount).to.equal(12);
        expect(coreViewMap).to.eql({
            '../foo/bar': 'bar',
            '../foo/baz': 'baz',
            '../clock/woz': 'clock woz'
        });
    });

    it('should not include non-jade files in the map', function() {
        var callCount = 0,
            baseViewPath = './views',
            files = {
                './views/zimble': 'should not be in the map!',
                './views/foo/bar.jade': 'bar',
                './views/foo/baz.jade': 'baz',
                './views/clock/woz.jade': 'clock woz',
                './views/clock/baguette': 'should not be here!'
            },
            directories = {
                './views/': [ 'foo', 'clock', 'zimble' ],
                './views/foo': [ 'baz.jade', 'bar.jade' ],
                './views/clock': [ 'woz.jade', 'baguette' ]
            },
            dirListMock = function(dir) {
                callCount++;
                return directories[dir];
            },
            readFileMock = function(path) {
                callCount++;
                return files[path];
            },
            statSyncMock = function(path) {
                callCount++;
                return {
                    'isDirectory': function() {
                        return path in directories;
                    }
                };
            },
            coreViewMap =
                require(modulePath)(dirListMock, readFileMock, statSyncMock, baseViewPath);

        expect(callCount).to.equal(14);
        expect(coreViewMap).to.eql({
            '../foo/bar': 'bar',
            '../foo/baz': 'baz',
            '../clock/woz': 'clock woz'
        });
    });

    it("should not treat the 'common' directory as the base directory", function() {
        var callCount = 0,
            baseViewPath = './views',
            files = {
                './views/zimble': 'should not be in the map!',
                './views/common/bar.jade': 'bar',
                './views/common/baz.jade': 'baz',
                './views/clock/woz.jade': 'clock woz',
                './views/clock/baguette': 'should not be here!'
            },
            directories = {
                './views/': [ 'common', 'clock', 'zimble' ],
                './views/common': [ 'baz.jade', 'bar.jade' ],
                './views/clock': [ 'woz.jade', 'baguette' ]
            },
            dirListMock = function(dir) {
                callCount++;
                return directories[dir];
            },
            readFileMock = function(path) {
                callCount++;
                return files[path];
            },
            statSyncMock = function(path) {
                callCount++;
                return {
                    'isDirectory': function() {
                        return path in directories;
                    }
                };
            },
            coreViewMap =
                require(modulePath)(dirListMock, readFileMock, statSyncMock, baseViewPath);

        expect(callCount).to.equal(14);
        expect(coreViewMap).to.eql({
            'bar': 'bar',
            'baz': 'baz',
            '../clock/woz': 'clock woz'
        });
    });
});
