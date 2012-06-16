this.Data = new Class({
    data : {},
    primaryKey : 'id',
    datasource : null,
    exists : false,
    fields : [],
    initialize : function(options){
        if(!options.datasource) new Error('Datasource not specified for object!');
        if(!options.name) new Error('Data name not specified for object!');
        if(!Data.sources[options.datasource]) new Error('Datasource not found for object!');
        this.options = options;
        this.datasource = Data.sources[options.datasource];
    },
    get : function(key){
        if(this.data[key]) return this.data[key];
    },
    set : function(key, value){
        this.data[key] = value;
    },
    load : function(id, callback, errorCallback){
        this.data[this.primaryKey] = id;
        if(!this.db) this.db = Datasource.get(this.options.datasource);
        return this.db.load(this, callback, errorCallback);
    },
    save : function(callback, errorCallback){
        if(!this.db) this.db = Datasource.get(this.options.datasource);
        //if(!this.db) console.log('could not find datasource:'+this.options.datasource, Data.sources);
        return this.db.save(this, function(data){
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
this.Data.search = function(type, querystring, options){ //query is a query object or an object
    if(!options) options = {};
    var dummy = Data.dummy(type);
    var datasource = Datasource.get(dummy.options.datasource);
    var query = Data.parse(querystring);
    return datasource.search(dummy.options.name, query, options);
};
this.Data.query = function(type, querystring, options){ //query is a query object or an object
    if(!options) options = {};
    var dummy = Data.dummy(type);
    var datasource = Datasource.get(dummy.options.datasource);
    var query = Data.parse(querystring);
    return datasource.query(dummy.options.name, query, options);
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
        return result
    }catch(ex){
        console.log(ex);
        throw('Object creation error!');
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
