Protolus.Game.Board.Item = new Class({
    panel: null,
    image: null,
    icon: null,
    create: function(panel, x, y){
        if(this.icon != null){
            this.image = panel.image(this.icon, x, y);
        }
    },
    hide: function(){
        this.image.hide();
    },
    show: function(){
        this.image.show();
    }
});