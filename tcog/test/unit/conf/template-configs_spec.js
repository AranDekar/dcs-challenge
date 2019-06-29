const expect = require('chai').expect;

describe('The template-config autoloader', function() {
    var modulePath = '../../../conf/template-configs_implementation';

    it('should return a map of the config files on the filesystem', function() {
        var callCount = 0,
            files = [
                { 'a': 'b' },
                { 'c': 'd' },
                { 'e': 'f' },
                { 'g': 'h' }
            ],
            dirListMock = function(dir, cb) {
                callCount++;
                return [
                    'abc.json',
                    'def.json',
                    'jklm-abc.json',
                    'dtf_abc_axp.json'
                ];
            },
            readFileMock = function(path) {
                callCount++;
                if (!files.length) throw new Error('Called too many times!');
                return files.shift();
            },
            templateConfigsLoader =
                require(modulePath)(dirListMock, readFileMock);

        expect(callCount).to.equal(5);
        expect(templateConfigsLoader).to.eql({
            'abc': { 'a': 'b' },
            'def': { 'c': 'd' },
            'jklm-abc': { 'e': 'f' },
            'dtf_abc_axp': { 'g': 'h' }
        });
    });

    it('should only include compliant JSON files in the map', function() {
        var callCount = 0,
            files = [
                { 'a': 'b' },
                { 'c': 'd' },
                { 'e': 'f' },
                { 'g': 'h' }
            ],
            dirListMock = function(dir, cb) {
                callCount++;
                return [
                    'abc.json',
                    'def.json',
                    'jklm-abc.json',
                    'dtf_abc_axp.json',
                    // value which should be filtered out
                    '.DS_Store'
                ];
            },
            readFileMock = function(path) {
                callCount++;
                if (!files.length) throw new Error('Called too many times!');
                return files.shift();
            },
            templateConfigsLoader =
                require(modulePath)(dirListMock, readFileMock);

        expect(callCount).to.equal(5);
        expect(templateConfigsLoader).to.eql({
            'abc': { 'a': 'b' },
            'def': { 'c': 'd' },
            'jklm-abc': { 'e': 'f' },
            'dtf_abc_axp': { 'g': 'h' }
        });
    });
});
