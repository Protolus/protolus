Protolus.Image = new Class({
    height: null,
    width : null,
    window : null,
    currentLayer : null,
    layers: [],
    layerNumber : 1,
    initialize: function(){
        //check if it's an image, if so... swap, or edit.
        this.layers = [];
        this.buffer = new Element('canvas');
        //$ = old$;
    },
    getWidth: function(){
        return this.width;
    },
    getHeight: function(){
        return this.height;
    },
    newLayer : function(image){
        if(image != null){
            if(this.layers.length == 0){ //we're adding the first one, so we need to size the buffer
                //todo: add explicit sizing check
                this.buffer.setProperty('width', image.width);
                this.buffer.setProperty('height', image.height);
            }
            if(this.height == null || this.width == null){
                this.height = image.height;
                this.width = image.width;
                if(this.window != null){
                    this.window.setSize(this.getWidth() + 6, this.getHeight() + 53);
                    this.window.positionAtCenter();
                }
            }
            
            var result = new Protolus.Layer(image, this);
            this.layers.push(result);
            this.repaint();
            this.currentLayer = result;
            this.lastImage = image;
            this.buffer.fireEvent('createlayer');
            return result;
        }else{
            if(this.height && this.width){
                var result = new ImBo_Layer(this.lastImage, this);
                this.layers.push(result);
                this.repaint();
                this.currentLayer = result;
                this.buffer.fireEvent('createlayer');
                return result;
            }
        }
    },
    repaint : function(){
        var result = null;
        var context = this.buffer.getContext('2d');
        this.layers.each(function(layer){
            if(layer.show){
                if(result != null){
                    result = Protolus.Image.Booth.merge(layer.pixels, result, context);
                }else{
                    result = layer.pixels;
                }
            }
        });
        if(result != null) context.putImageData(result, 0, 0);
    },
    hex : function(){
        return this.currentLayer.hex();
    },
    png : function(){
        return this.currentLayer.png();
    }
});