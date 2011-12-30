/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Element){
    //dummy DOM for server-side management
    var Element = new Class({
        children : [],
        attributes : {},
        initialize : function(name, options){
            this.tagName = name;
            this.attributes = options;
            if(name.toLowerCase() == 'canvas'){
                var Canvas = require('canvas');
                this.canvasWedge = new Canvas(150, 150);
                Object.each(this.canvasWedge, function(value, key){
                    if(typeOf(value) == 'function'){
                        this[key] = value;
                    }
                }.bind(this));
            }
        },
        appendChild : function(element){
            this.children.push(element);
        },
        appendText : function(text){
            this.children.push(text);
        },
        getChildren : function(expression){
            if(expression.substring(0, 2) == '//'){
                var results = [];
                var val = expression.substring(2);
                this.traverse(function(node){
                    if( node.tagName == val ) results.push(node);
                });
            }
        }
    });
    Element.Events = {};
}

if(!Elements) var Elements = new Class({});
if(!NodeList) var NodeList = new Class({});