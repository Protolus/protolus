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
    Extends : Protolus.Template,
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
                'for':function(text){
                
                }
            }
        });
        this.tagRegistry.register('test', function(node){
            return 'this is a test';
        });
    },
    render: function(){
        
    }
});
Protolus.Template.Smarty.scan = function(){
    Protolus.Template.scan('smarty', Protolus.Template.Smarty);
};