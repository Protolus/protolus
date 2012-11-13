/*****************************************************************************************
 * RulesInputPanel
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * This class encapsulates a rule and can generate an interface given a well formed block
 * of code. It also serves as the interface for event registration through a recursive
 * targeting function.
 * 
 **/
 
// todo: 
// code generate
// code load
// example container
// example primitive
// macros
// example macro
// implement drag on modules as events on the class
// handle comments

var RulesInputPanel = new Class({
    element : null,
    communicator : null,
    editors : [],
    inputs : [],
    rules : [],
    initialize : function(element, options){
        this.element = document.id(element);
        if(!options) options = {};
        var elID = options.toolbarElement?options.toolbarElement:'gui';
        if(options.toolbar) this.toolbar = options.toolbar;
        else this.toolbar = new RulesGUI.Toolbar(document.id(elID));
        if(options.inspector) this.inspector = options.inspector;
        else this.inspector = new RulesGUI.Inspector(document.id(elID));
        if(options.rules) options.rules.each(function(rule){
            var editor = this.new(rule);
            
            //this.rules.push(new RulesGUI.Rule(rule));
        }.bind(this));
        else this.rules = [ new RulesGUI.Rule(this.element) ];
    },
    harvest : function(){
        //parse locally?
        //var text = this.editor.getValue();
        var results = [];
        this.editors.each(function(editor){
            results.push(editor.area.get('value'));
        });
        //console.log('rules', results);
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
    'new' : function(ruleText){
        var result = new RulesGUI.Editor(this.element, {
            toolbar : this.toolbar,
            inspector : this.inspector,
            code : ruleText
        });
        this.editors.push(result);
        this.rules.push(result.rule);
        return result;
    }
});
RulesInputPanel.toolbar = false;

var RulesGUI = {};


