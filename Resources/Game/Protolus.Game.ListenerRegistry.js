Protolus.Game.ListenerRegistry = new Class({
    listenerRegistry : {},
    addEvent : function(eventType, listenerFunction){
        if(!this.listenerRegistry[eventType]) this.listenerRegistry[eventType] = [];
        this.listenerRegistry[eventType].push(listenerFunction);
    },
    trigger : function(eventType){
        if(this.listenerRegistry[eventType]){
            this.listenerRegistry[eventType].each(function(listenerCallback){
                listenerCallback();
            }.bind(this));
        }
    }
});