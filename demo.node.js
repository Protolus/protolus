#!/usr/local/bin/node
require.paths.push(__dirname+'/Lib');
require.paths.push(__dirname+'/Build');
require('MooTools').apply(GLOBAL);
require('Protolus.node').apply(GLOBAL);
require('AsciiArt').apply(GLOBAL);

Protolus.createServer();
Protolus.Image.Booth.startup();
var image = new Protolus.Image();
img = new Image;
img.src = 'test.jpg';
image.newLayer(img);
