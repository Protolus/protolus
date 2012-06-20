new Class({
    Extends : Data,
    initialize : function(options){
        if(typeOf(options) == 'string') options = {key:options};
        if(!options) options = {};
        options.datasource = 'database';
        options.name = 'api_token';
        this.fields = [
            'token',
            'type',
            'verbose',
            'api_key'
        ];
        this.primaryKey = 'id';
        this.parent(options);
        if(options.key) this.load(options.key);
    }
});

