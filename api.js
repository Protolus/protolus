#!/usr/bin/node
GLOBAL.mysql = require("mysql");
GLOBAL.mongo = require("mongojs");
GLOBAL.amqp = require("amqp");
require('Protolus.Bootstrap').apply(GLOBAL);

Protolus.resourceDirectory = __dirname+'/Source';
Protolus.configurationDirectory = __dirname+'/Configuration';
Protolus.classDirectory = __dirname+'/Classes';

Protolus.appName = 'Demo    API';
Protolus.appPort = 77777;

Protolus.bootstrap({
    console : true
});

var application;
Protolus.require(
    [ 'Extensions', 'Core', 'Web'], function(){
        application = new Protolus.WebApplication( { data : true }, function(){
            Protolus.loadClass('APIKey');
            Protolus.loadClass('Session');
            Protolus.loadClass('User');
            application.authenticatedAPI(function(args, connection){
                var results = Data.search('User', "id=10 && something = 'blaar(gh' && (thing > 5 || munger=true)");
                connection.respond('hi there!');
                return;
                var path = connection.request.path.substring(1);
                var parts = path.split('/');
                if(parts.length > 0 && parts[0] == '') parts.shift();
                if(parts.length == 0) connection.error('No subject');
                var type = parts.shift();
                if(!Protolus.classExists(type)) connection.error('Type not found:'+type);
                if(parts.length == 0) connection.error('No action for type:'+type);
                var id = parts.shift();
                if(typeOf(id) != 'number'){
                    if(id != 'create') connection.error('Unsupported action('+id+') for type:'+type);
                    var object = Data.new(type);
                    if(args.values) Object.each(args.values, function(item, key){
                        object.set(key, item);
                    });
                    object.save(function(){
                        connection.respond(JSON.encode(object.data));
                    });
                    return;
                }
                console.log('type:'+type);
                console.log('arguments');
                console.log(args);
                //console.log(connection.request);
                connection.respond('hi there!');
            }, function(args, connection, message){
                var prettyError = message;
                var type = 'error';
                switch(message){
                    case 'no_credentials':
                        prettyError = 'No API credentials sent';
                        type='unauthorized';
                        break;
                    case 'invalid_key':
                        prettyError = 'Invalid API key';
                        break;
                }
                connection.error(prettyError, type);
            });
        });
    }
);