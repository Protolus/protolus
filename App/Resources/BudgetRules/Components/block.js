/*****************************************************************************************
 * RulesGUI.Component.Block
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A container for blocks of statements
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Block = new Class({
    Extends : RulesGUI.ContainerComponent,
    initialize : function(options){
        this.type = 'block';
        this.parent(options);
    }
});


