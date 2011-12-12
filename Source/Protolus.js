/*
---
description: An extensible Smarty Parser in Mootools

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.Smarty]
...
*/
if(!Protolus) var Protolus = {};
Protolus.missingResource = function(uri) {
    console.log('Resource missing: '+uri);
}
Protolus.createServer = function(options){ //options currently unused
    var url = require('url');
    var fs = require('fs');
    Protolus.serverApplication = require('http').createServer(function handler (req, res) {
        var uri = url.parse(req.url,true);
        res.writeHead(200);
        var type = uri.pathname.lastIndexOf('.') != -1 ? uri.pathname.substring(uri.pathname.lastIndexOf('.')+1) : '!';
        var path = ((type == '!' && uri.pathname != '/')?uri.pathname+'.html':uri.pathname);
        type = path.lastIndexOf('.') != -1 ? path.substring(path.lastIndexOf('.')+1) : '!';
        console.log(['path', path, type, '|'+uri.pathname+'|']);
        switch(path){
            case '/':
                fs.readFile(__dirname+'/Pages/index.html', function (err, data) {
                    if (err) throw(err);
                    res.end(data);
                });
                break;
            default :
                //console.log([type, (__dirname+'/Images'+uri.pathname)]);
                switch(type.toLowerCase()){
                    case 'png':
                    case 'gif':
                    case 'jpg':
                    case 'jpeg':
                        fs.readFile(__dirname+'/Images'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Images'+path);
                            res.end(data);
                        });
                        break;
                    case 'js':
                        fs.readFile(__dirname+'/Lib/Client'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Lib/Client'+path);
                            res.end(data);
                        });
                        break;
                    case 'html':
                        fs.readFile(__dirname+'/Pages'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Pages'+path);
                            res.end(data);
                        });
                        break;
                    case 'css':
                        fs.readFile(__dirname+'/Styles'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Styles'+path);
                            res.end(data+'._'+path.replace(/[^-a-z0-9A-Z]/gi,"")+'_load_test {display: none;}');
                        });
                        break;
                    default:
                        //?????
                        fs.readFile(__dirname+'/404.html', function (err, data) {
                            if (err) throw(err);
                            res.end(data);
                        });   
                }
        }
    });
    
    Protolus.serverIO = require('socket.io').listen(Protolus.serverApplication);
    Protolus.filesystem = require('fs');
    Protolus.serverApplication.listen(80);
    
    Protolus.serverIO.set('log level', 1);
    Protolus.serverIO.sockets.on('connection', function (socket) {
        socket.on('template', function(data){
            
        });
        socket.on('render', function(data){
            
        });
        socket.on('handler', function(data){
            
        });
        socket.emit('startup', {
            
        });
    });
    return Protolus.serverApplication;
};

Protolus.createClient = function(){
    Protolus.socket = io.connect(window.location.protocol+"//"+window.location.host);
};

Protolus.Formats = {};
Protolus.Formats.uuid = function(){
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++)  s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    var uuid = s.join("");
    return uuid;
};