/*****************************************************************************************
 * RulesGUI.Component.Reference
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A reference to a value. It may hold a literal, variable or constant value
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Reference = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'reference';
        this.parent(options);
        this.linkable = true;
    },
    makeWidget : function(){
        var widget = this.parent();
        if(this.options.name) widget.adopt(new Element('div', {
            html : this.options.name
        }));
        if(this.options.object && this.options.accessor){
            var subject = this.options.object.widget();
            var accessor = this.options.accessor.widget();
            subject.inject(widget);
            subject.addClass('access');
            accessor.inject(widget);
        }
        if(this.options.value || this.options.value === 0){
            var val = this.options.number?this.options.value:'"'+this.options.value+'"';
            widget.adopt(new Element('div', {
                html : val,
                class: 'rules node linkable'
            }));
        }
        return widget;
    }
});