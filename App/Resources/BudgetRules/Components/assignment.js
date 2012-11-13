/*****************************************************************************************
 * RulesGUI.Component.Assignment
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * Serves as a basis for all value assignments
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Assignment = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'assignment';
        this.parent(options);
    },
    makeWidget : function(){
        var widget = this.parent();
        var subject = new Element('span', {
            class : 'rules linkable subject'
        });
        if(this.options.subject) subject.adopt(this.options.subject.widget());
        else subject.set('html', '?');
        widget.adopt(subject);
        var predicate = new Element('span', {
            class : 'rules linkable predicate'
        });
        if(this.options.predicate) predicate.adopt(this.options.predicate.widget());
        else predicate.set('html', '?');
        widget.adopt(predicate);
        return widget;
    },
    inspector : function(){
        var inspector = this.parent();
        inspector.adopt(new Element('div', {
            'html' : 'dslaknfsljkdsnkfjdbdskjbfkdb'
        }));
        return inspector;
    }
});