this.MySQLDatasource = new Class({
    Extends : Datasource,
    debug : false,
    initialize: function(options){
        this.parent(options);
        this.connection = mysql.createClient(options);
    },
    log : function(text){
        console.log(text);
    },
    buildWhereClause: function(predicate){
        if(typeOf(predicate) == 'array') predicate = {discriminants:predicate};
        if(!predicate.mode) predicate.mode == 'AND';
        predicate.mode = predicate.mode.toUpperCase();
        var clause = '';
        predicate.discriminants.each(function(discriminant){
            if(discriminant.enclose){
                discriminant.operator = 'enclosure';
                discriminant.value = discriminant.enclose
            }
            switch(discriminant.operator.toLowerCase()){
                case 'in':
                    if(typeOf(discriminant.value) == 'array') 
                        clause += 'IN ('+discriminant.value.map(function(item){
                            if(typeOf(item) == 'string') return '\''+item+'\'';
                            else return item;
                        }).join(',')+')';
                    else clause += 'IN ('+discriminant.value+')';
                    break;
                case 'enclosure':
                    clause += '('+buildWhereClause(discriminant.value)+')';
                    break;
                default:
                    clause += discriminant.field+' '+discriminant.operator+' '+discriminant.value;
            }
        });
        
    },
    lastId : function(type, callback, errorCallback){
        this.execute(
            'SELECT LAST_INSERT_ID() as id from '+type+' LIMIT 1;', //WTF do I have to set LIMIT 1 here (node-driver hell)?!?!?!?!
            function(results){
                if(callback) callback(results[0]['id']);
            },
            errorCallback
        );
    },
    buildPredicate: function(predicate){
        
    },
    performSearch : function(type, predicate, callback, errorCallback){
        var query = '';
        if(typeOf(predicate) == 'string'){ //raw sql
            query = search;
        }else{ // json based search object
            if(!type) new Error('Search has no type!');
            var query = 'SELECT * FROM '+type
            var discriminants;
            //more
        }
        this.execute(query, callback, errorCallback);
    },
    escape: function(value){
        return this.connection.escape(value);
    },
    execute: function(query, callback, errorCallback){
        this.connection.query(query, function(error, results, fields){
            if(this.debug) console.log('['+AsciiArt.ansiCodes('Query', 'blue')+']:'+query);
            if(this.debug) console.log('['+AsciiArt.ansiCodes('Results', 'blue')+']:'+JSON.encode(results));
            this.log(query+(results && results.length?' -> {'+results.length+'}':''), 'Query');
            if(error && errorCallback) {
                errorCallback('[MySQL]'+error);
                return;
            }
            if(results == 'undefined' && errorCallback){
                errorCallback('[MySQL]'+error);
                return;
            }
            //todo: handle auto initialize
            if(this.verbose && results) this.log(JSON.encode(results), 'Results');
            if(callback) callback(results);
        }.bind(this));
    },
    load : function(object, callback, errorCallback){
        if(!object.get(object.primaryKey)){
            if(errorCallback) errorCallback('No id to load!');
            else throw('No id to load!');
            return false;
        }
        this.execute(
            'select * from '+object.options.name+' where '+object.primaryKey+' =\''+object.get(object.primaryKey)+'\'',
            function(results){
                if(!results || results.length == 0){ if(errorCallback) errorCallback('Object['+id+'] not found', errorCallback);
                }else{
                    object.data = results[0];
                    object.exists = true;
                    if(callback) callback(object.data);
                }
            }.bind(this),
            errorCallback
        );
    },
    save : function(object, callback, errorCallback){
        var now = System.dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss");
        var data = Object.merge(object.data, {
            modification_time : now
        });
        data = Object.filter(data, function(item, key){
            return Data.coreFields.contains(key) || object.fields.contains(key);
        }.bind(this));
        
        if(object.exists){
            var updates =  [];
            delete data[object.primaryKey];
            Object.each(data, function(value, key){
                updates.push(key+' = '+(typeOf(value) == 'number'?value:this.connection.escape(value)));
            }.bind(this));
            this.execute(
                'update '+object.options.name+' set '+updates.join(',')+' where '+object.primaryKey+' =\''+object.get(object.primaryKey)+'\'', 
                function(results){
                    if(callback) callback(object.data);
                }.bind(this),
                errorCallback
            );
        }else{ // new object
            data.creation_time = now;
            this.execute(
                'insert into '+object.options.name+' ('+Object.keys(data).join(', ')+') values ('+
                    Object.values(data).map(function(value){
                        return this.connection.escape(value);
                    }.bind(this)).join(',')+')', 
                function(results){
                    object.exists = true;
                    this.lastId(
                        object.options.name, 
                        function(id){
                            object.set(object.primaryKey, id);
                            object.load(
                                id, 
                                function(data){ //make sure to pick up any new data
                                    if(callback) callback(this.data);
                                }.bind(object),
                                function(error){
                                    console.log('selecterror', error);
                                }
                            );
                        }.bind(this),
                        function(error){
                            console.log('selecterror', error);
                        }
                    );
                }.bind(this),
                function(error){
                    if(errorCallback) errorCallback(error);
                    else throw(error);
                }
            );
        }
    }
});
