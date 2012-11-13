// a thin wrapper so we can swap out implementations
var JavascriptParser = new Class({
    initialize :function(){
        
    },
    parse : function(code){
        JSLINT(code);
        var parseTree = JSLINT.tree.first;
        return parseTree;
    }
});