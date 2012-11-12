/*
---
description: Protolus RAD framework port to JS

license: MIT-style

authors:
    - Abbey Hawk Sparrow

requires:
    - core/1.2.4: '*'
    - [Midas.Smarty, Midas.INIParser, Midas.Properties]

provides: [Protolus.PageRenderer, Protolus.Panel, Protolus.Lib, Protolus.Logger, Protolus.WebApplication]
...
*/

if(!Protolus) var Protolus = {};

// Routes
Protolus.routes = [];
Protolus.routes.routesLoaded = false;
Protolus.route = function(path, callback){
    if(Protolus.routes.routesLoaded){
        var iniParser = new Midas.OrderedINIParser();
        var myRequest = new Request({
            url: '/App/routes.conf',
            onSuccess: function(data){
                try{
                    var ini = iniParser.parse(data, true);
                }catch(ex){
                    console.log('[routes not loaded]');
                }
                Protolus.routes = (ini && ini[0] && ini[0].value)?ini[0].value:[];
                Protolus.routes.routesLoaded = true;
                Protolus.routes.each(function(value, index){
                    Protolus.Panel.exists(path, function(panelExists){
                        if(Protolus.routes[index].key == '%') Protolus.routes[index].key = '(.*?)'
                        else Protolus.routes[index].key = Protolus.routes[index].key.replace(/\*/g, '(.*?)').replace('#', '([0-9]*?)');
                        Protolus.routes[index].regex = new RegExp('^'+Protolus.routes[index].key+'$');
                        count = 1;
                        var pos = Protolus.routes[index].value.indexOf('*');
                        while(pos != -1){
                            Protolus.routes[index].value = Protolus.routes[index].value.substring(0, pos)+'$'+(count++)+Protolus.routes[index].value.substring(pos+1);
                            pos = Protolus.routes[index].value.indexOf('*');
                        }
                    });
                });
                Protolus.route(path, callback);
            }
        }).send();
        return;
    }
    var called = false;
    Protolus.Panel.exists(path, function(panelExists){
        Protolus.routes.each(function(route, index){
            if(called) return;
            //console.log(['routing', path, path.match(route.regex), route])
            if(route.key == '(.*?)'){
                if(!panelExists){
                    callback(path.replace(route.regex, route.value));
                    called = true;
                }
            }else if(!called && path.match(route.regex)){
                callback(path.replace(route.regex, route.value));
                called = true;
            }
        }.bind(this));
    }.bind(this));
    if(!called){
        callback(path);
    }
};
Protolus.consumeGetParameters = function(panel){
    if(panel.indexOf('?') != -1){ //we have some additional args we need to strip off
        var parts = panel.split('?');
        panel = parts[0];
        var parameters = parts[1].split('&');
        parameters.each(function(line){
            var words = line.split('=');
            var key = words[0];
            var value = words[1];
            Protolus.globals[key] = value;
        });
    }
    return panel;
};

