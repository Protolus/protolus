/*
---
description: An audio filter

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Audio.Filter]
...
*/

Protolus.Audio.Filter = new Class({
    initialize : function(options){
        
    },
    filter : function(value, time){
        throw('filter function not implemented!');
    }
});