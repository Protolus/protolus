Protolus.Image.Tool.Eyedropper = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'eyedropper';
    },
    paint: function(brush, pixels, x, y){
        var pos = ((y*(pixels.width*4)) + (x*4));
        ImageBooth.foreground = rgb2hex(pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]);
        if(ImageBooth.gui) ImageBooth.gui.repaintColors();
        return pixels;
    },
});