Protolus.Game.Board.XMLLoader = new Class({
    Extends : Protolus.SAXParser,
    Implements : [Protolus.Game.Board.Loader],
    initialize : function(board){
        this.parent();
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
        var loader = new Request({
            url : uri,
            onSuccess : function(requestData){
                this.parse(requestData);
                this.board.cells.each(function(cell){
                    cell.create(this.board.panel);
                }, this);
                this.board.trigger('load');
            }.bind(this)
        }).send();
    },
    open: function(tag, attributes){
        if(tag == "territory"){
            //when we find a path, draw it on the raphael canvas
            var cell = new Protolus.Game.Board.Cell(this.board);
            cell.attributes = attributes;
            this.board.addCell(cell);
        }
    }
});