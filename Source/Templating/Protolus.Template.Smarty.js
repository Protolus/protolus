/*
---
description: An extensible Smarty Parser in Mootools

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.Smarty]
...
*/
Protolus.Template.Smarty = new Class({
    Extends : Protolus.TagTemplate,
    Implements : [Protolus.TemplateData],
    initialize: function(text){
        this.parent(text, {
            strict : true,
            opener : '{',
            closer : '}',
            attributeAssign : '=',
            attributeDelimiters : ['"', "'"],
            closeEscape : '/',
            allowUndelimitedAttributes : true,
            literalTags : ['literal'],
            specialTags : {
                'if':function(text){
                    
                },
                'foreach':function(text){
                
                }
            }
        });
        this.tagRegistry.register('test', function(node){
            return 'this is a test';
        });
    },
    renderNode : function(node){
        if(typeOf(node) == 'string'){
            return node;
        }else{
            switch(node.name){
                case 'foreach':
                    var res = '';
                    if(!node.attributes.from) throw('foreach macro requires \'from\' attribute');
                    if(!node.attributes.item) throw('foreach macro requires \'item\' attribute');
                    var from = node.attributes.from;
                    var item = node.attributes.item;
                    var key = node.attributes.key;
                    if(!key) key = 'key';
                    if(from.substring(0,1) == '$') from = from.substring(1);
                    from = this.getVariable(from);
                    from.each(function(value, index){
                        this.set(key, index);
                        this.set(item, value);
                        node.children.each(function(child){
                            res += this.renderNode(child);
                        }.bind(this));
                    }.bind(this));
                    return res;
                    break;
                case 'if':
                    var blocks = {'if':[]};
                    node.children.each(function(child){
                        if(blocks['else'] !== undefined){
                            blocks['else'].push(child);
                        }else{
                            if(typeOf(child) == 'object' && child.name == 'else'){
                                blocks['else'] = [];
                                return;
                            }
                            blocks['if'].push(child);
                        }
                        res += this.renderNode(child);
                    }.bind(this));
                    return '[IF]';
                    break;
                //case '':
                    //break;
                default :
                    if(node.name.substring(0,1) == '$'){
                        return this.get(node.name.substring(1));
                    }
            }
        }
    },
    getVariable : function(variable){
        return this.get(variable);
    }//*/
});
Protolus.Template.Smarty.scan = function(){
    Protolus.Template.scan('smarty', Protolus.Template.Smarty);
};