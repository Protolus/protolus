/*****************************************************************************************
 * RulesGUI.Component.Operation
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An evaluation of an operation (an operator and it's operands)
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Operation = new Class({
    Extends : RulesGUI.LinkableComponent, //maybe this should share a 'value' base with 'expression' 
    initialize : function(options){
        this.type = 'operation';
        this.parent(options);
    },
    makeWidget : function(){
        var widget = this.parent();
        if(this.options.unary && this.options.operator == '!'){
            widget.adopt(new Element('div', {
                html : '!'
            }));
            widget.adopt(this.options.value.widget());
        }
        if(this.options.operator){
            if(this.options.subject) widget.adopt(this.options.subject.widget());
            widget.adopt(new Element('div', {
                html : this.options.operator,
                class : 'rules linkable'
            }));
            if(this.options.predicate) widget.adopt(this.options.predicate.widget());
        }
        return widget;
    }
});