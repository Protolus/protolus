/*
---
description: A simple registry wrapper for binding objects to an id, textually

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Registry]
...
*/
Protolus.Session = new Class({
    sessionData : {},
    sessionID : false,
    saveSession : function(){
        
    },
    loadSession : function(id){
        
    },
    setSession : function(key, value){
        this.sessionData[key] = value;
    },
    getSession : function(key){
        return this.sessionData[key];
    }
});