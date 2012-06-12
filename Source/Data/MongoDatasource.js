this.MongoDatasource = new Class({
    Extends : Datasource,
    collections : {},
    initialize: function(options){
        //todo: support replica sets
        this.parent(options);
        this.connection = mongo.connect(this.options.host);
    },
    buildPredicate: function(predicate){
        
    },
    lastId : function(type, callback){
        
    },
    performSearch : function(type, predicate, callback, errorCallback){
        return this.performQuery(
            type, 
            predicate, 
            function(objects){
                results = [];
                objects.each( function(data) {
                    var obj = Data.new(type);
                    obj.data = data;
                    results.push(obj);
                });
                callback(results);
            },
            errorCallback
        );
    },
    performQuery : function(type, predicate, callback, errorCallback){
        if(!this.collections[type]) this.collections[type] = this.connection.collection(type);
        this.collections[type].find(predicate, function(err, objects) {
            if( err ){
                if(errorCallback) errorCallback(err);
            } else callback(objects);
        });
    },
    escape: function(value){
        return value;
    },
    save : function(object, callback, errorCallback){
        if(!this.collections[object.type]) this.collections[object.type] = this.connection.collection(object.type);
        if(object.id){
            var payload = Object.clone(object.data)
            delete payload.id;
            this.collections[object.type].update(
                { id : object.id },
                payload,
                { multi : true },
                function(err) {
                    if( err ){
                        if(errorCallback) errorCallback(err);
                    } else callback(object.data);
                });
        }else{
            this.collections[object.type].save(object.data, function(err, data){
                if( err ){
                    if(errorCallback) errorCallback(err);
                }else{    
                    object.data = data;
                    callback(data);
                }
            });
        }
    },
    load : function(id, object, callback, errorCallback){
        this.performQuery({ 
            id : id
        }, function(err, data) {
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
    
