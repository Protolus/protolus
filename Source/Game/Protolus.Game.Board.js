Protolus.Game.Board = new Class({
    Implements : Protolus.Game.ListenerRegistry,
    cells: [],
    markers: [],
    units: [],
    panel: null,
    cellSelectionCallback: null,
    initialize: function(identifier){
        this.panel = Raphael(identifier, 1000, 600);
    },
    addCell: function(cell){
        this.cells.push(cell);
    },
    removeCell: function(identifier){
    
    },
    getCell: function(name){
        this.cells.each(function(cell, index){
            if(cell.getAttribute('name') === name){
                return cell;
            }
        });
        return null;
    }
});