/*
---
description: An extensible Smarty Parser in Mootools

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Template, Protolus.Template.Node]
...
*/
Protolus.Template = new Class({
    Implements : [Events, Options],
    initialize: function(text, options){
        this.setOptions(options);
    },
    render : function(data, callback){
        return this.root.render();
    }
    
});
Protolus.TemplateData = new Class({
    data : {},
    set: function(key, value){
        var accessor = 'this.data';
        var parts = key.split('.')
        var current = this.data;
        var part;
        while(parts.length > 0){
            part = parts.pop();
            accessor += '[\''+part+'\']';
            try{
                eval('if(!'+accessor+'){ '+accessor+' = {};}');
            }catch(error){}
        }
        eval(accessor+' = value;');
        current;
    },
    get : function(key){
        var parts = key.split('.')
        var current = this.data;
        while(parts.length > 0){
            current = current[parts.pop()];
        }
        return current;
    }
    
});//*/
Protolus.TagTemplate = new Class({
    Extends : Protolus.Template,
    parsedTemplate : null,
    tagRegistry : null,
    tagStack : [],
    root : null,
    progenitor : false,
    postProcessReturnCount : 0,
    initialize: function(text, options){
        this.parser = new Protolus.TagParser(options);
        this.parser.strict = false;
        this.tagRegistry = new Protolus.Registry();
        this.parent(options);
        //this.root = new Protolus.Template.RootNode();
        //this.tagStack.push(this.root);
        this.parsedTemplate = this.parser.parse(text);
    },
    setData : function(data){
    
    },
    getRoot : function(){
        //console.log('getroot', this.name, this.progenitor);
        if(!this.progenitor) return this;
        else return this.progenitor.getRoot();
    },
    renderNode : function(node){
        if(typeOf(node) == 'string'){
            return node;
        }else{
            switch(node.name){
                case 'foreach':
                    return '[FOR]';
                    break;
                case 'if':
                    return '[IF]';
                    break;
                //case '':
                    //break;
                default :
                    if(node.name.substring(0,1) == '$'){
                        return '[VAR]';
                        break;
                    }
            }
        }
    },
    async : function(){
        this.postProcessReturnCount++;
        return '{{{'+this.postProcessReturnCount+'}}}';
    },
    processReturn : function(id, text){
        if(id && text){
            this.rendered = this.rendered.replace(id, text);
        }
        this.postProcessReturnCount--;
        if(this.postProcessReturnCount == 0){
            this.renderCallback(this.rendered);
            delete this.renderCallback;
        }
    },
    render : function(data, callback){
        this.setData(data);
        var result = '';
        this.parsedTemplate.children.each(function(node){
            result += this.renderNode(node);
        }.bind(this));
        if(this.postProcessReturnCount > 0){
            this.renderCallback = callback;
            this.rendered = result;
        }else callback(result);
    }
    
});
Protolus.TemplateResourceTargeting = new Class({
    targets : {'*':{}},
    environment : {},
    fetching : 0,
    delayedForFetch : [],
    loadingComplete : function(callback){
        if(this.fetching) this.delayedForFetch.push(callback);
        else callback();
    },
    containsResource : function(resource, target){
        if(typeOf(resource) == 'string') return Object.keys(this.targets['*']).contains(resource);
        else return Object.values(this.targets['*']).contains(resource);
    },
    requiresResources : function(){
        return Object.keys(this.targets['*']).length > 0;
    },
    addResource : function(resource, target){
        if(!target) target = 'HEAD';
        if(!this.targets[target]) this.targets[target] = [];
        this.targets['*'][resource.name] = resource;
        this.targets[target].push(resource.name);
            
    },
    resourceNames : function(target){
        if(!target) return Object.keys(this.targets['*']);
        else return this.targets[target];
    },
    eachResource : function(target, callback){
        var flattenDependencies = function(resources, result){
            if(!result) result = [];
            resources.each(function(resourceName, key){
                var resource = this.targets['*'][resourceName];
                if(!resource) throw('unknown resource:'+resourceName);
                if(resource.dependency){
                    result = flattenDependencies(resource.dependency, result);
                }
                result.push(resourceName);
            }.bind(this));
            return result;
        }.bind(this);
        var ordering = flattenDependencies(this.targets[target]);
        var ords = [];
        ordering.each(function(name){
            callback(this.targets['*'][name], name);
        }.bind(this));
    },
    currentTargets : function(){
        var targets = [];
        Object.each(this.targets, function(value, key){
            if(key == '*') return;
            if(!targets.contains(key)) targets.push(key)
        });
        return targets;
    },
    ensureResources : function(resources, callback, directory){
        if(!directory) directory = Protolus.resourceDirectory;
        if(!this.resourceRoot) this.resourceRoot = this.getRoot();
        var iterations = 0;
        this.fetching++;
        resources.each(function(resourceName){
            iterations++;
            if(!this.resourceRoot.containsResource(resourceName)){
                var rez = new Protolus.Resource(resourceName, function(){
                    iterations--;
                    if(iterations == 0){
                        this.fetching--;
                        if(this.delayedForFetch.length > 0 && !this.fetching){
                            var cbs = this.delayedForFetch;
                            this.delayedForFetch = [];
                            cbs.each(function(cb){
                                cb();
                            })
                        }
                        callback();
                    }
                }.bind(this), {
                    onDependency : function(dependencies, cb){
                        iterations++;
                        this.ensureResources(dependencies, function(){
                            iterations--;
                            cb();
                        }.bind(this));
                    }.bind(this),
                    mode : 'return',
                    resolveDependencies : true,
                    directory : directory
                });
                this.resourceRoot.addResource(rez);
            }else iterations--;
        }.bind(this));
        if(iterations == 0){
            this.fetching--;
            if(this.delayedForFetch.length > 0 && !this.fetching){
                var cbs = this.delayedForFetch;
                this.delayedForFetch = [];
                cbs.each(function(cb){
                    cb();
                })
            }
            callback();
        }
    }
})

