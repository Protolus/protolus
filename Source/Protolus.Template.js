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
    Extends : Protolus.TagParser,
    parsedTemplate : null,
    tagRegistry : null,
    tagStack : [],
    root : null,
    initialize: function(text, options){
        this.tagRegistry = new Protolus.Registry();
        this.parent(options);
        this.root = new Protolus.Template.RootNode();
        this.tagStack.push(this.root);
        this.parsedTemplate = this.parse(text);
        console.log(['template', this.parsedTemplate]);
    },
    open: function(tag){
        console.log('open:'+tag.name);
        if(!this.tagRegistry[tag.name]) throw('Unkown tag('+tag.name+')');
        this.tagStack.push(new new Protolus.Template.GenericNode(this.tagRegistry[tag.name](tag.name, tag.attributes)));
    },
    content: function(text){
        this.tagStack[this.tagStack.length-1].addChild(new Protolus.Template.TextNode(text));
    },
    close: function(tag){
        this.tagStack.pop();
    },
    render : function(data, callback){
        return this.root.render();
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