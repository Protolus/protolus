Protolus.Image.Filter.Emboss = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Emboss';
    },
    emboss_a_matrix : [
        [  2.0,  0.0,  0.0  ],
        [  0.0, -1.0,  0.0 ],
        [  0.0,  0.0, -1.0  ]
    ],
    emboss_b_matrix : [
        [  0.0, 0.0,  0.0  ],
        [  0.0, 1.0,  0.0 ],
        [  0.0, 0.0, -1.0  ]
    ],
    name : function(){
        return 'emboss';
    },
    filter: function(pixels, controls){
        if(controls.type == 'a') return Protolus.Image.Booth.convolve(pixels, this.emboss_a_matrix, controls.amount, controls.threshold);
        if(controls.type == 'b') return Protolus.Image.Booth.convolve(pixels, this.emboss_b_matrix, controls.amount, controls.threshold);
        return pixels;
    },
    getControls : function(){
        return {
            'type' : {
                'value' : 'a',
                'default' : 'a',
                'options' : 'a,b',
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
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