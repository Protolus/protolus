Protolus.Image.Filter.Laplacian = new Class({
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
        var resultA = Protolus.Image.Booth.performConvolution(pixels, this.laplacian_matrix, 2);
        var resultB = Protolus.Image.Booth.performConvolution(pixels, this.laplacian_matrix2, 2);
        return Protolus.Image.Booth.merge(resultA, resultB, 'lighten');
    },
    getControls : function(){
        return [];
    }
});