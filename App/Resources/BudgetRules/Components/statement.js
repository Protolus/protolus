/*****************************************************************************************
 * RulesGUI.Component.Statement
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * A statement... crockford's weird parse trees and me conflating ternaries and branching
 * here have made this class almost meaningless. Perhaps we could fix this if we use a
 * different parser.
 * 
 * @see RulesGUI.Component
 **/
RulesGUI.Component.Statement = new Class({
    Extends : RulesGUI.Component,
    initialize : function(options){
        this.type = 'statement';
        this.parent(options);
    },
    makeWidget : function(){
        var widget = this.parent();
        if(this.options.declarations) this.options.declarations.each(function(declaration){
            widget.adopt(declaration.widget());
        });
        if(this.options.ternary){
            var conditionContainer = new Element('div', {
                class:'rules linkable'
            });
            widget.adopt(this.options.condition.widget());
            var trueContainer = new Element('div', {
                class:'rules linkable'
            });
            if(typeOf(this.options.body) == 'array') this.options.body.each(function(statement){
                trueContainer.adopt(statement.widget());
            });
            else trueContainer.adopt(this.options.body.widget());
            widget.adopt(trueContainer);
            var falseContainer = new Element('div', {
                class:'rules linkable'
            });
            if(typeOf(this.options.else) == 'array')  this.options.else.each(function(statement){
                falseContainer.adopt(statement.widget());
            });
            else falseContainer.adopt(this.options.body.widget()); 
            widget.adopt(falseContainer);
        }
        if(this.options.branch == 'if' && this.options.condition){
            var container = new Element('div');
            container.adopt(this.options.condition.widget());
            this.options.body.each(function(statement){
                container.adopt(statement.widget());
            });
            widget.adopt(container);
            widget.adopt(new Element('div', {
                html : 'ELSE'
            }));
            if(this.options.else){
                var containerElse = new Element('div', {
                    class:'rules'
                });
                this.options.else.each(function(statement){
                    containerElse.adopt(statement.widget());
                });
                widget.adopt(containerElse);
            }
        }
        widget.adopt(new Element('div', {
            class : 'rules separator'
        }));
        return widget;
    }
});