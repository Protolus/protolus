/*****************************************************************************************
 * RulesGUI.Editor
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * Serves as a basis for generating editor views
 * 
 **/
RulesGUI.Editor = new Class({
    Implements : [Options],
    rule : false,
    modal : true, //only 1 view in frame
    initialize : function(element, options){
        this.element = element;
        this.setOptions(options);
        this.basic = this.build('basic');
        this.advanced = this.build('advanced');
        var elID = options.toolbarElement?options.toolbarElement:'gui';
        if(this.options.toolbar) this.toolbar = this.options.toolbar;
        else this.toolbar = new RulesGUI.Toolbar(document.id(elID));
        if(this.options.inspector) this.inspector = this.options.inspector;
        else this.inspector = new RulesGUI.Inspector(document.id(elID));
        if(this.options.rule) this.rule = this.options.rule;
        else this.rule = new RulesGUI.Rule(this.basic, {
            editor : this
        });
        if(this.options.code){
            this.rule.load(this.options.code);
            console.log('sdsdsd', this.options.code);
        }
        this.rule.addEvent('load', function(parsed, code){
            console.log('code', code, parsed);
        });
        if(this.options.toolbar){
            this.options.toolbar.attach(this.rule);
        }
    },
    build : function(type, container){
        if(!container) container = this.element;
        switch(type){
            case 'advanced' :
                var wrap = new Element('div', {
                    'class':'advanced_container'
                });
                var area = new Element('textarea', {
                    'class':'rule',
                    html : this.options.code
                });
                if(this.rule) area.set('html', this.rule.code());
                area.inject(wrap);
                wrap.inject(container);
                this.area = area;
                this.mirror = CodeMirror.fromTextArea(area, {
                    mode:  "javascript"
                });
                return area;
                break;
            case 'basic':
                var wrap = new Element('div', {
                    'class':'basic_container'
                });
                wrap.inject(container);
                return wrap;
                break;
            default : throw('Unrecognized editor type : '+type);
        }
    },
    buildModal : function(){
        //todo: make me
    }
});