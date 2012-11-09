this.Datasource = new Class({
    Implements : Options,
    initialize : function(options){
        this.setOptions(options);
        if(
            options.debug && 
            !(typeOf(options.debug) == 'string' && options.debug.toLowerCase() !== 'false')
        ) this.debug = true; 
        Data.sources[options.name] = this;
    },
    search : function(type, query, options, callback){
        var successFunction = options.onSuccess;
        options.onSuccess = function(data){
            results = [];
            data.each(function(row){
                var dummy = Data.new(type);
                dummy.data = row;
                results.push(dummy);
            });
            if(successFunction) successFunction(results);
        };
        var failureFunction = options.onFailure;
        options.onFailure = function(error){
            if(failureFunction) failureFunction(error);
        };
        
        this.query(type, query, options, callback);
    },
    query : function(type, query, options, callback){
        var dummy = Data.dummy(type);
        type = dummy.options.name;
        if(typeOf(options) == 'function'){
            callback = options;
            options = {};
        }
        if(!options) options = {};
        var predicate = this.buildPredicate(query, options, dummy);
        return this.performSearch(type, predicate, options, (callback || options.onSuccess), (
            options.onFailure || function(err){ console.log('['+AsciiArt.ansiCodes('⚠ ERROR', 'red+blink')+']:'+JSON.encode(err)); }
        ));
    },
    handlePermissions: function(){
    
    },
    save: function(object, callback){
        return false;
    },
    escape: function(value){
        return value;
    },
    parseWhere: function(clause){
        //block parse
        //split off grouping/ordering
        //parse disriminants
    }
});
Datasource.get = function(name){
    return Data.sources[name];
};