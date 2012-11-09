Protolus.Image.Operation.Negative = new Class({
    Extends: Protolus.Image.Operation,
    name : function(){
        return 'negative';
    },
    getLabel : function(){
        return 'Negative';
    },
    operate: function(pixels, controls){
        Protolus.Image.Booth.convolveBuffer.setProperty('width', pixels.width);
        Protolus.Image.Booth.convolveBuffer.setProperty('height', pixels.height);
        var context = Protolus.Image.Booth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                newPixels.data[((y*(sx*4)) + (x*4))    ] = 255 - pixels.data[((y*(sx*4)) + (x*4))    ];
                newPixels.data[((y*(sx*4)) + (x*4)) + 1] = 255 - pixels.data[((y*(sx*4)) + (x*4)) + 1];
                newPixels.data[((y*(sx*4)) + (x*4)) + 2] = 255 - pixels.data[((y*(sx*4)) + (x*4)) + 2];
                newPixels.data[((y*(sx*4)) + (x*4)) + 3] = pixels.data[((y*(sx*4)) + (x*4)) + 3];
            }
        }
        return newPixels;
    },
    getControls : function(){
        return [];
    }
});