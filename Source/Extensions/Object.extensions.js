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
if(!Object.profile){
    Object.profile = function(object, deep, indent){
        switch(typeOf(object)){
            case 'element':
                return '[function]';
                break;
            case 'elements':
                return '[Element Collection]';
                break;
            case 'textnode':
                return '[text]';
                break;
            case 'whitespace':
                return '[whitespace]';
                break;
            case 'arguments':
                return '[arguments]';
                break;
            case 'array':
                break;
            case 'object':
                var results = '<table>'
                Object.each(object, function(field, name){
                    results += '<tr><td>'+name+'</td><td>'+Object.profile(field)+'</td></tr>'
                });
                results += '</table>';
                return results;
                break;
            case 'regexp':
                return '[RegExp]';
                break;
            case 'class':
                break;
                return '[Class]';
            case 'collection':
                return '[collection]';
                break;
            case 'window':
                return '[window]';
                break;
            case 'document':
                return '[document]';
                break;
            case 'event':
                return '[event]';
                break;
            case 'null':
                return 'NULL'
                break;
            case 'function':
                return '[function]';
                break;
            case 'string':
            case 'number':
            case 'date':
            case 'boolean':
            default :
                return ''+object;
        }
    }
}
/*

Object.expand(object, {
    'source.user_id' : 'user_id'
}, index);

//*/


if(!Object.expand){
    Object.expand = function(ob, fields, indices){ 
        Object.map(ob, function(value, key){
            if(typeOf(value) == 'object' && typeOf(value) == 'array'){
                //Object.traverse(value, fields, indices);
                Object.expand(value, fields, indices);
            }else{
                if(fields.contains(key) && indices[key] && indices[key][value]){
                    //inflate
                    if(key.endsWith('_id')){
                        key = key.substring(0, key.length-3);
                    }else{
                        key = key+'_object';
                    }
                    ob[key] = indices[key][value];
                }
            }
        }, this);
    }
}

/*if(!Object.watch){
    Object.implement({
        watch : function(property, callback, oldValue){
            if(!oldValue) oldValue = '';
            if(this[property] != oldValue){
                oldValue = this[property];
                callback(this[property]);
            }else this.watch.delay(5, this, [property, callback, oldValue]);
        }
    });
}*/