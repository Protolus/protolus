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
    initialize: function(){
        this.parent({
            strict : true,
            opener : '{',
            closer : '{',
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
    },
});