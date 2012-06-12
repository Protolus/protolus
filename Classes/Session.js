new Class({
    Extends : Data,
    initialize : function(options){
        if(typeOf(options) == 'string') options = {key:options};
        if(!options) options = {};
        options.datasource = 'database';
        options.name = 'session';
        this.parent(options);
        this.fields = [
            'session_id',
            'data',
            'ip'
        ];
        this.primaryKey = 'session_id';
        if(options.key) this.load(options.key);
        this.set('id', Data.id('uuid'));
    }
});
