/*****************************************************************************************
 * RulesGUI.Component.Expression
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An arbitrary evaluable chunk of code (a partial statement)
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Expression = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'expression';
        this.parent(options);
    }
});