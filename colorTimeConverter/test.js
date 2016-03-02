'use strict'
let ColorTimeConverter = require('./colorTimeConverter.js');
let colorTimeConverter = new ColorTimeConverter();
let assert = require('assert')

describe('colorTimeConverter.getColor()', function () {
    var tests = [
        {
            args: [15, 0, 10, 65535, 25500],
            expected: 65535 - (65535 - 25500) / 3
        },
        {
            args: [10, 0, 5, 25500, 0],
            expected: 25500 - (25500 - 0) / 2
        },
  ];

    tests.forEach(function (test) {
        it('correctly calculates ' + test.args + ' to ' + test.expected, function () {
            var res = colorTimeConverter.getColor.apply(null, test.args);
            assert.equal(res, test.expected);
        });
    });
});