Protolus.Game.Board.Cell = new Class({
    attributes: [],
    items: [],
    shape: null,
    panel: null,
    color: null,
    board: null,
    focused: false,
    highlighted: false,
    initialize: function(board){
        this.board = board;
        this.panel = board.panel;
    },
    getAttribute: function(name){
    },
    setAttribute: function(name, value){
    },
    addItem: function(item){
        this.items.push(item);
        if(this.shape != null) item.create(this.panel, shape_box.x + (shape_box.width/2), shape_box.y + (shape_box.height/2));
    },
    details: function(show){
        if(show){
        
        }else{
        
        }
    },
    applyStyles: function(styles, transition_time){
        if(styles == 'default'){
            //todo: implement default reversion
        }
        if(!transition_time || transition_time === 0){
            this.shape.attr(styles);
        }else{
            this.shape.animate(styles, transition_time);
        }
    },
    setFocus: function(value, secondPass){
        if(secondPass){
            if(value != this.focused){
                this.focus(value);
            }
        }else{
            this.setFocus.delay(100, this, [value, true]);
        }
    },
    setHighlight: function(value, secondPass){
        if(secondPass){
            if(value != this.highlighted){
                this.highlight(value);
            }
        }else{
            this.setHighlight.delay(300, this, [value, true]);
        }
    },
    randomColor: function (gradient){
        //generate seeds
        var rseed = Math.floor(Math.random()*255);
        var gseed = Math.floor(Math.random()*255);
        var bseed = Math.floor(Math.random()*255);
        //generate the base color
        var color = "#"+this.pad(rseed.toString(16), '0', 2)+""+this.pad(gseed.toString(16), '0', 2)+""+this.pad(bseed.toString(16), '0', 2);
        if(!gradient) return color;
        //generate gradient compliment seeds
        var rseed2 = (rseed - 100) > 0?rseed - 100:0;
        var gseed2 = (gseed - 100) > 0?gseed - 100:0;
        var bseed2 = (bseed - 100) > 0?bseed - 100:0;
        //generate the secondary color
        var secondary_color = "#"+this.pad(rseed2.toString(16), '0', 2)+""+this.pad(gseed2.toString(16), '0', 2)+""+this.pad(bseed2.toString(16), '0', 2);
        return "45-"+color+"-"+secondary_color;
    },
    pad : function(value, character, length, direction){
        if(!direction) direction = 'left';
        while(value.length < length){
            if(direction == 'left') value = character + value;
            if(direction == 'right') value = value + character;
        }
        return value;
    },
    focus: function (value){
        this.focused = value;
        if(value){
            //Logger.log(this.attributes.name+' selected.');
            if(this.board.cellSelectionCallback != null) this.board.cellSelectionCallback(this);
            this.shape.animate({ scale: this.scale_factor }, 1000);
            this.text.show();
            this.shape.toFront();
            this.text.toFront();
            this.items.each(function(item){
                item.show();
            }, this);
        }else{
            //this.shape.attr({ stroke:"#000000"});
            this.shape.animate({ scale: 1.0  }, 500);
            this.text.hide();
            this.items.each(function(item){
                item.hide();
            }, this);
        }
    },
    highlight: function (value, dashvalue){
        var hadDash = true;
        if(!dashvalue && dashvalue !== "-"){
            this.highlighted = value;
            dashvalue = "--.";
            hadDash = false;
        }
        if(value && this.highlighted){
            if(!this.focused) this.shape.attr({ "stroke-dasharray":dashvalue, stroke:"#FFFFFF", "stroke-width": 1.5, fill:this.color});
            else this.shape.attr({ "stroke-dasharray": '', stroke:"#FFFFFF", "stroke-width": 1.5, fill:this.color});
            if(!hadDash){
                this.text.show();
                this.text.toFront();
                this.shape.toFront();
            }
            if(!this.focused) this.highlight.delay(200, this, [value, dashvalue == "--."? "-..":"--."]);
        }else{
            this.shape.attr({ stroke:"#000000", "stroke-dasharray":"", "stroke-width": 2, fill:"#444444"});
            this.text.hide();
        }
    },
    create: function(panel){
        this.color = this.randomColor(true);
        var color = this.color;
        var attrs = this.attributes;
        var shape = panel.path(attrs["path"]).attr({ fill:"#444444", "stroke-width": 1  });
        var shape_box = shape.getBBox();
        var text  = panel.text(shape_box.x + (shape_box.width/2), shape_box.y + (shape_box.height+40), attrs["name"]).attr({ fill:"#FFFFFF", stroke:"#111111", "stroke-width": 0.5, "font-size": "30px"}).hide();
        this.scale_factor = 5 * (1 - ( 10 * (shape_box.width/panel.width) ) );
        if (this.scale_factor < 1.5) this.scale_factor = 1.5;
        this.text = text;
        var ob = this;
        shape.node.onmouseover = function(){ ob.highlight(true) };
        shape.node.onclick = function(){ 
            ob.highlight(false); ob.highlight(true, ""); ob.focus(true);
        };
        shape.node.onmouseout = function(){ ob.focus(false); ob.highlight(false)};
        this.shape = shape;
        this.items.each(function(item){
            item.create(panel, shape_box.x + (shape_box.width/2), shape_box.y + (shape_box.height/2));
        }, this);
    }
});