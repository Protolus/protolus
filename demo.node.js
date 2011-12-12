#!/usr/local/bin/node
require.paths.push(__dirname+'/Lib');
require.paths.push(__dirname+'/Build');
require('MooTools').apply(GLOBAL);
require('Protolus.node').apply(GLOBAL);
require('AsciiArt').apply(GLOBAL);

Protolus.createServer();

