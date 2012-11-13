/*
---
description: An extensible Smarty-style protolus template parser Parser in Mootools

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
    Implements : [Protolus.TemplateData, Protolus.TemplateResourceTargeting],
    parent : false,
    targets : {},
    initialize: function(text, options){
        this.options = options;
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
                    var func = function(value, index){
                        this.set(key, index);
                        this.set(item, value);
                        node.children.each(function(child){
                            res += this.renderNode(child);
                        }.bind(this));
                    }.bind(this);
                    if(typeOf(from) == 'object') Object.each(from, func);
                    else from.each(func);
                    return res;
                    break;
                case 'page':
                    if(node.attributes.wrapper && this.options.wrapperSet){
                        this.options.wrapperSet(node.attributes.wrapper);
                    };
                    var rootPanel = this.getRoot();
                    if(node.attributes.title){
                        rootPanel.environment['page_title'] = node.attributes.title;
                    };
                    return '';
                    break;
                case 'require':
                    var rootPanel = this.getRoot();
                    if(node.attributes.name == undefined){
                        console.log(node.attributes);
                        throw('require macro requires \'name\' attribute');
                    }
                    if(!node.attributes.mode) node.attributes.mode = 'targeted';
                    if(!node.attributes.directory) node.attributes.directory = Protolus.resourceDirectory;
                    if(node.attributes.directory == "local") node.attributes.directory = "App/Resources";
                    if(!node.attributes.target) node.attributes.target = 'HEAD';
                    else node.attributes.target = node.attributes.target.toUpperCase();
                    var resources = node.attributes.name.split(',');
                    var result = '';
                    if(node.attributes.locality == 'remote'){
                        //todo: implement remote locality
                        if(node.attributes.mode == 'targeted'){
                            //local settings don't matter, just app level
                        }else{
                            resources.each(function(resourceName){
                                if(!rootPanel.containsResource(resourceName)){
                                    //todo: inline async
                                }
                            });
                        }
                    }else{
                        if(node.attributes.mode == 'targeted'){
                            rootPanel.ensureResources(resources, function(){}, node.attributes.directory);
                        }else{
                            //*
                            resources.each(function(resourceName){
                                if(!rootPanel.containsResource(resourceName)){
                                    //todo: reenable inline
                                    /*if(result == '') result = '<script>';
                                    id = this.async();
                                    result += id;
                                    //on return
                                    res.files('js', function(files){
                                        this.processReturn(id, files.join("\n"));
                                    }.bind(this));*/
                                }
                            }); //*/
                        }
                    }
                    if(result != '') result += '</scr'+'ipt>';
                    //modes: targeted(d), inline
                    return result;
                    break;
                case 'panel':
                    var res = '';
                    if(!node.attributes.name) throw('panel macro requires \'name\' attribute');
                    var subpanel = new Protolus.Panel(node.attributes.name, {onLoad:function(subpanel){
                        subpanel.template.progenitor = this;
                    }.bind(this)});
                    var id = this.async(); //this indirection makes me uncomfortable
                    subpanel.render(function(panel){
                        this.processReturn(id, panel);
                    }.bind(this));
                    return id;
                    break;
                case 'if':
                    var res = '';
                    node.clause = node.full.substring(2).trim();
                    var conditionResult = this.evaluateSmartyPHPHybridBooleanExpression(node.clause);
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
                    }.bind(this));
                    if(conditionResult){
                        blocks['if'].each(function(child){
                            res += this.renderNode(child);
                        }.bind(this));
                    }else if(blocks['else']){
                        blocks['else'].each(function(child){
                            res += this.renderNode(child);
                        }.bind(this));
                    }
                    return res;
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
    },
    evaluateSmartyPHPHybridBooleanExpression : function(expression){
        //var pattern = /[Ii][Ff] +(\$[A-Za-z][A-Za-z0-9.]*) *$/s;
        expression = expression.trim();
        if(expression.toLowerCase().substring(0, 2) == 'if'){
            //todo: multilevel
            expression = expression.substring(2).trim();
            var expressions = expression.split('&&');
            var value = true;
            expressions.each(function(exp){
                value = value && this.evaluateSmartyPHPHybridBooleanExpression(exp);
            });
            return value;
        }else{
            pattern = new RegExp('(.*)( eq| ne| gt| lt| ge| le|!=|==|>=|<=|<|>)(.*)', 'm');
            parts = expression.match(pattern);
            if(parts && parts.length > 3){
                var varOne = this.evaluateSmartyPHPHybridVariable(parts[1].trim());
                var varTwo = this.evaluateSmartyPHPHybridVariable(parts[3].trim());
                var res;
                switch(parts[2]){
                    case '==':
                    case 'eq':
                        res = (varOne == varTwo);
                        break;
                    case '!=':
                    case 'ne':
                        res = (varOne != varTwo);
                        break;
                    case '>':
                    case 'gt':
                        res = (varOne > varTwo);
                        break;
                    case '<':
                    case 'lt':
                        res = (varOne < varTwo);
                        break;
                    case '<=':
                    case 'le':
                        res = (varOne <= varTwo);
                        break;
                    case '>=':
                    case 'ge':
                        res = (varOne >= varTwo);
                        break;
                }
                return res;
            }else{
                var res;
                if( (expression - 0) == expression && expression.length > 0){ //isNumeric?
                    res = eval(expression);
                    res = res == 0;
                }else if(expression == 'true' || expression == 'false'){ //boolean
                    res = eval(expression);
                }else{
                    res = this.evaluateSmartyPHPHybridVariable(expression);
                    res = (res != null && res != undefined && res != '' && res != false);
                }
                return res;
            }
        }
    },
    evaluateSmartyPHPHybridExpression : function(variableName){ // this decodes a value that may be modified by functions using the '|' separator
        if(variableName === undefined) return null;
        var methods = variableName.splitHonoringQuotes('|', ['#']);
        methods.reverse();
        //console.log(['expression-methods:', methods]);
        var accessor = methods.pop();
        var value = this.evaluateSmartyPHPHybridVariable(accessor);
        //now that we have the value, we must run it through the function stack we found
        var method;
        var params;
        var old = value;
        methods.each(function(item, index){
            params = item.split(':');
            params.reverse();
            //console.log(['expression-item:', item]);
            method = params.pop(); //1st element is
            if(method == 'default'){
                if(!value || value == '') value = this.evaluateSmartyPHPHybridVariable(params[0]);
            }else{
                value = method.apply(this, params.clone().unshift(value));
            }
        });
        return value;
    },
    evaluateSmartyPHPHybridVariable : function(accessor, isConf){
        if(isConf == 'undefined' || isConf == null) isConf = false;
        if(!accessor) return '';
        if(accessor.toLowerCase().startsWith('\'') && accessor.toLowerCase().endsWith('\'')) return accessor.substr(1, accessor.length-2);
        if(accessor.toLowerCase().startsWith('"') && accessor.toLowerCase().endsWith('"')) return accessor.substr(1, accessor.length-2);
        if(accessor.toLowerCase().startsWith('$smarty.')) return this.get(accessor.substr(8));
        if(accessor.startsWith('$')){
            var acc = accessor.substring(1);
            return this.get(acc);
        }
        if(accessor.startsWith('#') && accessor.endsWith('#')){
            var cnf = accessor.substr(1, accessor.length-2);
            return Midas.SmartyLib.evaluateSmartyPHPHybridVariable( cnf , true);
        }
        return this.get(accessor);
        var parts = accessor.split('.');
        parts.reverse();
        var currentPart = parts.pop();
        var currentValue;
        if(isConf){
            return this.getConf(accessor);
            //currentValue = smartyInstance.config[currentPart];
        }else switch(currentPart){
            case 'smarty':
                currentValue = this.data;
                break;
            default:
                currentValue = this.get(currentPart);
                if(currentValue == 'undefined' ) currentValue = '';
        }
        parts.each(function(item, index){
            if(!currentValue && currentValue !== 0) return;
            if(currentValue[item] == 'undefined'){
                currentValue = null;
            }else{
                currentValue = currentValue[item];
            }
        });
        return currentValue;
    }
});
Protolus.Template.Smarty.scan = function(){
    Protolus.Template.scan('smarty', Protolus.Template.Smarty);
};