//Resources
//Protolus.resourceDir = '/Resources/';
Protolus.resources = {};
Protolus.resources.components = {};
Protolus.resources.js = [];
Protolus.Resource = new Class({
    resources : [],
    dependencies : [],
    scriptFiles : [],
    styleFiles : [],
    fileRegistry : {},
    loaded : false,
    mode : 'implicit', //'implicit', 'return'
    resolveDependencies : false,
    baseDirectory : false,
    initialize : function(name, callback, option){ //todo, integrate callback into options and use normal options
        if(option && option.mode) this.mode = option.mode;
        if(option && option.resolveDependencies) this.resolveDependencies = option.resolveDependencies;
        if(option && option.directory) this.baseDirectory = option.directory;
        else this.baseDirectory = Protolus.resourceDirectory;
        this.name = name;
        var filename = this.baseDirectory+'/'+name+'/component.json';
        var ob = this;
        new Request.JSON({
            url: filename, 
            async: (!(callback === true)),
            onSuccess: function loadResource(data){
                if(this.resolveDependencies && data.dependency && data.dependency.length){
                    var dependencies = data.dependency;
                    this.dependencies = dependencies;
                    data.dependency = [];
                    var dependencyCallback = function(){
                        loadResource.bind(this)(data, callback); //load the rest of the resources
                    }.bind(this);
                    if(option && option.onDependency){
                        option.onDependency(dependencies, dependencyCallback);
                    }
                    return;
                }
                if(data.resource) data.resource.each(function(file){
                    var type = file.split('.').pop().toLowerCase();
                    var path = this.baseDirectory+'/'+name+'/'+file;
                    if(!this.fileRegistry[type]) this.fileRegistry[type] = [];
                    this.fileRegistry[type].push(path);
                    switch(type){
                        case 'js':
                            this.scriptFiles.push(path);
                            break;
                        case 'css':
                            this.styleFiles.push(path);
                            break;
                    }
                }.bind(this));
                if(this.mode == 'implicit'){
                    Protolus.requireJS(this.scriptFiles, name, callback);
                    if(this.styleFiles.length > 0){
                        Protolus.requireCSS(this.styleFiles, name, callback);
                    }
                } else{
                    callback();
                }
            }.bind(this),
            onFailure: function(data){
                console.log('['+AsciiArt.ansiCodes('⚠ ERROR', Protolus.errorColor)+']:'+'RESOURCE LOADING ERROR ('+name+')');
                callback();
                //console.log('RESOURCE ERROR LOADING : '+name+'!');
            }
        }).send();
    },
    files : function(type, callback){
        var files = [];
        if(Protolus.isNode){
            var count = 0;
            var result = '';
            if(this.fileRegistry[type]){
                this.fileRegistry[type].each(function(res, index){
                    count++;
                    System.file.readFile(res, 'utf8', function(err, data){
                        if(err){
                            console.log((new Error).stack);
                            throw('file load error('+res.toString()+')!');
                        }
                        files[index] = (data+' //@ sourceURL='+res+"\n");
                        count--;
                        if(count == 0){
                            callback(files);
                        }
                    }.bind(this));
                });
            }else{
                callback([]);
            }
        }else{
        
        }
    },
    
});
Protolus.requireBundle = function(name, callback){
    var resources = Protolus.loadedResources();
    if(!resources.contains(name)){
        //console.log(['RES', name]);
        new Protolus.Resource(name);
    }//else console.log(['RES-E', name]);
}
Protolus.minify = true;
Protolus.requireGroups = {};
Protolus.loadedResources = function(){
    //var head = document.id(document.head);
    var documentHead = document.id(document.getElementsByTagName('head')[0]);
    var results = [];
    documentHead.getChildren().each(function(tag){
        if(!tag.get('resource')) return;
        tag.get('resource').split('-').each(function(resource){
            if(!results.contains(resource)) results.push(resource); 
        });
    });
    return results;
};
Protolus.requireCSS = function(resource, name, callback){
    if(!Protolus.isNode){
        var request = Midas.SmartyLib.generateUUID();
        if(typeOf(resource) == 'array'){ 
            if(!Protolus.minify){ //many non-minified items
                resource.each(function(res){
                    Protolus.requireGroups[request]++;
                    Protolus.requireCSS(res, name, function(){
                        Protolus.requireGroups[request]--;
                        if(Protolus.requireGroups[request] == 0){
                            callback();
                        }else{
                            console.log(['require ND', request, Protolus.requireGroups[request]]);
                        }
                    });
                });
            }else{ //minified
                var base = Protolus.sharedBaseDirectory(resource);
                var relative_path;
                var paths = [];
                resource.each(function(res){
                    relative_path = res.substring(base.length+1);
                    paths[paths.length] = relative_path;
                });
                //minify default:
                //var link = '/min/?b='+base.substring(1)+'&f='+paths.join(',');
                var link = '/style/min/'+name;
                var styleTag = new Element('link', {
                    origin : 'protolus',
                    rel : 'stylesheet',
                    type : 'text/css',
                    href : link,
                    resource : name
                });
                //console.log(styleTag);
                var head = document.getElementsByTagName('head')[0];
                head.adopt(styleTag);
            }
        }else{
            
        }
    }else{
        var count = resource.length;
        var result = '';
        resource.each(function(res){
            //count++;
            System.file.readFile(res, 'ascii', function(data, err){
                console.log('dd:'+res);
                if(err){
                    console.log(err);
                    throw('load error');
                }
                result += data;
                count--;
                if(count == 0){
                    //if(Protolus.minify) result = Code.minify(result);
                    callback(result);
                }
            });
        });
    }
}
Protolus.executeWhenResourceExists = function(res, callback, args){
    if(typeOf(res) == 'string') res = res.split(',');
    Protolus.whenTrueAct(function(){
        var result = true;
        var registered = Protolus.loadedResources();
        this.each(function(resource){
            result = result && registered.contains(resource);
        });
        return result;
    }.bind(res), callback, args);
}
Protolus.requireJS = function(resource, name, callback){
    if(!Protolus.isNode){
        var request = Midas.SmartyLib.generateUUID();
        if(typeOf(resource) == 'array'){ 
            if(!Protolus.minify){ //many non-minified items
                resource.each(function(res){
                    Protolus.requireGroups[request]++;
                    Protolus.requireJS(res, name, function(){
                        Protolus.requireGroups[request]--;
                        if(Protolus.requireGroups[request] == 0){
                            callback();
                        }else{
                            console.log(['require ND', request, Protolus.requireGroups[request]]);
                        }
                    });
                });
            }else{ //minified
                var base = Protolus.sharedBaseDirectory(resource);
                var relative_path;
                var paths = [];
                resource.each(function(res){
                    relative_path = res.substring(base.length+1);
                    paths[paths.length] = relative_path;
                });
                //var link = '/min/?b='+base.substring(1)+'&f='+paths.join(',');
                var link = '/javascript/min/'+name;
                var scriptTag = new Element('script', {
                    origin : 'protolus',
                    type : 'text/javascript',
                    src : link,
                    onLoad : "this.setAttribute('resource', '"+name+"');",
                    //resource :name,
                });
                var head = document.getElementsByTagName('head')[0];
                head.adopt(scriptTag);
            }
        }else{
            
        }
    }else{
        var count = 0;
        var result = '';
        var ress = [];
        resource.each(function(res){
            count++;
            console.log('['+AsciiArt.ansiCodes('JS', 'green')+']'+res);
            var localCount = count;
            System.file.readFile(res, 'utf8', function(err, data){
                if(err){
                    console.log((new Error).stack);
                    throw('file load error('+res.toString()+')!');
                }
                ress[localCount] = data+' //@ sourceURL='+res+"\n";
                count--;
                if(count == 0){
                    result = ress.join("\n");
                    try{
                        eval.apply(GLOBAL, [result]);
                    }catch(ex){
                        console.log('Error('+ex.toString()+'):'+res);
                        console.log(ex.lineNumber, ex.name, ex.stack);
                    }
                    //console.log('ddd', ress);
                    callback();
                }
            });
        });
    }
}