/*
---
description: A simple registry wrapper for binding objects to an id, textually

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Registry]
...
*/
Protolus.Registry = new Class({
    registry : {},
    initialize : function(name){
    
    },
    register : function(key, value){
        this.registry[key] = value;
    },
    get : function(key){
        return this.registry[key];
    }
});