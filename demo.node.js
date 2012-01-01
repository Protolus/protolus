#!/usr/local/bin/node
//require.paths.push(__dirname+'/Lib');
//require.paths.push(__dirname+'/Build');
//require('MooTools').apply(GLOBAL);
//require('Protolus.node').apply(GLOBAL);
//require('AsciiArt').apply(GLOBAL);
var fs = require('fs');
//var Canvas = require('canvas').apply(GLOBAL);

//Protolus.createServer();
/*Protolus.Image.Booth.startup();

var im = new Protolus.Image();
console.log('1');
  img = new Image();
  console.log('2');
fs.readFile(__dirname + '/Images/test.jpg', function(err, pic){
  if (err) throw err;
  console.log('3');
  img.src = pic;
  console.log('4');
  im.newLayer(img);
  console.log('5');
});*/
var Canvas = require('canvas')
  , canvas = new Canvas(200,200)
  , ctx = canvas.getContext('2d');
fs.readFile(__dirname + '/Images/test.jpg', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
});
