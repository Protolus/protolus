/*
---
description: Protolus RAD framework port to JS

license: MIT-style

authors:
    - Abbey Hawk Sparrow

requires:
    - core/1.2.4: '*'
    - [Midas.Smarty, Midas.INIParser, Midas.Properties]

provides: [Protolus.WebApplication]
...
*/

if(!Protolus) var Protolus = {};
Protolus.WebConnection = new Class({
    request : false,
    response : false,
    initialize : function(request, response){
        this.request = request;
        this.response = response;
        this.cookies = new System.cookies(request, response);
        this.id = System.uuid.v1();
    },
    error : function(options, type, callback){
        if(typeOf(options) == 'string') options = {message:options};
        if(typeOf(type) == 'string') options.type = type;
        if(!callback && typeOf(type) == 'function'){
            callback = type;
            delete type;
        }
        var action = 'error';
        switch(options.type){}
        if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('⚠ ERROR', Protolus.errorColor)+':'+this.id+']:'+options.message);
        if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('COMPLETE', 'yellow')+':'+this.id+']');
        this.respond(options.message, action);
        if(callback) callback(options);
    },
    htmlStatusToCode : function(code){
        switch(code){
            case 'ok':
                code = 200;
                break;
            case 'not_modified':
                code = 304;
                break;
            case 'bad_request':
                code = 400;
                break;
            case 'unauthorized':
                code = 401;
                break;
            case 'forbidden':
                code = 403;
                break;
            case 'not_found':
                code = 404;
                break;
            case 'not_acceptable':
                code = 406;
                break;
            case 'rate_limited':
                code = 420;
                break;
            case 'internal_server_error':
            case 'error':
                code = 500;
                break;
            case 'bad_gateway':
                code = 502;
                break;
            case 'service_unavailable':
                code = 503;
                break;
        }
        return code;
    },
    respond : function(text){
        this.response.writeHead(200);
        this.response.end(text);
    },
    api : function(){
        this.respond = function(message, code){
            if(!code) code = 'ok';
            code = this.htmlStatusToCode(code);
            this.response.writeHead(code);
            this.response.end(message);
        }.bind(this);
        this.error = function(options, type, callback){
            if(typeOf(options) == 'string') options = {message:options};
            if(typeOf(type) == 'string' || typeOf(type) == 'number') options.type = type;
            if(!callback && typeOf(type) == 'function'){
                callback = type;
                delete type;
            }
            var response = {};
            response.status = 'error';
            if(!options.type) options.type = 'error';
            if(options.message) response.message = options.message;
            response.code = this.htmlStatusToCode(options.type);
            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('⚠ ERROR', 'red+blink')+']:'+options.message);
            this.respond(JSON.encode(response), options.type);
            if(callback) callback(response);
        }
    },
    html : function(){
        this.respond = function(message, code){
            if(!code) code = 'ok';
            code = this.htmlStatusToCode(code);
            this.response.writeHead(code);
            this.response.end(message);
        }.bind(this);
        this.error = function(options, type, callback){
            if(typeOf(options) == 'string') options = {message:options};
            if(typeOf(type) == 'string' || typeOf(type) == 'number') options.type = type;
            if(!callback && typeOf(type) == 'function'){
                callback = type;
                delete type;
            }
            var response = {};
            response.status = 'error';
            if(!options.type) options.type = 'error';
            if(options.message) response.message = options.message;
            response.code = this.htmlStatusToCode(options.type);
            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('⚠ ERROR', 'red+blink')+']:'+options.message);
            this.respond(JSON.encode(response), options.type);
            if(callback) callback(response);
        }
    }
});
Protolus.WebApplication = new Class({
    Extends : Protolus.Application,
    Implements : Protolus.Session,
    initialize : function(options, callback){
        this.parent(options, function(){
            this.respond = function(text){
                this.response.writeHead(200);
                this.response.end(text);
            }.bind(this);
            if(callback) callback();
        }.bind(this));
    },
    API : function(callback){
        this.api = true;
        this.serve(callback);
    },
    authenticatedAPI : function(callback, fail){
        this.API(function(args, connection){
            if( (!args.api_key) && (!args.api_token) ) return fail(args, connection, 'no_credentials');
            if(args.api_token){
                Data.search('APIToken', 'token=\''+args.api_token+'\'', function(sessions){
                    if(sessions.length == 1){
                        callback(args, connection);
                        return;
                    }else{
                        return fail(args, connection, 'no_credentials');
                    }
                },function(err){
                    return fail(args, connection, 'no_credentials');
                    throw(err)
                });
                //if(sessions.length == 0) fail(args, 'invalid_key');
            }else if(args.api_key){
                Data.search('APIKey', 'key=\''+args.api_key+'\'', function(keys){
                    if(keys.length == 1){
                        if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('AUTHENTICATED', 'green')+':'+connection.id+']');
                        var api_key = keys[0].get('key');
                        Data.search('APIToken', 'api_key=\''+api_key+'\'', function(existingTokens){
                            existingTokens.each(function(token){
                                token.delete();
                            });
                            var token = new APIToken();
                            token.set('token', Data.id('uuid'));
                            token.set('type', 'user');
                            token.set('verbose', false);
                            token.set('api_key', api_key);
                            token.save(function(){
                                callback(args, connection);
                            });
                            connection.cookies.set('api_token', token.get('token'));
                        },function(){
                            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('TOKEN CREATE FAILED', 'red+blink')+':'+connection.id+']');
                            return fail(args, connection, 'error');
                        });
                    }
                    if(keys.length == 0){
                        if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('AUTHENTICATION FAILED', 'red+blink')+':'+connection.id+']');
                        return fail(args, connection, 'invalid_key');
                    }
                },
                function(){
                });
                //todo log if keys are ever > 1
            }
        })
    },
    serve : function(callback){
        var finish = callback;
        var connection
        Protolus.addEvent('web', function (request, response) {
            connection = new Protolus.WebConnection(request, response);
            if(this.api) connection.api();
            if(Protolus.verbose) console.log('['+AsciiArt.ansiCodes('CONNECT', 'yellow')+':'+connection.id+']');
            //var crypto = require('crypto');
            //if(extendedLogging) Logger.id = crypto.createHash('md5').update(uuid.v1()).digest("hex");
            var args = {};
            var uri = System.url.parse(request.url,true);
            var path = uri.pathname;
            connection.request.path = path;
            var type = path.lastIndexOf('.')!= -1? path.substring(path.lastIndexOf('.')+1): false;
            connection.request.type = type;
            if(type) new APIError('incompatible filetype indicated');
            //todo: check to see if path matches custom path, if not:
            var parts = uri.pathname.split('/');
            if(parts[parts.length-1] == '') parts.pop();
            if(parts[0] == '') parts.shift();
            var identifier = null;
            var subject = parts.shift();
            if(parts.length){
                identifier = parts.shift();
            }
            if (request.method == 'POST') {
                var body = '';
                request.on('data', function (data){
                    body += data;
                });
                request.on('end', function (){
                    try{
                        args = JSON.parse(body);
                    }catch(ex){
                        args = System.querystring.parse(body);
                    }
                    finish(Object.merge(args, uri.query), connection);
                }.bind(this));
            }else{
                args = uri.query;
                finish(args, connection);
            }
        }.bind(this));
    },
    setCookie : function(){
    
    },
    getCookie : function(){
    
    },
    addHeader : function(){
    
    },
    setPost : function(){
    
    },
    getPost : function(){
    
    },
    setGet : function(){
    
    },
    getGet : function(){
    
    },
    get : function(){ //the 'global' get
    
    }
});