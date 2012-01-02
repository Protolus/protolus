/*
---
description: Audio source

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Audio.Source]
...
*/

Protolus.Audio.Source = new Class({
    settings : {},
    filters : [],
    initialize : function(options){
        if(!this.settings.sampleRate) this.settings.sampleRate = '44100'; //(44.1 KHz)
    },
    addFilter : function(filter){
        this.filters.push(filters);
    },
    value : function(time){
        throw('value function not implemented!');
    }
});