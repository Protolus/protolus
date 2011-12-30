Protolus.Image.Filter.GaussianBlur = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Gaussian Blur';
    },
    /*gaussianMatrix : [
        [ 1.0, 2.0, 1.0 ],
        [ 2.0, 4.0, 2.0 ],
        [ 1.0, 2.0, 1.0 ]
    ],*/
    /*gaussianMatrix : [
        [  1,  4,  7,  4,  1 ],
        [  4, 16, 26, 16,  4 ],
        [  7, 26, 41, 26,  7 ],
        [  4, 16, 26, 16,  4 ],
        [  1,  4,  7,  4,  1 ]
    ],*/
    matrix : function(x, y){
        var matrix = [];
        var row;
        var o = 0.84089642;
        //if(x > 6 * o) x = Math.ceil(6 * o);
        //if(y > 6 * o) y = Math.ceil(6 * o);
        var sum = 0;
        var count = 0;
        for(var ypos = 0; ypos < y; ypos++){
            row = [];
            var value;
            for(var xpos = 0; xpos < x; xpos++){
                value = ( 1 / (2 * Math.PI * (o^2) ) ) *
                    (Math.E^( ((x^2)+(y^2)) / (2 * (o^2)) ));
                row.push( 
                    value
                );
                sum += value
                count++;
            }
            matrix.push(row);
        }
        var avg = sum / count;
        //*
        for(var ypos = 0; ypos < y; ypos++){
            for(var xpos = 0; xpos < x; xpos++){
                matrix[ypos][xpos] = matrix[ypos][xpos]/sum;
            }
        }//*/
        return matrix;
        
    },
    name : function(){
        return 'blur';
    },
    filter: function(pixels, controls){
        //alert(profile(controls));
        var matrix = this.matrix(controls.radius, controls.radius);
        //alert(profile(matrix));
        return Protolus.Image.Booth.convolve(pixels, matrix, controls.amount, controls.threshold);
        //return Protolus.Image.Booth.performConvolution(pixels, matrix, controls.amount);
    },
    getControls : function(){
        return {
            'amount' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
            'radius' : {
                'value' : '6',
                'default' : '6',
                'upper_bound' : '12',
                'lower_bound' : '3'
            },
            'threshold' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});