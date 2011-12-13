Protolus.Image.Filter.LaplacianFilter = new Class({
    Extends : Protolus.Image.Filter,
    laplacian_matrix : [
        [   0.0, -1.0, 0.0  ],
        [  -1.0, 4.0, -1.0 ],
        [  0.0, -1.0, 0.0  ]
    ],
    laplacian_matrix2 : [
        [   -1.0, -1.0, -1.0  ],
        [  -1.0, 8.0, -1.0 ],
        [  -1.0, -1.0, -1.0  ]
    ],
    name : function(){
        return 'gradient_detect';
    },
    getLabel : function(){
        return 'Gradient Detector';
    },
    filter: function(pixels, controls){
        var resultA = ImageBooth.performConvolution(pixels, this.laplacian_matrix, 2);
        var resultB = ImageBooth.performConvolution(pixels, this.laplacian_matrix2, 2);
        return ImageBooth.merge(resultA, resultB, 'lighten');
    },
    getControls : function(){
        return [];
    }
});