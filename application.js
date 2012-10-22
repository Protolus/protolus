#!/usr/bin/node
GLOBAL.mysql = require("mysql");
GLOBAL.mongo = require("mongojs");
GLOBAL.amqp = require("amqp");
require('AsciiArt').apply(GLOBAL);
require('Protolus.Bootstrap').apply(GLOBAL);

Protolus.resourceDirectory = __dirname+'/Source';
Protolus.configurationDirectory = __dirname+'/Configuration';
Protolus.classDirectory = __dirname+'/Classes';

Protolus.appName = 'Demo    API';
Protolus.appPort = 77777;

Protolus.bootstrap({
    console : true
});
Protolus.requestableFiletypes = [
    'jpeg','jpg',
    'gif',
    'png',
    'html',
    'js',
    'tpl',
    'css',
    'less'
];
Protolus.verbose = true;
var application;
var errorFunction = function(connection, message, code){
    if(!code) code = 400;
    System.file.readFile(code+'.html', 'utf8', function(err, data){
        var page;
        if(err){
            page = '<html><body><h1>'+message+'</h1></body></html>';
        }else{
            page = data.replace('{{message}}', message);
        }
        connection.error(page, code);
    });
};
Protolus.require(
    [ 'Extensions', 'Core', 'Web', 'Parsers', 'Templating'], function(){
        application = new Protolus.WebApplication({ data : true }, function(){
            Protolus.loadClass('APIKey');
            Protolus.loadClass('Session');
            Protolus.loadClass('User');
            application.serve(function(args, connection){
                connection.html();
                var path = connection.request.path.substring(1);
                var parts = path.split('/');
                if(parts.lastIndexOf('.') != -1){
                    var type = parts.substring(parts.lastIndexOf('.'));
                    console.log('Type:'+type);
                    if(!Protolus.requestableFiletypes.contains(type.toLowerCase())){
                        connection.htmlStatusToCode('error');
                    }
                }else{
                    Protolus.route(path, function(routedPath){
                        Protolus.Panel.exists(path, function(panelExists){
                            if(panelExists){
                                var panel = new Protolus.Panel(path);
                                panel.render(function(result){
                                    //console.log('rendered', result);
                                    connection.respond(result);
                                });
                                /*console.log('EXXST', panelExists);
                                var template = new Protolus.Template.Smarty(path);
                                template.render(function(rendered){
                                    console.log('REN', rendered);
                                });*/
                               // connection.respond('This panel exists');
                                //todo: render
                            }else{
                                errorFunction(connection, 'This panel does not exist', 404);
                            }
                        });
                    });
                }
            });
        });
    }
);