Protolus.Image.Filter.Sobel = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Sobel Edge Detector';
    },
    sobel_gy_matrix : [
        [  1.0,  2.0,  1.0 ],
        [  0.0,  0.0,  0.0 ],
        [ -1.0, -2.0, -1.0 ]
    ],
    sobel_gx_matrix : [
        [ -1.0, 0.0, 1.0 ],
        [ -2.0, 0.0, 2.0 ],
        [ -1.0, 0.0, 1.0 ]
    ],
    sobel_gy2_matrix : [
        [  -1.0, -2.0, -1.0 ],
        [  0.0,  0.0,  0.0 ],
        [  1.0,  2.0, 1.0 ]
    ],
    sobel_gx2_matrix : [
        [ 1.0, 0.0, -1.0 ],
        [ 2.0, 0.0, -2.0 ],
        [ 1.0, 0.0, -1.0 ]
    ],
    name : function(){
        return 'edge_detect';
    },
    filter: function(pixels, controls){
        var result;
        switch(controls.direction){
            case 'east' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gx_matrix, controls.amount, controls.threshold);
                break;
            case 'west' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gx2_matrix, controls.amount, controls.threshold);
                break;
            case 'north' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gy_matrix, controls.amount, controls.threshold);
                break;
            case 'south' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gy2_matrix, controls.amount, controls.threshold);
                break;
            default:
                result = pixels;
        }
        return result;
    },
    getControls : function(){
        return {
            'direction' : {
                'value' : 'east',
                'default' : 'east',
                'options' : 'east,west,north,south',
            },
            'amount' : {
                'value' : '10',
                'default' : '10',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});