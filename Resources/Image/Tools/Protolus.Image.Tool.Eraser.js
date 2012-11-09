Protolus.Image.Tool.Eraser = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'eraser';
    },
    paint: function(brush, pixels, x, y){
        //TODO: implement transparent layer erasing
        //the following numbers are reflections across the value scale
        var transparency = 0;
        var opaquness = 255 - transparency;
        // turn it into a ratio
        if(transparency != 0) transparency =  (transparency) / 255.0;
        if(opaquness != 0) opaquness = ( opaquness) / 255.0;
        var color = Protolus.Image.Booth.decodeHex(Protolus.Image.Booth.background);
        var brush = brush;
        //reset X/Y for the brush size
        var sx = pixels.width;
        var sy = pixels.height;
        //offset by half the brush size so the brush centers on the cursor
        x = x - Math.round(brush.length/2);
        y = y - Math.round(brush[0].length/2);
        var brushx, brushy;
        var pos, old_mult, new_mult;
        for(var ypos = y; ypos < y + brush[0].length; ypos++){
            brushy = ypos - y;
            for(xpos = x; xpos < x + brush.length; xpos++){
                brushx = xpos - x;
                if(opaquness != 0){
                    pos = ((ypos*(sx*4)) + (xpos*4));
                    if(transparency != 0 || brush[brushx][brushy] != 255){ //is the overall paint at 100% opaqueness? is this portion of the brush an opaque pixel?
                        //we need to composite the 2 pixels
                        old_mult = (transparency == 0)? brush[brushx][brushy]/255 : transparency * brush[brushx][brushy]/255;
                        new_mult = opaquness * (255 - brush[brushx][brushy])/255;
                        pixels.data[pos    ] = (new_mult * pixels.data[pos    ]) + (old_mult * color[0]);
                        pixels.data[pos + 1] = (new_mult * pixels.data[pos + 1]) + (old_mult * color[1]);
                        pixels.data[pos + 2] = (new_mult * pixels.data[pos + 2]) + (old_mult * color[2]);
                        pixels.data[pos + 3] = Math.max(pixels.data[pos + 3], brush[brushx][brushy]);
                    }else{ //draw in the opaque pixel
                        pixels.data[pos    ] = brush[brushx][brushy]/255 * color[0];
                        pixels.data[pos + 1] = brush[brushx][brushy]/255 * color[1];
                        pixels.data[pos + 2] = brush[brushx][brushy]/255 * color[2];
                        pixels.data[pos + 3] = brush[brushx][brushy];
                    }
                } // if we fail this test, we don't need to draw this pixel, it's the same as the old one
            }
        }
        return pixels;
    },
});