/*
Protolus.Template.Node = new Class({ //basically an XML Node
    name: null,
    attributes : {},
    content: '',
    children: [],
    initialize: function(name, attributes){
        this.name = name;
        if(attributes) Object.each(attributes, function(attribute, key){
            attributes[key] = attribute;
        }.bind(this));
    },
    setContent: function(text){
        this.content = text;
    },
    addChild: function(node){
        this.children.push(node);
    },
    getChild: function(id){
        if(typeOf(id) == 'integer') return this.children[id];
        else{
            var result = false;
            this.children.each(function(child){
                if(child.name == id) result = child;
            }.bind(this));
            return result;
        }
    },
    render: function(){
        throw('Render not implemented!');
    }
});
Protolus.Template.TextNode = new Class({
    Extends: Protolus.Template.Node,
    children : [],
    render: function(){
        return this.content;
    }
});
Protolus.Template.RootNode = new Class({
    Extends: Protolus.Template.Node,
    renderFunction : null,
    initialize : function(){
    },
    render: function(){
        var result = '';
        this.children.each(function(child){
            result += child.render();
        });
        return result;
    }
});
Protolus.Template.GenericNode = new Class({
    Extends: Protolus.Template.Node,
    renderFunction : null,
    initialize : function(name, attributes, renderFunction){
        this.parent(name, attributes);
        if(!renderFunction) this.renderFunction = function(){
            return '[o]';
        };
        this.renderFunction = renderFunction;
    },
    render: function(){
        return this.renderFunction(this);
    }
});
Protolus.Template.registry = new Protolus.Registry();
Protolus.Template.scan = function(type, classObject){
    var templates = document.getElements('head style[@type="protolus/'+type+'"]');
    templates.each(function(item, index){
        console.log('Registered '+item.getAttribute('name')+'.');
        Protolus.Template.registry.register(item.getAttribute('name'), new classObject(item.innerHTML));
    });
};
Protolus.Template.render = function(name, data, callback){
    var template = Protolus.Template.registry.get(name);
    if(!template) throw('No template '+name);
    template.render(data, callback);
};