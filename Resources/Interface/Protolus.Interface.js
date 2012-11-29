/*
---
description: Protolus UI Utilities

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Interface.ModalStage]
...
*/
if(!Protolus) var Protolus = {};
Protolus.Interface = new Class({
    Implements : [Events, Options],
});

Protolus.Interface.ModalStage = new Class({
    Implements : [Events, Options],
    actors  : [],
    current : false,
    initialize : function(container, options){
        if(typeOf(container) == 'string') container = document.id(container);
        this.container = container;
        this.setOptions(options);
    },
    addActor : function(options, callback){
        if(!options.label) options.label = 'Tab '+(this.actors.length);
        if(!options.name) options.name = options.label.toLowerCase().replace(' ', '_');
        if(!options.cue){
            options.cue = new Element('div', {
                class : ['cue'], //cue
                id : options.name+'_stage_cue',
                html : options.label
            });
            if(!this.lastCue) options.cue.inject(this.container, 'top');
            else options.cue.inject(this.lastCue.cue, 'after');
            this.lastCue = options;
            options.cue.addEvent('click', function(event){
                this.toActor(options.cue);
            }.bind(this));
        }
        if(!options.element){
            options.element = new Element('div', {
                class : ['actor'], //actor
                id : options.name+'_stage_actor'
            });
            options.element.inject(this.container);
        }
        this.actors.push(options);
        if(!this.current) this.current = options;
        return options.element;
    },
    removeActor : function(identifier, callback){ //id or label
        
    },
    nextActor : function(element, callback){
        this.shiftActor(1, callback);
    },
    previousActor : function(element, callback){
        this.shiftActor(-1, callback);
    },
    actorForCue : function(cue){
        var result = false;
        this.actors.each(function(actor, index){
            if(actor.cue == cue && !result) result = index;
        });
        return result;
    },
    toActor : function(identifier, callback){ //id or label
        if(typeOf(identifier) == 'element') identifier = this.actorForCue(identifier);
        //console.log('id', identifier, typeOf(identifier), this.actors);
        if(typeOf(identifier) == 'number'){
            var next = this.actors[identifier];
            if(next){
                this.focusOnActor(next, this.current, function(){
                    if(callback) callback(next);
                });
            }else if(callback) callback(false);
            return;
        }
    },
    focusOnActor : function(incoming, outgoing, callback){
        if(incoming == outgoing && this.options.deactivateFocusedCue){
            //nothing to do, we tried to focus on the currently focused actor
            callback();
            return;
        }
        if(this.options.focus){ //focus(incoming, outgoing, callback)
            //presence determines the fire, not completion
            this.fireEvent('enter-stage', incoming);
            this.options.focus(incoming, outgoing, function(){
                this.current = incoming;
                this.fireEvent('exit-stage', outgoing);
                console.log('new', incoming, outgoing, this.current);
                if(callback) callback(incoming);
            }.bind(this));
        }else{
            this.fireEvent('enter-stage', incoming);
            this.current = incoming;
            this.fireEvent('exit-stage', outgoing);
            if(callback) callback(incoming);
        }
    },
    shiftActor : function(adjustment, callback){ //id or label
        var currentPosition = array.indexOf(this.actors, element);
        var next = this.actors[currentPosition+adjustment];
        if(next){
            this.focusOnActor(next, this.current, callback);
        }else callback(false);
    },
    firstActor : function(element, callback){
        this.toActor(0, callback);
    },
    lastActor : function(element, callback){
        this.toActor(this.actors.length-1, callback);
    }
});