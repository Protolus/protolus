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
    initialize : function(options){
        if(!this.settings.sampleRate) this.settings.sampleRate = '44100'; //(44.1 KHz)
    },
    value : function(time){
        throw('value function not implemented!');
    }
});