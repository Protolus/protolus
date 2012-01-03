/*
---
description: Mixdown object for multiple audio streams

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Audio.Mixer]
...
*/

Protolus.Audio.Mixer = new Class({
    Extends : Protolus.Audio.Source, //yes, a mixer can mix down other mixers
    sources : [],
    compositeMode : 'maximum',
    attach : function(source){
        sources.push(source);
    },
    value : function(time){
        var values = [];
        this.sources.each(function(source){
            var value = source.value();
            this.filters.each(function(filter){
                value = filter.filter(value, time);
            });
            values.push(value);
        });
        return this.composite(values);
    },
});