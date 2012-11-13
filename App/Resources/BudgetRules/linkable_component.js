/*****************************************************************************************
 * RulesGUI.LinkableComponent
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An atomic component that may be chained such as a reference or a function call
 * 
 * @see RulesGUI.Component
 * 
 **/
RulesGUI.LinkableComponent = new Class({
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.parent(options);
        this.linked = true;
        Object.defineProperty(this, 'linkable', {
            get : function(){
                return this.linked;
            }.bind(this),
            set : function(val){
                this.linked = val;
                if(val){
                    if(this.linkage) this.linkage.show();
                }else{
                    if(this.linkage) this.linkage.hide();
                }
            }.bind(this),
            enumerable : true,
            configurable : true
        });
    },
    makeWidget : function(){
        var widget = this.parent();
        /*widget.addClass('linkable');
        this.linkage = new Element('div', {
            'class' : 'rules link'
        });
        this.linkage.inject(widget);
        if(!this.linked) this.linkage.hide();*/
        return widget;
    },
});