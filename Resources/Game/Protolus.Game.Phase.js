Protolus.Game.Phase = new Class({
    implements : Protolus.Game.ListenerRegistry,
    phases : [],
    thumbprints : [],
    currentPhaseIndex : 0,
    loops : null,
    sequential : null,
    initFunc : null,
    completeFunc : null,
    id : null,
    players : null,
    player: null,
    board : null,
    start : function(player, players, board){
        console.log('start phase:');
        this.thumbprints.push('SH484HG7');
        this.thumbprints.push('IW847HF2');
        this.board.currentPhase = this;
        if(this.initFunc != null) this.initFunc(player, players, board);
        this.complete(player, players, board);
    },
    complete : function(player, players, board){
        if(!player) this.player = player;
        if(!players) this.players = players;
        if(!board) this.board = board;
        console.log('stop phase:');
        var arguments = {
            sync : this.thumbprints.join(':'),
            turn : 1,
            player : 1
        };
        var jsonRequest = new Request.JSON({
            url: 'phaseComplete.php', 
            onSuccess: function(){
                this.execute(player, players, board);
                if(this.completeFunc != null) this.completeFunc(player, players, board);
            }.bind(this)
        }).get(arguments);
        this.thumbprints = [];
    },
    go : function(players, board){
        this.start(players[0], players, board);
    },
    initialize :function(id, init, complete, isLooping, isSequential){
        this.id = id;
        this.loops = isLooping;
        this.sequential = isSequential;
        this.initFunc = init;
        this.completeFunc = complete;
    }, 
    addPhase : function(id, func, isLooping, isSequential){
        var phase = new GamePhase(id, func, null, isLooping, isSequential);
        this.phases.push(phase);
        return phase;
    },
    addPlayerPhase : function(id, initFunction, endFunction, isLooping, isSequential){
        var phase = new GamePhase(id, initFunction, endFunction, isLooping, isSequential);
        this.phases.push(phase);
        return phase;
    },
    execute : function(game){
        var currentPhase = this.phases[this.currentPhaseIndex];
        if(currentPhase.sequential){
            // we need to execute the phase once for each player
            var player;
            while(player = game.nextPlayer()){
                currentPhase.start();
            }
        }else{
            //we only do it once
            currentPhase.start();
        }
        if(!currentPhase.loops){
            this.currentPhaseIndex++;
        }
    }
});