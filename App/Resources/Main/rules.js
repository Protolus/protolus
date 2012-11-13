// major things: 
// code generate
// code load
// example container
// example primitive
// macros
// example macro
// implement drag on modules as events on the class


var RulesInputPanel = new Class({
    element : null,
    communicator : null,
    editors : [],
    inputs : [],
    rules : [],
    initialize : function(element, options){
        this.element = document.id(element);
        if(!options) options = {};
        if(!options.toolbar) this.toolbar = new RulesGUI.Toolbar(document.id('gui'));
        else this.toolbar = document.id(options.toolbar);
        if(options.rules) this.rules = options.rules;
        else this.rules = [ new RulesGUI.Rule(this.element) ];
        this.rules.each(function(rule){
            this.editors.push(new RulesGUI.Editor(this.element, {
                toolbar : this.toolbar
            }));
        }.bind(this));
    },
    harvest : function(){
        //parse locally?
        var text = this.editor.getValue();
        var results = [];
        this.editors.each(function(editor){
            results.push(editor.getValue());
        });
        console.log('rules', results);
        /*var results = [];
        var statements = Lyza.breakCodeIntoStatements(text);
        statements.each(function(statement){
            results.push({
                code : Lyza.removeCommentsFromCode(statement).trim(),
                meaning : Lyza.harvestCommentsFromCode(statement).join("\n")
            });
        });
        console.log(results);*/
        return results;
    },
    getToolbar : function(){
        return this.toolbar;
    },
    populate : function(data){
        if(data && data.each) data.each(function(rule, index){
            if(!this.editors[index]) this.new(rule);
            else this.editors[index].setValue(rule);
        }.bind(this));
    },
    push : function(callback){
        if(this.communicator) this.communicator({
            rules : this.harvest(),
            city : 'paloalto'
        }, function(data){
            if(callback) callback(data);
        })
    },
    makeAdvancedEditor : function(container, text){
        var area = new Element('textarea', {
            'class':'rule'
        });
        if(ruleText) area.set('html', text);
        area.inject(container);
        return area;
    },
    makeBasicEditor : function(container, text){
        return new RulesGUI.Editor(container, {
            statement : text
        })
    },
    'new' : function(ruleText){
        console.log('new called');
        var area = new Element('textarea', {
            'class':'rule'
        });
        var container = new Element('div', {
            'class':'rule_container'
        });
        var button = new Element('input', {
            type : 'button',
            'class' : 'rule_mode_button',
            'value' : 'basic'
        });
        button.addEvent('click', function(event){
            if(button.get('value') == 'basic') button.set('value','advanced');
            else button.set('value','basic');
        });
        button.inject(container);
        container.inject(this.element);
        var el = this.makeAdvancedEditor(container, ruleText);
        this.editors.push(el);
        this.inputs.push(area);
    }
});
RulesInputPanel.toolbar = false;

var RulesGUI = {};

RulesGUI.Editor = new Class({
    rules : [],
    modal : true, //only 1 set of inspectors
    initialize : function(element, options){
        //var tb = new RulesGUI.Toolbar(document.id('gui'));
        /*var rule = new RulesGUI.Rule(document.id('well'));
        tb.attach(rule);
        rule.parse = make_parse();
        rule.parse.error = console.log;
        rule.load("var budget = []; \
        var o = 4 + (3 * 6) >= 0;\
        budget.o.forEach(function(item){\
            item.rule_based = false;\
            item.jobs = '';\
        });\
        var blah = function(){\
            var b = [];\
        };");*/
        
    },
    build : function(component, element){
    
    },
});

