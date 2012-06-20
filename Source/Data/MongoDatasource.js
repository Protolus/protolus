this.MongoDatasource = new Class({
    Extends : Datasource,
    collections : {},
    debug : false,
    initialize: function(options){
        //todo: support replica sets
        this.parent(options);
        this.connection = mongo.connect(this.options.host+"/"+this.options.database);
    },
    getRepresentation : function(type, value){
        var result = value;
        switch(type){
            case 'mongoid':{
                if(typeOf(result) == 'object') result = result.toString(); //it's possible this is already an object
                result = this.connection.ObjectId(result);
            }
        }
        return result;
    },
    buildPredicate: function(predicate, object){
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
                        result[item.key] = object.getByType(item.key, item.value);
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
        if(Protolus.verbose){
            if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+type+'.find(...)', 'Query');
            else console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+type+'.find('+JSON.encode(predicate)+')', 'Query');
        }
        collection.find(predicate, function(err, objects) {
            if( err ){
                if(errorCallback) errorCallback(err);
            } else{
                if(Protolus.verbose){
                    if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+type+'.find(...)'+(objects && objects.length?' -> {'+objects.length+'}':''), 'Query');
                    else console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+type+'.find('+JSON.encode(predicate)+')'+(objects && objects.length?' -> {'+objects.length+'}':''), 'Query');
                }
                callback(objects);
            }
        }.bind(this));
    },
    escape: function(value){
        return value;
    },
    save : function(object, callback, errorCallback){
        if(!this.collections[object.options.name]) this.collections[object.options.name] = this.connection.collection(object.options.name);
        if(object.get(object.primaryKey)){
            var payload = Object.clone(object.data);
            delete payload[object.primaryKey];
            var originalPayload = Object.clone(payload)
            var updateOn = {};
            updateOn[object.primaryKey] = object.get(object.primaryKey, true);
            if(Protolus.verbose){
                if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+object.options.name+'.update(...)', 'Query');
                else console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+object.options.name+'.update('+JSON.encode(updateOn)+', '+JSON.encode(payload)+')', 'Query');
            }
            this.collections[object.options.name].update(
                updateOn,
                payload,
                {},
                function(err) {
                    if( err ){
                        if(errorCallback) errorCallback(err);
                    } else {
                        if(Protolus.verbose){
                            if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+object.options.name+'.update(...)', 'Query');
                            else console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+object.options.name+'.update('+JSON.encode(updateOn)+', '+JSON.encode(payload)+')', 'Query');
                        }
                        callback(object.data);
                    }
                }.bind(this));
        }else{
            var inserted = Object.clone(object.data);
            if(Protolus.verbose){
                if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+object.options.name+'.insert(...)', 'Query');
                else console.log('['+AsciiArt.ansiCodes('DATA CALL', 'magenta')+'] db.'+object.options.name+'.insert('+JSON.encode(inserted)+')', 'Query');
            }
            this.collections[object.options.name].insert(object.data, function(err, data){
                if( err ){
                    if(errorCallback) errorCallback(err);
                }else{
                    object.data = data;
                    if(Protolus.verbose){
                        if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+object.options.name+'.insert(...)', 'Query');
                        else console.log('['+AsciiArt.ansiCodes('DATA RETURN', 'magenta')+'] db.'+object.options.name+'.insert('+JSON.encode(inserted)+')', 'Query');
                    }
                    callback(data);
                }
            }.bind(this));
        }
    },
    load : function(object, callback, errorCallback){
        var loadOn = {};
        loadOn[object.primaryKey] = object.get(object.primaryKey, true);
        this.performSearch(object.options.name, loadOn,function(data) {
            if(data.length > 0){
                object.data = data[0];
                callback(data[0]);
            }else errorCallback();
        }.bind(this), function(err){
            if(errorCallback) errorCallback(err);
        }.bind(this));
    },
    delete : function(object, callback, errorCallback){
        if(!this.collections[object.options.name]) this.collections[object.options.name] = this.connection.collection(object.options.name);
        var deleteOn = {};
        deleteOn[object.primaryKey] = object.get(object.primaryKey);
        this.collections[object.options.name].remove( deleteOn,
            function(err) {
                if( err ){
                    if(errorCallback) errorCallback(err);
                } else {
                    if(Protolus.verbose){
                        if(!this.debug) console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.delete(...)', 'Query');
                        else console.log('['+AsciiArt.ansiCodes('DATA', 'magenta')+'] db.'+object.options.name+'.delete('+JSON.encode(deleteOn)+')', 'Query');
                    }
                    if(callback) callback(object.data);
                }
            }.bind(this)
        );
    }
});
    
