/*****************************************************************************************
 * RulesGUI.Component.Function
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A function declaration
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Function = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'function';
        this.parent(options);
    },
    makeWidget : function(){
        var widget = this.parent();
        if(this.options.args){
            var container = new Element('div');
            this.options.args.each(function(argument){
                container.adopt(argument.widget());
            });
            widget.adopt(container);
            var body = new Element('div');
            this.options.statements.each(function(statement){
                body.adopt(statement.widget());
            });
            widget.adopt(body);
        }
        return widget;
    }
});