#!/usr/bin/node
GLOBAL.mysql = require("mysql");
GLOBAL.mongo = require("mongojs");
GLOBAL.amqp = require("amqp");
require('AsciiArt').apply(GLOBAL);
require('Protolus.Bootstrap').apply(GLOBAL);

Protolus.resourceDirectory = __dirname+'/Source';
Protolus.configurationDirectory = __dirname+'/Configuration';
Protolus.classDirectory = __dirname+'/Classes';

Protolus.appName = 'ffff';
Protolus.appPort = 77777;

Protolus.bootstrap({
    console : true
});
Protolus.verbose = true;
var application;
var passwordHash = function(password){
    var shasum = System.crypto.createHash('sha1');
    shasum.update(password);
    return shasum.digest('hex');
}
Protolus.require(
    [ 'Extensions', 'Core', 'Web'], function(){
        application = new Protolus.WebApplication( { data : true }, function(){
            //Protolus.appName = 'Demo    API';
            Protolus.loadClass('APIKey');
            Protolus.loadClass('APIToken');
            Protolus.loadClass('Session');
            Protolus.loadClass('User');
            application.consoleOutput();
            application.authenticatedAPI(function(args, connection){
                var apiCall = function(args, connection){
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
                            var options = {
                                onSuccess : function(data, info){
                                    if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                                    connection.respond(JSON.encode(Object.merge({
                                        response:'success', 
                                        data:data
                                    }, info)));
                                }, 
                                onFailure : function(error){
                                    connection.error(error);
                                },
                                limit : 10,
                                progenitor : connection.user
                            };
                            if(args.page) options.page = parseInt(args.page);
                            if(args.limit) options.limit = parseInt(args.limit);
                            if(args.offset) options.offset = parseInt(args.offset);
                            var results = Data.query(
                                type, '', 
                                options
                            );
                        }else{ //create a new object
                            var object = Data.new(type);
                            object.progenitor = connection.user;
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
                        object.progenitor = connection.user;
                        object.load(id, function(){
                            if(parts.length > 0 && parts[0] == 'edit'){
                                if(args.values) Object.each(args.values, function(item, key){
                                    object.set(key, item);
                                });
                                object.save(function(){
                                    if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                                    connection.respond(JSON.encode({
                                        response:'success', 
                                        data:object.data
                                    }));
                                },function(err){
                                    connection.error('Could not save '+object.primaryKey+' ('+id+')');
                                    throw(err);
                                });
                            }else{
                                if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+connection.id+']');
                                connection.respond(JSON.encode({
                                    response:'success', 
                                    data:object.data
                                }));
                            }
                        }, function(err){
                            connection.error('Could not load '+object.primaryKey+' ('+id+')');
                        });
                    }
                };
                if(!connection.user){
                    if((args.username || args.email) && args.password){
                        var password = passwordHash(args.password); //salt?
                        var callback = function(users){
                            if(users.length == 0){
                                connection.error('Authentication failed, please check your credentials!', 'forbidden');
                            }else{
                                connection.user = users[0];
                                connection.setSession('user_id', connection.user.get(connection.user.primaryKey));
                                apiCall(args, connection);
                            }
                        }.bind(this);
                        var error = function(err){
                            connection.error(err, 'forbidden');
                        }.bind(this);
                        if(args.username){
                            Data.search('User', 'name=\''+args.username+'\' && password=\''+password+'\'', callback, error);
                            return;
                        }else{
                            Data.search('User', 'email=\''+args.email+'\' && password=\''+password+'\'', callback, error);
                            return;
                        }
                    }else{
                        connection.error('You must be logged in to do that!');
                        return;
                    }
                }else apiCall(args, connection);
                
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