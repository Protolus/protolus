Protolus.Image.Operation = new Class({
    name : function(){
        return '';
    },
    operate: function(pixels, controls){
        //this is the key method to override
    },
    getControls : function(){
        return {};
    },
    getLabel : function(){
        return this.name();
    }
});