RulesGUI.Rule = new Class({
    Implements : [Events, Options],
    components : [],
    dragListeners : [],
    container : false,
    initialize : function(element, options){
        this.container = element;
        this.setOptions(options);
        if(!make_parse) throw('rule parser requires Douglas Crockford\'s Parser for Simplified JavaScript');
        this.parse = make_parse();
    },
    nextComponentCouldBeType : function(type){
        if(!this.components[this.components.length-1]) return true; // todo: check for legal starts
        return this.components[this.components.length-1].legalFollowerType(type);
    },
    nextComponentCouldBe : function(component){
        return this.canInsertAt(component);
    },
    canInsertAt : function(component, position){
        if(!position) position = this.components.length; //append
        var predecessor = this.components[position-1];
        var successor = this.components[position+1];
        var result = true;
        if(predecessor) result && predecessor.legalFollower(component);
        if(successor) result && component.legalFollower(successor);
        return result;
    },
    insertAt : function(component, position){
        if(!this.canInsertAt(component, position)) throw('cannot insert component at position '+position);
        this.components = this.components.splice(0, position, component);
    },
    code : function(){
        var result = '';
        components.each(function(component){
            result += component.code();
        });
    },
    ui : function(){
        
    },
    targets : function(){ //return all drop targets on this rule
        this.container.rule = this;
        var targets = [this.container];
        this.components.each(function(component){
            var componentTargets = component.targets();
            componentTargets.each(function(target){
                target.rule = this;
                targets.push(target);
            }.bind(this));
        }.bind(this));
        return targets;
    },
    registerDragListener : function(listener){
        this.targets().each(function(target){
            listener.droppables.push(target); 
            this.dragListeners.push(listener);
        }.bind(this));
    },
    removeDragListener : function(listener){
        //todo
    },
    loadNode : function(node){ //recursive load of a node from crockford's parse tree
        var node;
        var mode = (node.arity == 'literal' || node.arity == 'function')?node.arity:node.value;
        switch(mode){
            case '*' : 
            case '/' : 
            case '+' : 
            case '-' : 
            case '%' : 
            case '^' : 
            case '&&' : 
            case '||' :
            case '==' :
            case '>' :
            case '>=' :
            case '<' :
            case '<=' ://operation
                var options = {};
                options.method = this.loadNode(node.first);
                options.args = this.loadNode(node.first);
                node = new RulesGUI.Component.Expression(options);
                break;
            case '(' : //function call
                var options = {};
                var args;
                var object;
                switch(node.arity){
                    case 'binary':
                        options.method = node.first;
                        options.args = node.second;
                        break;
                    case 'ternary':
                        options.object = this.loadNode(node.first);
                        options.method = node.second;
                        options.args = []; 
                        node.third.each(function(child){
                            options.args.push(this.loadNode(child));
                        });
                        break;
                    default : throw('unsupported function call configuration: '+node.arity);
                }
                node = new RulesGUI.Component.Call(options);
                break;
            case '=' : // assignment
                var options = {};
                options.subject = this.loadNode(node.first);
                options.predicate = this.loadNode(node.second);
                node = new RulesGUI.Component.Assignment(options);
                break;
            case 'literal' : // literal
                node = new RulesGUI.Component.Reference(options);
                break;
            case 'function' : // fn
                break;
            default : throw('unknown mode:'+mode);
        }
        return node;
    },
    load : function(code){
        var parseTree = this.parse(code);
        console.log('parseTree', parseTree);
    }
});

RulesGUI.Toolbar = new Class({
    Implements : [Events, Options],
    rules : [],
    dragListeners : [],
    initialize : function(element, options){
        this.setOptions(options);
        if( (!this.options.atomic) && (!this.options.meta) ) this.options.atomic = true;
        var created = [];
        if(this.options.atomic) RulesGUI.Component.each(function(classObject, name){
            console.log('simple', name);
            var container = new Element('div', {
                styles : {
                    width : 40,
                    height : 40,
                    display : 'inline-block'
                }
            });
            var button = new Element('div', {
                styles : {
                    width : 40,
                    height : 40,
                    border : '1px solid black',
                    display : 'block',
                    position : 'relative',
                    'background-color' : '#FFCCCC',
                    'left' : 0,
                    'top' :0,
                    'background-image' : '/Images/Tools/'+name+'.jpeg'
                }
            });
            button.object = classObject;
            button.type = name;
            created.push(button);
            button.inject(container);
            container.inject(element);
        });
        if(this.options.meta) RulesGUI.Component.Meta.each(function(classObject, name){
            console.log('meta', name);
        });
        created.each(function(tool){
            var inside = false;
            var myDrag = new Drag.Move(tool, {
                snap: 0,
                droppables : [],
                onDrop: function(el, droppable){
                    console.log('sds', el, droppable);
                    if(droppable.component && instanceOf(droppable.component, RulesGUI.ContainerComponent)){
                        var newObject = new tool.object();
                        droppable.component.add(newObject);
                    }else{
                        if(droppable.rule.nextComponentCouldBeType(tool.type)){
                            var newObject = new tool.object();
                            newObject.addEvent('new-target', function(target){
                                this.dragListeners.each(function(listener){
                                    listener.droppables.push(target);
                                });
                            }.bind(this));
                            var el = newObject.widget();
                            el.inject(droppable); //todo: this should come from within the rule
                            //console.log('newww', newObject);
                        }else{
                            console.log('cannot create '+tool.type);
                        }
                    }
                    //widget.inject(tools);
                }.bind(this),
                onComplete: function(el){
                    el.morph({
                        'left' : 0,
                        'top' :0
                    });
                }.bind(this)
            });
            this.dragListeners.push(myDrag)
        }.bind(this));
    },
    attach : function(rule){
        this.dragListeners.each(function(listener){
            //todo: make sure it's not already attached
            rule.registerDragListener(listener);
        })
    }
});

