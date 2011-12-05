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
Protolus.Template = new Class({
    Extends : Midas.TagParser,
    initialize: function(options, registry){
        this.parent(options);
        if(!registry) registry = Midas.Template.defaultRegistry;
        registry.register(options.name, this);
        
    },
    render : function(data, callback){
        throw('Render not implemented!');
    }
});
Protolus.Template.defaultRegistry = new Protolus.Registry();