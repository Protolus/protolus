/*****************************************************************************************
 * RulesGUI.Component
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * The base class for all atomic components within the system. Capable of building their
 * own widgets and inspector panes, the component serves to create a tree based linkage
 * from the parse tree in order to provide a working runtime model for modification.
 * 
 * @todo implement events as dropOn and dropBetween
 **/
RulesGUI.Component = new Class({
    Implements : [Events, Options],
    type : 'null',
    component : false,
    options : {
        parsedNode : false
    },
    targets : [],
    initialize : function(options){
        //this.incoming = Object.clone(options);
        this.setOptions(options);
        
    },
    legalFollower : function(component){
    
    },
    legalFollowerType : function(type){
    
    },
    makeWidget : function(){
        var widget = new Element('div', {
            styles : {
                'vertical-align' : 'middle'
            },
            'class' : 'rules node '+this.type
        });
        //if this component is part of a rule, let's make sure it can be inspected
        if(this.options.rule) widget.addEvent('click', function(event){
            var inspector = this.options.rule.options.editor.options.inspector;
            if(inspector){
                inspector.display(this.inspector());
            }
            event.stop();
        }.bind(this));
        return widget;
    },
    makeInspector : function(){
        var widget = new Element('div', {
            styles : {
                'vertical-align' : 'middle'
            },
            'class' : 'rules node '+this.type
        });
        widget.set('html', this.type);
        return widget;
    },
    className : function(){
        var result = false;
        RulesGUI.Component.each(function(component, name){
            if(instanceOf(this, component)) result = name;
        }.bind(this));
        return result;
    },
    widget : function(){ //the thing that sits in the rule editor
        if(!this.component){
            this.component = this.makeWidget();
        }
        return this.component;
    },
    inspector : function(){ //the thing that configures options
        //todo: cache
        var inputs = [];
        var input;
        //todo : if parsedNode dump info
        input = new Element('div');
        inputs.push(input);
        var json = this.options.parseNode;
        input.adopt(new Element('b', {
            html : this.type,
            style : "display:block;"
        }));
        var info = new Element('span');
        if(json) info.set('html', json);
        input.adopt(info);
        var el = new Element('form', {
            
        });
        $$(inputs).inject(el);
        return el;
    },
    code : function(){
    
    }
});

RulesGUI.Component.each = function(callback){
    var keys = RulesGUI.Component.keys();
    var nonKeys = ['$family', '$constructor', 'implement', 'Meta'];
    for(index in keys){
        if(nonKeys.contains(index) || typeOf(keys[index]) == 'function') continue;
        callback(RulesGUI.Component[keys[index]], keys[index])
    }
};

RulesGUI.Component.keys = function(){
    return Object.keys(RulesGUI.Component).erase('$family').erase('$constructor').erase('implement').erase('keys').erase('Meta').erase('each');
};

