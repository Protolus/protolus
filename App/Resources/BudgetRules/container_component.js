/*****************************************************************************************
 * RulesGUI.ContainerComponent
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An atomic component that may contain other components internally
 * 
 * @see RulesGUI.Component
 * 
 **/
RulesGUI.ContainerComponent = new Class({
    Extends : RulesGUI.Component,
    components : [],
    initialize : function(options){
        this.parent(options)
    },
    makeWidget : function(){
        var widget = this.parent();
        widget.addClass('linkable');
        this.container = new Element('div', {
            'class' : 'rules container'
        });
        this.targets.push(this.container);
        this.fireEvent('new-target', this.container);
        this.container.inject(widget);
        this.container.component = this;
        return widget;
    },
    add : function(component){
        this.components.push(component);
        var widget = component.widget();
        widget.inject(this.container);
    }
});


