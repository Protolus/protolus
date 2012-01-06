Protolus.Game.Dice = new Class({
    roll : function(number, sides){
        if(is_array(number)){
            var results = [];
            number.each(function(roll){
                results.push(GameDice.roll(roll[0], roll[1]));
            });
        }else{
            if(number == null) number = 1;
            if(sides == null) sides = 6;
            results = [];
            for(var lcv=0; lcv<number; lcv++){
                results.push(1 + Math.floor(Math.random()*(sides)));
            }
            if(results.length == 1) return results[0];
            return results;
        }
    }
});