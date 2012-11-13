/*****************************************************************************************
 * RulesGUI.Toolbar
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A Toolbar which contains the basic building blocks of a rule, and interacts with the
 * GUI editor through drag and drop interface in combination with the inspector. All the
 * atoms are auto registered off of the RulesGUI.Component.
 *
 * @see RulesGUI.Inspector
 * @see RulesGUI.Component
 **/
RulesInputPanel.toolbar = false; //??
RulesGUI.Toolbar = new Class({
    Implements : [Events, Options],
    rules : [],
    dragListeners : [],
    initialize : function(element, options){
        this.setOptions(options);
        if( (!this.options.atomic) && (!this.options.meta) ) this.options.atomic = true;
        var created = [];
        if(this.options.atomic) RulesGUI.Component.each(function(classObject, name){
            //console.log('simple', name);
            var container = new Element('div', {
                styles : {
                    display : 'inline-block',
                    html : name
                }
            });
            var button = new Element('div', {
                styles : {
                    padding : 10,
                    border : '1px solid black',
                    display : 'block',
                    position : 'relative',
                    'background-color' : '#FFCCCC',
                    'left' : 0,
                    'top' :0,
                    overflow : 'hidden',
                    'background-image' : '/Images/Tools/'+name+'.jpeg'
                },
                html : name,
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
                    if(!droppable) return; //not dropped on a legal target
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
        //throw('akjdn');
    },
    attach : function(rule){
        this.dragListeners.each(function(listener){
            //todo: make sure it's not already attached
            rule.registerDragListener(listener);
        })
    }
});
