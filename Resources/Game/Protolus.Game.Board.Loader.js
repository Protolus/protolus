Protolus.Game.Board.Loader = new Class({
    board : null,
    cells : null,
    initialize : function(board){
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
    }
});