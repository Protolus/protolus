this.Datasource = new Class({
    initialize : function(options){
        Data.sources[options.name] = this;
    },
    search : function(type, querystring, options, callback){
        if(typeOf(options) == 'function'){
            callback = options;
            options = {};
        }
        if(!options) options = {};
        var query = this.parseWhere(querystring);
        var predicate = this.buildPredicate(query)
        return this.performSearch(type, predicate, (callback || options.onSuccess), (
            options.onFailure || function(err){ console.log('[ERROR]:'+JSON.encode(err)); }
        ));
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