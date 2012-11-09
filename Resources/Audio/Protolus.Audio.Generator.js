/*
---
description: An abstract generator interface

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Audio.Generator]
...
*/

Protolus.Audio.Generator = new Class({
    Extends : Protolus.Audio.Source,
    settings : {
        frequency : 1,
        rangeTop : 255,
        rangeBottom : 0,
    },
    initialize : function(options){
        this.settings.rangeSize = this.settings.rangeTop - this.settings.rangeBottom;
        this.settings.rangeOffset = Math.cieling(this.settings.rangeSize / 2);
        this.settings.rangeOffsetDown = Math.floor(this.settings.rangeSize / 2);
        this.parent(options);
    },
    value : function(time){
        var value = this.settings.rangeOffset + Math.round(
            this.settings.rangeOffsetDown * 
            this.rawValue(
                this.settings.frequency * (2 * Math.PI * t )
            )
        );
        this.filters.each(function(filter){
            value = filter.filter(value, time);
        });
    },
    rawValue : function(time){
        throw('rawValue function not implemented!');
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