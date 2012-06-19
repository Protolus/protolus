this.MongoDatasource = new Class({
    Extends : Datasource,
    collections : {},
    initialize: function(options){
        //todo: support replica sets
        this.parent(options);
        this.connection = mongo.connect(this.options.host+"/"+this.options.database);
    },
    buildPredicate: function(predicate){
        var result = {};
        var stack = result;
        predicate.each(function(item){
            if(typeOf(item) == 'array'){
                //result.push('('+this.buildPredicate(item)+')');
                
            }else{
                if(item.type == 'conjunction'){
                    if(item.value === '&&') item.value = 'and';
                    if(item.value === '||') item.value = 'or';
                    if(item.value !== 'and'){
                        // todo: push this condition onto the stack
                        // if next is array, else
                    }   // else: we're ANDing, so we only need additional elements within a flat array
                }
                if(item.type == 'expression'){
                    var value = (
                        (Protolus.isNumeric(item.value) || item.value == 'true' || item.value == 'false')
                        ?parseFloat(item.value)
                        :item.value
                    );
                    if(item.operator === '='){
                        result[item.key] = item.value;
                    }else{
                        switch(item.operator){
                            case '>=':
                            case '<=':
                            case '>':
                            case '<':
                            case '<>':
                            case '!=':
                        }
                    }
                    
                }
            }
        }.bind(this));
        return stack;
    },
    lastId : function(type, callback){
        
    },
    performSearch : function(type, predicate, callback, errorCallback){
        if(!this.collections[type]) this.collections[type] = this.connection.collection(type);
        var collection = this.collections[type];
        collection.find(predicate, function(err, objects) {
            if( err ){
                if(errorCallback) errorCallback(err);
            } else{
                if(Protolus.verbose){
                    if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+type+'.find(...)'+(objects && objects.length?' -> {'+objects.length+'}':''), 'Query');
                    else console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+type+'.find('+JSON.encode(predicate)+')'+(objects && objects.length?' -> {'+objects.length+'}':''), 'Query');
                }
                callback(objects);
            }
        });
    },
    escape: function(value){
        return value;
    },
    save : function(object, callback, errorCallback){
        if(!this.collections[object.options.name]) this.collections[object.options.name] = this.connection.collection(object.options.name);
        if(object.id){
            var payload = Object.clone(object.data)
            delete payload.id;
            var updateOn = {};
            updateOn[object.primaryKey] = object.get(object.primaryKey);
            this.collections[object.options.name].update(
                updateOn,
                payload,
                { multi : true },
                function(err) {
                    if( err ){
                        if(errorCallback) errorCallback(err);
                    } else {
                        if(Protolus.verbose){
                            if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.insert(...)', 'Query');
                            else console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.insert('+JSON.encode(object.data)+')', 'Query');
                        }
                        callback(object.data);
                    }
                });
        }else{
            this.collections[object.options.name].insert(object.data, function(err, data){
                if( err ){
                    if(errorCallback) errorCallback(err);
                }else{    
                    object.data = data;
                    if(Protolus.verbose){
                        if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.insert(...)', 'Query');
                        else console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.insert('+JSON.encode(object.data)+')', 'Query');
                    }
                    callback(data);
                }
            });
        }
    },
    load : function(id, object, callback, errorCallback){
        var loadOn = {};
        loadOn[object.primaryKey] = id;
        this.performQuery(loadOn, function(err, data) {
            if( err ){
                if(errorCallback) errorCallback(err);
            } else {
                if(data.length > 0){
                    object.data = data[0];
                    callback(data[0]);
                }
            }
        });
    }
});
    
