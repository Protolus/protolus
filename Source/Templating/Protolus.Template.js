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
    //Extends : Protolus.TagParser,
    initialize: function(text, options){
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
    initialize: function(text, options){
        this.parser = new Protolus.TagParser(options);
        this.parser.strict = false;
        this.tagRegistry = new Protolus.Registry();
        this.parent(options);
        this.root = new Protolus.Template.RootNode();
        this.tagStack.push(this.root);
        this.parsedTemplate = this.parser.parse(text);
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
    render : function(data, callback){
        var result = '';
        this.parsedTemplate.children.each(function(node){
            result += this.renderNode(node);
        }.bind(this));
        callback(result);
    }
    
});
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