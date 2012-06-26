new Class({
    Extends : Data,
    Implements : Data.Owner,
    initialize : function(options){
        if(typeOf(options) == 'string') options = {key:options};
        if(!options) options = {};
        options.datasource = 'database';
        options.name = 'user';
        this.fields = [
            'id',
            'email',
            'password',
            'company',
            'first_name',
            'last_name',
            'phone',
            'address',
            'city',
            'state',
            'zip',
            'country'
        ];
        this.permissions = true;
        this.parent(options);
        if(options.key) this.load(options.key);
    }
});

