/*****************************************************************************************
 * RulesGUI.Component.Method
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * This is the same as function, and should be deprecated
 * 
 * @see RulesGUI.Component
 **/RulesGUI.Component.Method = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'method';
        this.parent(options);
    }
});

