Protolus.Game.Board.JSONLoader = new Class({
    Extends : Midas.Game.Board.Loader,
    initialize : function(board){
        this.parent();
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
        var loader = new Request.JSON({
            url : uri,
            onSuccess : function(data){
                this.board.cells.each(function(cell){
                    cell.create(this.board.panel);
                }, this);
                this.board.trigger('load');
            }.bind(this)
        }).send();
    }
});