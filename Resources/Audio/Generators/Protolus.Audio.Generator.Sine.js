/*
---
description: A Sine wave generator

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.Smarty]
...
*/

Protolus.Audio.Generator.Sine = new Class({
    Extends : Protolus.Audio.Generator,
    initialize : function(options){
        this.parent(options);
    },
    rawValue : function(time){
        Math.sin(time)
    }
});