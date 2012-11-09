/*
---
description: A complex generator container for multiple generators with effects

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Audio.Instrument]
...
*/

Protolus.Audio.Instrument = new Class({
    Extends : Protolus.Audio.Generator,
    generators : [],
    addGenerators : function(generator){
        this.generators.push(generator);
    },
    rawValue : function(time){
        var values = [];
        this.generators.each(function(generator){
            values.push(generator.rawValue());
        });
        return this.composite(values);
    },
});