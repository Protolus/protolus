/*****************************************************************************************
 * RulesGUI.Inspector
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * An inspector to view and edit the options of the currently selected node
 * 
 * @see RulesGUI.Toolbar
 * 
 **/
RulesGUI.Inspector = new Class({
    Implements : [Events, Options],
    initialize : function(element, options){
        this.element = element;
        this.inspector = new Element('div', {
            html: "<b>Inspector</b>",
            class : "inspector"
        });
        this.setOptions(options);
        this.inspector.inject(element);
    },
    display : function(displayable, callback){
        //todo, transition + callback
        if(typeOf(displayable) === 'string'){
            this.inspector.set('html', displayable);
        }else{
            this.inspector.empty();
            this.inspector.adopt(displayable);
        }
        if(callback) callback();
    }
});
