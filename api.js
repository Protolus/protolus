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
Protolus.verbose = true;
var application;
Protolus.require(
    [ 'Extensions', 'Core', 'Web'], function(){
        application = new Protolus.WebApplication( { data : true }, function(){
            Protolus.loadClass('APIKey');
            Protolus.loadClass('Session');
            Protolus.loadClass('User');
            application.consoleOutput();
            application.authenticatedAPI(function(args, connection){
                var path = connection.request.path.substring(1);
                var parts = path.split('/');
                if(parts.length > 0 && parts[0] == '') parts.shift();
                if(parts.length == 0) connection.error('No subject');
                var type = parts.shift();
                if(!Protolus.classExists(type)) connection.error('Type not found:'+type);
                if(parts.length == 0) connection.error('No action for type:'+type);
                var id = parts.shift();
                if(!Protolus.isNumeric(id)){
                    if(id != 'create' && id != 'list') connection.error('Unsupported action('+id+') for type:'+type);
                    if(id === 'list'){ //list objects
                        var results = Data.query(
                            type, '', 
                            {
                                onSuccess : function(data){
                                    if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                                    connection.respond(JSON.encode({
                                        response:'success', 
                                        data:data
                                    }));
                                }, 
                                onFailure : function(error){
                                    connection.error(error);
                                }
                            }
                        );
                    }else{ //create a new object
                        var object = Data.new(type);
                        if(args.values) Object.each(args.values, function(item, key){
                            object.set(key, item);
                        });
                        object.save(function(){
                            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                            connection.respond(JSON.encode({
                                response:'success', 
                                data:object.data
                            }));
                        }, function(err){
                            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                            connection.respond(JSON.encode({
                                response:'failure', 
                                message:err
                            }));
                        });
                    }
                    return;
                }else{
                    var object = Data.new(type);
                    object.load(id, function(){
                        if(parts.length > 0 && parts[0] == 'edit'){
                            if(args.values) Object.each(args.values, function(item, key){
                                object.set(key, item);
                            });
                            object.save(function(){
                                connection.respond(JSON.encode({
                                    response:'success', 
                                    data:object.data
                                }));
                            });
                        }else{
                            connection.respond(JSON.encode({
                                response:'success', 
                                data:object.data
                            }));
                        }
                    }, function(){
                        connection.error('Could not load '+object.primaryKey+' ('+id+')');
                    });
                }
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