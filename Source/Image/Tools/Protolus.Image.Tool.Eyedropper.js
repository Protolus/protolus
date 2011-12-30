Protolus.Image.Tool.Eyedropper = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'eyedropper';
    },
    paint: function(brush, pixels, x, y){
        var pos = ((y*(pixels.width*4)) + (x*4));
        Protolus.Image.Booth.foreground = rgb2hex(pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]);
        if(Protolus.Image.Booth.gui) Protolus.Image.Booth.gui.repaintColors();
        return pixels;
    },
});