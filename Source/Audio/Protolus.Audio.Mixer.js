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
    filters : [],
    compositeMode : 'maximum',
    attach : function(source){
        sources.push(source);
    },
    addFilter : function(filter){
        this.filters.push(filters);
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
    },
    composite : function(values){
        switch(this.compositeMode){
            case 'maximum':
                var max = false;
                values.each(function(value){
                    if(!max) max = value;
                    else if(max > value) max = value;
                });
                return max;
                break;
            default: throw('unsupported composite mode('+this.compositeMode+')!');
        }
    }
});