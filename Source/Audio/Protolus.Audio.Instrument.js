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
    filters : [],
    addFilter : function(filter){
        this.filters.push(filters);
    },
});