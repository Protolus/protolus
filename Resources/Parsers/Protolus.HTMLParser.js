/*
---
description: An extensible Mootools object container bridging to a pureJS SAX parser

license: [MIT-style]

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.XMLParser]
...
*/
if(!Protolus) var Protolus = {};
Protolus.HTMLParser = new Class({
    Extends : Protolus.TagParser,
    root : null,
    nodeStack : [],
    initialize: function(){
        this.parent({
            strict : true,
            opener : '<',
            closer : '>',
            attributeAssign : '=',
            attributeDelimiters : ['"', "'"],
            closeEscape : '/',
            allowUndelimitedAttributes : false,
            literalTags : ['script'],
            unaryTags : ['br', 'hr', 'img']
        });
        this.root = new Element('root');
        this.  nodeStack.push(this.root);
    },
    open: function(tagName, attributes){
        var element = new Element(tagName, attributes);
        this.nodeStack.getLast().appendChild(element);
        this.nodeStack.push(element);
    },
    content: function(text){
        this.nodeStack.getLast().appendText(text);
    },
    close: function(tagName){
        this.nodeStack.pop(element);
    }
});