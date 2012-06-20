this.Data = new Class({
    data : {},
    primaryKey : 'id',
    datasource : null,
    exists : false,
    fields : [],
    virtuals : {},
    options : {},
    initialize : function(options){
        if(!options.datasource) new Error('Datasource not specified for object!');
        if(!options.name) new Error('Data name not specified for object!');
        if(!Data.sources[options.datasource]) new Error('Datasource not found for object!');
        this.options = options;
        this.datasource = Datasource.get(options.datasource);
        switch(this.datasource.options.type){
            case 'mongo':
                if(this.primaryKey == 'id'){ //if we index by id, we'll assume mongo's _id will do just as well 
                    this.fields.erase('id');
                    this.virtualAlias('id', '_id');
                    /*this.virtualSetter('id', function(value){
                        console.log('id', value);
                        throw ('Mongo IDs cannot be altered!');
                    });*/
                    this.primaryKey = '_id';
                    this.setOption('type', '_id', 'mongoid');
                }
                break;
            case 'mysql':
                
                break;
        }
    },
    get : function(key, typed){
        if(this.virtuals[key] && this.virtuals[key].get){
            return this.virtuals[key].get(key, typed);
        }else if(this.data[key]){
            if(typed) return this.datasource.getRepresentation(this.options[key]['type'], this.data[key]);
            else return this.data[key];
        }
    },
    getByType : function(key, value){
        if(this.virtuals[key] && this.virtuals[key].get){
            return this.virtuals[key].type(value);
        }else if(this.data[key]){
            if(typed) return this.datasource.getRepresentation(this.options[key]['type'], value);
            else return value;
        }
    },
    set : function(key, value){
        if(this.virtuals[key] && this.virtuals[key].set){
            this.data[key] = this.virtuals[key].set(value);
        }else{
            this.data[key] = value;
        }
    },
    setOption : function(option, key, value){
        if(!this.options[key]) this.options[key] = {};
        this.options[key][option] = value;
    },
    virtualSetter : function(key, callback){
        if(!this.virtuals[key]) this.virtuals[key] = {};
        this.virtuals[key]['set'] = callback;
    },
    virtualGetter : function(key, callback){
        if(!this.virtuals[key]) this.virtuals[key] = {};
        this.virtuals[key]['get'] = callback;
    },
    virtualByType : function(key, callback){
        if(!this.virtuals[key]) this.virtuals[key] = {};
        this.virtuals[key]['type'] = callback;
    },
    virtualAlias : function(key, value){
        if(!this.virtuals[key]) this.virtuals[key] = {};
        this.virtuals[key]['alias'] = value;
        this.virtualGetter(key, function(typed){
            if(typed && this.options[key]['type']) return this.datasource.getRepresentation(this.options[key]['type'], value);
            return this.get(value);
        }.bind(this));
        this.virtualSetter(key, function(incoming){
            return this.data[value] = incoming;
        }.bind(this));
        this.virtualByType(key, function(incoming){
            return this.getByType(value, incoming);
        }.bind(this));
    },
    load : function(id, callback, errorCallback){
        this.data[this.primaryKey] = id;
        return this.datasource.load(this, callback, errorCallback);
    },
    delete : function(callback, errorCallback){
        return this.datasource.delete(this, callback, errorCallback);
    },
    save : function(callback, errorCallback){
        //if(!this.db) console.log('could not find datasource:'+this.options.datasource, Data.sources);
        return this.datasource.save(this, function(data){
            this.data = data;
            if(callback) callback(data);
        }, errorCallback);
    },
});
this.Data.dummies = {};
this.Data.dummy = function(type, context){
    if(!context) context = this;
    if(!Data.dummies[type]){
        try{
            context.eval('Data.dummies[type] = new context.'+type+'();');
        }catch(ex){
            throw('Object type(\''+type+'\') not found');
        }
    }
    return Data.dummies[type];
};
this.Data.parse = function(query, options){
    if(!Data.parser) Data.parser = new Data.WhereParser();
    return Data.parser.parse(query); //options?
};
this.Data.coreFields = ['modification_time', 'creation_time', 'modifier_id', 'creator_id', 'record_status'];
this.Data.sources = {};
this.Data.autoLink = false; // join logic 
this.Data.search = function(type, querystring, options, errorCallback){ //query is a query object or an object
    if(typeOf(options) == 'function') options = {onSuccess: options};
    if(!options) options = {};
    if(errorCallback && typeOf(errorCallback) == 'function') options['onFailure'] = errorCallback;
    var dummy = Data.dummy(type);
    var datasource = Datasource.get(dummy.options.datasource);
    var query = Data.parse(querystring);
    return datasource.search(type, query, options);
};
this.Data.query = function(type, querystring, options){ //query is a query object or an object
    if(typeOf(options) == 'function') options = {onSuccess: options};
    if(!options) options = {};
    if(errorCallback && typeOf(errorCallback) == 'function') options['onFailure'] = errorCallback;
    var dummy = Data.dummy(type);
    var datasource = Datasource.get(dummy.options.datasource);
    var query = Data.parse(querystring);
    return datasource.query(type, query, options);
};
this.Data.id = function(type){
    if(!type) type = 'uuid';
    switch(type){
        case 'uuid' :
            return System.uuid.v1();
            break;
        default:
        
    }
};
this.Data.new = function(type){
    try{
        eval('this.lastProtolusObject = new GLOBAL.'+type+'();');
        var result = this.lastProtolusObject;
        delete this.lastProtolusObject;
        return result;
    }catch(ex){
        console.log(ex);
        throw('Object creation('+type+') error!');
    }
}
this.Data.WhereParser = new Class({
    blockOpen : '(',
    blockClose : ')',
    escapeOpen : '\'',
    escapeClose : '\'',
    sentinels : ['and', 'or', '&&', '||'],
    operators : ['=', '<', '>', '!'],
    textEscape : ['\''],
    parse : function(query){
        return this.parse_where(query);
    },
    parse_where : function(clause){
        var blocks = this.parse_blocks(clause);
        var phrases = this.parse_compound_phrases(blocks, []);
        var object = this;
        var mapFunction = function(value){
            if(typeOf(value) == 'array'){
                return value.map(mapFunction);
            }else{
                if(object.sentinels.contains(value.toLowerCase())){
                    return {
                        type : 'conjunction',
                        value : value
                    }
                }else{
                    return object.parse_discriminant(value);
                }
            }
        };
        var parsed = phrases.map(mapFunction);
        return parsed;
    },
    parse_discriminant : function(text){
        var key = '';
        var operator = '';
        var value = '';
        var inQuote = false;
        var openQuote = '';
        for(var lcv=0; lcv < text.length; lcv++){
            ch = text[lcv];
            if(inQuote && ch === inQuote){
                inQuote = false;
                continue;
            }
            if( (!inQuote) && this.textEscape.contains(ch)){
                inQuote = ch;
                continue;
            }
            if(this.operators.contains(ch)){
                operator += ch;
                continue;
            }
            if(operator !== '') value += ch;
            else key += ch;
        }
        return {
            type : 'expression',
            key : key,
            operator : operator,
            value : value
        };
    },
    parse_blocks : function(parseableText){
        var ch;
        var env = [];
        var stack = [];
        var textMode = false;
        var text = '';
        var root = env;
        for(var lcv=0; lcv < parseableText.length; lcv++){
            ch = parseableText[lcv];
            if(textMode){
                text += ch;
                if(ch === this.escapeClose) textMode = false;
                continue;
            }
            if(ch === this.escapeOpen){
                text += ch;
                textMode = true;
                continue;
            }
            if(ch === this.blockOpen){
                if(text.trim() !== '') env.push(text);
                var newEnvironment = [];
                env.push(newEnvironment);
                stack.push(this.env);
                env = newEnvironment;
                text = '';
                continue;
            }
            if(ch === this.blockClose){
                if(text.trim() !== '') env.push(text);
                delete env;
                env = stack.pop();
                text = '';
                continue;
            }
            text += ch;
        }
        if(text.trim() !== '') env.push(text);
        return root;
    },
    parse_compound_phrases : function(array, result){
        array.each(function(item){
            var type = typeOf(item);
            if(type == 'array'){
                var results = this.parse_compound_phrases(item, []);
                result.push(results);
            }else if(type == 'string'){
                result = this.parse_compound_phrase(item);
            }
        }.bind(this));
        return result;
    },
    parse_compound_phrase : function(clause){
        var inText = false;
        var escape = '';
        var current = '';
        var results = [''];
        for(var lcv=0; lcv < clause.length; lcv++){
            ch = clause[lcv];
            if(inText){
                results[results.length-1] += current+ch;
                current = '';
                if(ch === escape) inText = false;
            }else{
                if(this.textEscape.contains(ch)){
                    inText = true;
                    escape = ch;
                }
                if(ch != ' '){
                    current += ch;
                    if(this.sentinels.contains(current.toLowerCase())){
                        results.push(current);
                        results.push('');
                        current = '';
                    }
                }else{
                    results[results.length-1] += current;
                    current = '';
                }
            }
        }
        if(current != '') results[results.length-1] += current;
        if(results[results.length-1] === '') results.pop();
        return results;
    }
});
