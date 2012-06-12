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
    var dummy = Data.dummy(type);
    var datasource = Datasource.get(dummy.options.datasource);
    console.log('q', querystring);
    var query = Data.parse(querystring);
    return datasource.search(dummy.options.name, query, options);
}
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
        console.log('new '+type);
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
    parse : function(query){
        return this.parse_where(query);
    },
    parse_where : function(clause){
        //return [];
        var parsed = this.parse_blocks(clause);
        console.log('parsed', parsed);
    },
    parse_discriminant : function(text){
        var key = '';
        var operator = '';
        var value = '';
        var inQuote = '';
        
    },
    parse_blocks : function(parseableText){
        var ch;
        var env = [];
        var stack = [];
        var textMode = false;
        var text = '';
        var root = env;
        for(var lcv=0; lcv < parseableText.length; lcv++){
            console.log('ch', ch);
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
                results = [];
                this.parse_compound_phrases(item, results);
                result.push(results);
            }else if(type == 'string'){
                result = this.parse_compound_phrase(); //won't work in js
            }
        });
    },
    parse_compound_phrase : function(clause){
        var parts = clause.split(/(?= [Aa][Nn][Dd] ?| [Oo][Rr] ?|\|\||&&)/);
        var results = [];
        parts.each(function(part){
            results.merge(part.split(/(?<= [Aa][Nn][Dd] | [Oo][Rr] |\|\||&&)/));
        });
        results.each(function(value, key){
            if(value.trim() == '') delete value[key];
            else results[key] = value.trim();
        });
    }
})
