#!/usr/bin/env node
'use strict';
var meow = require('meow');
var arrayComparator = require('./');

var cli = meow({
  help: [
    'Usage',
    '  array-comparator <input>',
    '',
    'Example',
    '  array-comparator Unicorn'
  ].join('\n')
});

arrayComparator(cli.input[0]);
