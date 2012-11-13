/*****************************************************************************************
 * RulesGUI.Component.Call
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A function call on the preceeding value
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Call = new Class({ //()
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'call';
        this.parent(options);
    },
    makeWidget : function(){
        var widget = this.parent();
        widget.adopt(this.options.method.widget());
        if(this.options.subject) widget.adopt(this.options.subject.widget());
        else{
            var argsElement = new Element('div', {
                styles : {
                    //'border' : '2px solid blue'
                },
                class : 'rules linkable arguments'
            });
            this.options.args.each(function(argument){
                argsElement.adopt(argument.widget());
            });
            widget.adopt(argsElement);
        }
        return widget;
    }
});


