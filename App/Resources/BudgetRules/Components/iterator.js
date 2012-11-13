/*****************************************************************************************
 * RulesGUI.Component.Iterator
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An iterator (currently unused)
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Iterator = new Class({
    Extends : RulesGUI.LinkableComponent,
    filters : [],
    initialize : function(options){
        this.type = 'iterator';
        this.parent(options);
    },
});
