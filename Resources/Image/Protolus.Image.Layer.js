Protolus.Image.Layer = new Class({
    layer_signature : true,
    last_x : null,
    last_y : null,
    painting : false,
    name : 'Layer',
    show : true,
    initialize : function(img, image){
        if(img.nodeName && img.nodeName.toLowerCase() == 'img') this.image = img;
        this.parentImage = image;
        this.name = 'Layer '+(image.layerNumber++);
        this.buffer = new Element('canvas', { //the internal drawing buffer
            'width': img.width,
            'height': img.height
        });
        this.context2d = this.buffer.getContext('2d');
        if(img.nodeName && img.nodeName.toLowerCase() == 'img'){
            this.context2d.drawImage(this.image,0,0);
            this.pixels = this.context2d.getImageData(0,0, img.width, img.height);
        }else{
            //clear canvas
            var data = this.context2d.getImageData(0,0, img.width, img.height)
            for(var ypos = 0; ypos < img.height; ypos++){
                for(xpos = 0; xpos < img.width; xpos++){
                        pos = ((ypos*(img.width*4)) + (xpos*4));
                        data.data[pos + 3] = 0;
                }
            }
            this.pixels = data;
        }
        //TODO: we need to handle cross domain security here
        //netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        //what for webkit?
        //this.pixels = this.context2d.getImageData(0,0, img.width, img.height);
        //img.setStyle('display','none');
    },
    filter : function(name, controls){
        var filteredPixels = Protolus.Image.Booth.filter(name, this, controls);
        if(filteredPixels) this.drawOnto(filteredPixels);
    },
    operate : function(name, controls){
        var pixels = Protolus.Image.Booth.operate(name, this, controls);
        if(pixels) this.drawOnto(pixels);
    },
    brush : function(name, x, y, controls){
        var pixels = Protolus.Image.Booth.brush(name, this.pixels, x, y, controls);
        //this.drawOnto(pixels);
        this.context2d.putImageData(pixels, 0, 0);
        this.parentImage.repaint();
    },
    hex : function(){
        return Protolus.Image.Booth.hexDump(this.pixels, this.pixels.width, this.pixels.height);
    },
    png : function(){
        return Protolus.Image.Booth.imageDump(this.buffer, 'png');
    },
    getIMG : function(){
        return Protolus.Image.Booth.imageObject(this.buffer);
    },
    strokeLine : function(name, x, y, x2, y2, controls){
        //compute the points on a line to brush
        //var dist = Math.round(Math.sqrt( (x-x2)*(x-x2) + (y-y2)*(y-y2))); //get distance in pixels
        var xdist = Math.abs(x-x2); //get distance in pixels
        var ydist = Math.abs(y-y2);
        var brush_size = Protolus.Image.Booth.brushDimensions(name);
        var avg_size = 2;
        var thisx, thisy;
        var div = 2;
        if(brush_size.x < 4 && brush_size.y < 4){
            div = 1;
        }
        if(xdist > ydist){
            var num_segments = xdist / div;
            var interval = xdist/num_segments;
            var coefficient = (y2-y)/(x2-x);
            var pixels = this.pixels;
            for(var lcv=0; lcv < num_segments; lcv++){
                thisx = x + (lcv*interval);
                thisy = Math.round(y + (thisx - x) * coefficient);
                //alert('['+thisx+', '+thisy+']');
                pixels = Protolus.Image.Booth.brush(name, pixels, thisx, thisy, controls);
                this.context2d.putImageData(pixels, 0, 0);
            }
        }else{
            var num_segments = ydist / div;
            var interval = ydist/num_segments;
            var coefficient = (x2-x)/(y2-y);
            var pixels = this.pixels;
            for(var lcv=0; lcv < num_segments; lcv++){
                thisy = y + (lcv*interval);
                thisx = Math.round(x + (thisy - y) * coefficient);
                //alert('['+thisx+', '+thisy+']');
                pixels = Protolus.Image.Booth.brush(name, pixels, thisx, thisy, controls);
                this.context2d.putImageData(pixels, 0, 0);
            }

        }
        this.parentImage.repaint();
    },
    duplicate : function(){
        
    },
    height : function(){
        this.image.height;
    },
    width : function(){
        this.image.width;
    },
    drawInto: function(canvas2DContext){
        //todo: composite, don't replace
        canvas2DContext.putImageData(this.pixels, 0, 0);
    },
    drawOnto: function(pixels){
        //duplicate the data
        for(var lcv=0; lcv < this.pixels.data.length; lcv++) this.pixels.data[lcv] = pixels.data[lcv];
        //push it all back up the render tree
        this.flush();
    },
    addFunctionLayer : function(func, parameters){
        
    },
    flush: function(){
        this.context2d.putImageData(this.pixels, 0, 0); //write pixel data back to the internal canvas
        this.parentImage.repaint(); //paint the pixels back into the parent image
    }
});