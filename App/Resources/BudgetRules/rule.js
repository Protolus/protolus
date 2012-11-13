/*****************************************************************************************
 * RulesGUI.Rule
 *****************************************************************************************
 * @author Abbey Hawk Sparrow
 * 
 * This class encapsulates a rule and can generate an interface given a well formed block
 * of code. It also serves as the interface for event registration through a recursive
 * targeting function.
 * 
 **/

//handle weirdness in crockford's parse tree
RulesGUI.summarizeTheParseNodeWithoutClusterfuck = function(node){
    var summary = {};
    Object.each(node, function(value, name){
        switch(typeOf(value)){
            case 'array' :
            case 'elements' :
            case 'arguments' :
            case 'collection' :
                summary[name] = '['+value.length+']';
                break;
            case 'object' :
                summary[name] = '['+Object.keys(value).join(',')+']';
                break;
            case 'fn' :
                summary[name] = '[FN]';
                break;
            default : summary[name] = value;
            
        }
    }.bind(this));
    return JSON.encode(summary);
};
RulesGUI.Rule = new Class({
    Implements : [Events, Options],
    components : [],
    dragListeners : [],
    container : false,
    initialize : function(element, options){
        this.container = element;
        this.setOptions(options);
        //if(!make_parse) throw('rule parser requires Douglas Crockford\'s Parser for Simplified JavaScript');
        var emit = function(){};
        //this.parse = make_parse();
        /*this.parse.token.error = function(text){
            console.log('EEERRR', text);
        };*/
        if(this.options.code) this.load(this.options.code);
    },
    nextComponentCouldBeType : function(type){
        if(!this.components[this.components.length-1]) return true; // todo: check for legal starts
        return this.components[this.components.length-1].legalFollowerType(type);
    },
    nextComponentCouldBe : function(component){
        return this.canInsertAt(component);
    },
    //todo: change this to be built off a component.canInsert(component, [before, after, in], [deep, basic])
    canInsertAt : function(component, position){
        if(!position) position = this.components.length; //append
        var predecessor = this.components[position-1];
        var successor = this.components[position+1];
        var result = true;
        if(predecessor) result && predecessor.legalFollower(component);
        if(successor) result && component.legalFollower(successor);
        return result;
    },
    insertAt : function(component, position){
        if(!this.canInsertAt(component, position)) throw('cannot insert component at position '+position);
        this.components = this.components.splice(0, position, component);
    },
    code : function(){
        var result = '';
        this.components.each(function(component){
            result += component.code();
        });
    },
    ui : function(){
        
    },
    targets : function(){ //return all drop targets on this rule
        this.container.rule = this;
        var targets = [this.container];
        //var targets = [];
        this.components.each(function(component){
            //console.log('cmp', component)
            var componentTargets = component.targets();
            componentTargets.each(function(target){
                target.rule = this;
                targets.push(target);
            }.bind(this));
        }.bind(this));
        //console.log('targets', targets)
        return targets;
    },
    registerDragListener : function(listener){
        this.targets().each(function(target){
            listener.droppables.push(target); 
            this.dragListeners.push(listener);
        }.bind(this));
    },
    removeDragListener : function(listener){
        //todo
    },
    loadNode : function(node){ //recursive load of a node from crockford's parse tree
        var result;
        var mode = (
            node.arity == 'literal' || 
            node.arity == 'function' || 
            node.arity == 'statement' || 
            node.arity == 'ternary' || 
            node.arity == 'prefix'
        ) ? node.arity : (node.identifier ? 'identifier' : node.string);
        if(
            (node.string || node.string === '') &&
            (node.quote == '"' || node.quote == "'")
        ) mode = 'literal';
        var structure = (node.arity == 'infix') ?
                    ((node.third)?'ternary':(node.second?'binary':'unary')) :
                    node.arity ;
        var widget;
        var summary = RulesGUI.summarizeTheParseNodeWithoutClusterfuck(node);
        summary.mode = mode;
        var options = {
            rule  : this,
            parseNode : summary
        };
        //options.x = node;
        //console.log('item', mode, node);
        //*
        switch(mode){
            case '*' : 
            case '/' : 
            case '+' : 
            case '-' : 
            case '%' : 
            case '^' : 
            case '&&' : 
            case '||' :
            case '==' :
            case '>' :
            case '>=' :
            case '<' :
            case '<=' ://operation
                console.log('EEEE', options);
                options.subject = this.loadNode(node.first);
                options.predicate = this.loadNode(node.second);
                options.operator = mode;
                result = new RulesGUI.Component.Operation(options);
                break;
            case '(' : //function call
                var args;
                var object;
                //console.log('funcy', node);
                switch(structure){
                    case 'binary':
                        options.method = this.loadNode(node.first);
                        options.args = []; 
                        node.second.each(function(child){
                            options.args.push(this.loadNode(child));
                        }.bind(this));
                        break;
                    case 'ternary':
                        options.object = this.loadNode(node.first);
                        options.method = node.second;
                        options.args = []; 
                        node.third.each(function(child){
                            options.args.push(this.loadNode(child));
                        }.bind(this));
                        break;
                    default : throw('unsupported function call configuration: '+node.arity);
                }
                result = new RulesGUI.Component.Call(options);
                break;
            case '=' : // assignment
                options.subject = this.loadNode(node.first);
                options.predicate = this.loadNode(node.second);
                result = new RulesGUI.Component.Assignment(options);
                widget = result.widget();
                break;
            case 'identifier' : // literal
            case '(number)' : // literal
            case 'literal' : // literal
            case '.' : // accessor
            case '[' : // accessor
                if(mode == '['){
                    options.object = this.loadNode(node.first);
                    options.accessor = this.loadNode(node.second);
                    options.accessOperator = '[';
                }else if(node.string == '.'){
                    options.object = this.loadNode(node.first);
                    options.accessor = this.loadNode(node.second);
                    options.accessOperator = '.';
                }else{
                    if(options.number || node.string == '(number)'){
                        options.value = options.number?options.number:node.number;
                        options.number = true;
                    }else{
                        if(node.quote) options.value = node.quote+node.string+node.quote;
                        else options.name = node.string;
                    }
                }
                result = new RulesGUI.Component.Reference(options);
                widget = result.widget();
                break;
            case 'function' : // fn
                var args = [];
                node.first.each(function(parsedArg){
                    args.push(this.loadNode(parsedArg));
                }.bind(this));
                options.args = args;
                var substatements = [];
                node.block.each(function(parsedStatement){
                    substatements.push(this.loadNode(parsedStatement));
                }.bind(this));
                if(node.name) options.name = node.name;
                options.statements = substatements;
                result = new RulesGUI.Component.Function(options);
                widget = result.widget();
                break;
            case 'ternary' :
            case 'statement' : // statement
                //console.log('stmt', node);
                if(node.string === 'var'){ //declaration
                    options.declarations = [];
                    node.first.each(function(parseNode){
                        options.declarations.push(this.loadNode(parseNode));
                    }.bind(this));
                }
                if(node.string === '?'){ //ternary
                    options.ternary = true;
                    options.condition = this.loadNode(node.first);
                    options.body = this.loadNode(node.second);
                    options.else = this.loadNode(node.third);
                }
                if(node.string === 'if'){ //branch
                    options.branch = 'if';
                    options.condition = this.loadNode(node.first);
                    options.body = [];
                    node.block.each(function(parseNode){
                        options.body.push(this.loadNode(parseNode));
                    }.bind(this));
                    if(node.else){
                        options.else = [];
                        node.else.each(function(parseNode){
                            options.else.push(this.loadNode(parseNode));
                        }.bind(this));
                    }
                }
                result = new RulesGUI.Component.Statement(options);
                widget = result.widget();
                break;
            case 'prefix' : // statement
                switch(node.string){
                    case '!' :
                        options.unary = true;
                        options.operator = '!';
                        options.value = this.loadNode(node.first);
                        result = new RulesGUI.Component.Operation(options);
                        widget = result.widget();
                        break;
                    default : throw('unknown operation: ['+node.string+']');
                }
                break;
            //case '(number)' :
                //console.log("NUMMM", node, mode);
                //return {};
                //return new RulesGUI.Component.Method({name:'foo'});
                //throw('I hate numbers!');
                //break;
            default :
                console.log('mode error', node);
                //result = new Element('div');
                //result = new RulesGUI.Component.Statement(options);
                throw('unknown mode:'+mode);
        }//*/
        return result;
    },
    load : function(code){
        JSLINT(code);
        var parseTree = JSLINT.tree.first;
        this.fireEvent('load', parseTree, code);
        var loaded = [];
        parseTree.each(function(node){
            var rendered = this.loadNode(node);
            if(rendered){
                loaded.push(rendered);
                var widget =  rendered.widget();
                this.container.adopt(widget);
            }
        }.bind(this));
        
        console.log('parseTree', parseTree);
    }
});