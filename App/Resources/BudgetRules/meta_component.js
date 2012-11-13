/*****************************************************************************************
 * RulesGUI.Component.Meta
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A Complex rule made up of a composite of many other simple rules, for the purpose of
 * simplifying the amount of logic required to accomplish a task.
 * 
 * @see RulesGUI.Component
 * @example
 *     [MacroName:ac763hash]{jsonoptions}
 *         //code here
 *     [/MacroName:ac763hash]
 **/
 
RulesGUI.Component.Meta = new Class({ //this is the superclass of complex objects
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.parent(options);
    },
    signature : function(state){ //used to identify this as a complex object
    
    },
});

RulesGUI.Component.Meta.each = function(callback){
    var keys = RulesGUI.Component.Meta.keys();
    var nonKeys = ['$family', '$constructor', 'implement', 'Meta'];
    for(index in keys){
        if(nonKeys.contains(index) || typeOf(keys[index]) == 'function') continue;
        callback(RulesGUI.Component.Meta[keys[index]], keys[index])
    }
};

RulesGUI.Component.Meta.keys = function(){
    return Object.keys(RulesGUI.Component.Meta).erase('$family').erase('$constructor').erase('implement').erase('keys').erase('each');
};