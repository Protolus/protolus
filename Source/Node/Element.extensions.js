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
        classes : [],
        initialize : function(name, options){
            this.tagName = name;
            this.attributes = options;
            switch(name.toLowerCase()){
                case 'canvas':
                    var Canvas = require('canvas');
                    this.canvasWedge = new Canvas();
                    Object.each(this.canvasWedge, function(value, key){
                        if(typeOf(value) == 'function'){
                            this[key] = value;
                        }
                    }.bind(this));
                    break;
                case 'image':
                    this.watch('src', function(key, value, oldValue){
                    
                    });
                    break;
            }
            //global setup
            attributes.watch('class', function(key, value, oldValue){
                this.classes = value.split(value);
            });
        },
        appendChild : function(element){
            this.children.push(element);
        },
        getAttribute : function(key){
            return this.attributes[key];
        },
        setAttribute : function(key, value){
            if(!value) delete this.attributes[key];
            this.attributes[key] = value;
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