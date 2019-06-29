'use strict';

const jade = require('jade'),
    fs = require('fs'),
    expect = require('chai').expect,
    path = require('path');

let template;

describe('The video index', () => {
    beforeEach((done) => {
        const buf = fs.readFileSync('./views/video/index.jade');

        template = jade.compile(buf.toString(), {
            filename: path.join(__dirname + './../../../../views/video', 'esi.jade'),
            pretty: true
        });
        done();
    });

    it('compiles', () => {
        expect(template).to.not.be.null;
    });
});