//todo: implement events as dropOn and dropBetween
RulesGUI.Component = new Class({
    Implements : [Events, Options],
    type : 'null',
    component : false,
    targets : [],
    initialize : function(options){
        this.setOptions(options);
    },
    legalFollower : function(component){
    
    },
    legalFollowerType : function(type){
    
    },
    makeWidget : function(){
        var widget = new Element('div', {
            styles : {
                display : 'inline-block',
                'vertical-align' : 'middle'
            },
            'class' : 'rules node'
        });
        return widget;
    },
    widget : function(){ //the thing that sits in the rule editor
        if(!this.component){
            this.component = this.makeWidget()
        }
        return this.component;
    },
    inspector : function(){ //the thing that configures options
        
    },
    code : function(){
    
    }
});

RulesGUI.LinkableComponent = new Class({
    Extends : RulesGUI.Component,
    makeWidget : function(){
        var widget = this.parent();
        widget.addClass('linkable');
        var linkage = new Element('div', {
            'class' : 'rules link'
        });
        linkage.inject(widget);
        return widget;
    },
});

RulesGUI.ContainerComponent = new Class({
    Extends : RulesGUI.Component,
    components : [],
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

RulesGUI.Component.Meta = new Class({ //this is the superclass of complex objects
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.parent(options);
    },
    signature : function(state){ //used to identify this as a complex object
    
    },
});

RulesGUI.Component.Reference = new Class({ //can hold a literal, variable, or a constant value
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'reference';
        this.parent(options);
    }
});

RulesGUI.Component.Assignment = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'assignment';
        this.parent(options);
    }
});

RulesGUI.Component.Expression = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'expression';
        this.parent(options);
    }
});

RulesGUI.Component.Call = new Class({ //()
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'call';
        this.parent(options);
    }
});

/*RulesGUI.Component.SubExpression = new Class({ //()
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.parent(options);
    }
});*/

RulesGUI.Component.Method = new Class({
    Extends : RulesGUI.LinkableComponent,
    initialize : function(options){
        this.type = 'method';
        this.parent(options);
    }
});

RulesGUI.Component.Block = new Class({
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.type = 'block';
        this.parent(options);
    }
});

RulesGUI.Component.Iterator = new Class({
    Extends : RulesGUI.ContainerComponent,
    filters : [],
    initialize : function(options){
        this.type = 'iterator';
        this.parent(options);
    },
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

RulesGUI.Component.Meta.each = function(callback){
    var keys = RulesGUI.Component.Meta.keys();
    var nonKeys = ['$family', '$constructor', 'implement', 'Meta'];
    for(index in keys){
        if(nonKeys.contains(index) || typeOf(keys[index]) == 'function') continue;
        callback(RulesGUI.Component.Meta[keys[index]], keys[index])
    }
};

RulesGUI.Component.Meta.keys = function(){
    return Object.keys(RulesGUI.Component.Meta).erase('$family').erase('$constructor').erase('implement').erase('keys').erase('each');
};


