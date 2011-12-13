Protolus.Image.Brush.5pxRound = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '5px_round';
    },
    brush : [
        [000, 120, 255, 120, 000],
        [120, 255, 255, 255, 120],
        [255, 255, 255, 255, 255],
        [120, 255, 255, 255, 120],
        [000, 120, 255, 120, 000],
    ]
});