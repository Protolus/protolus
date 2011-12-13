Protolus.Image.Filter = new Class({
    name : function(){
        return '';
    },
    filter: function(layer, controls){
        //this is the key method to override
    },
    getControls : function(){
        return {};
    },
    getLabel : function(){
        return this.name();
    }
});