/*
---
description: A Game Logic Framework

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.INIParser]
...
*/
Protolus.startGame = function(){
    var board = new Protolus.Game.Board('game_panel');
    board.cellSelectionCallback = function(cell){
        //Logger.log(cell);
        var inspector = document.id('inspector');
        var content = '<h2>'+cell.attributes.name+'</h2>';
        var title;
        var hasAttributes = false;
        for(index in cell.attributes){
            if(index != 'path' && index != 'name'){
                title = index.replace( /_/g , ' ').replace(/gdp/ ,'GDP').replace(/percent/ ,'%');
                title = title.substring(0, 1).toUpperCase()+title.substring(1)
                content += '<p><b>'+title+':</b> '+cell.attributes[index].replace(/\$ / ,'$')+'</p>';
                if(!hasAttributes) hasAttributes = true;
            }
        }
        if(!hasAttributes){
            content += '<p><b>No data to display</b></p>';
        }
        inspector.innerHTML = content;
    }
    var loader = new Protolus.Game.Board.XMLLoader(board);
    loader.load('WorldBoardBuilder.php');
    var controls = document.id('control_panel');
    //Logger.log('Game board load complete.');
    var WorldConquestRaphaelGUI = new Class({
        Extends : Midas.Game.GUI,
        initialize : function(){
            console.log('initializing GUI');
        },
        show : function(id){
            switch(id){
                case 'main':
                    break;
                case 'attack':
                    break;
                case 'choose':
                    break;
            }
        },
        hide : function(id){
            switch(id){
                case 'main':
                    break;
                case 'attack':
                    break;
                case 'choose':
                    break;
            }
        }
    });
    var gui = new WorldConquestRaphaelGUI();
    var game = new Protolus.Game(conquest, board, gui);
    controls.appendChild(new Element('div', {
        id: 'current_player',
        html: '-'
    }));
    controls.appendChild(new Element('input', {
        type: 'button',
        value: 'End Turn'
    }));
    controls.addEvent('click', function(){
        console.log('ewkjfekjfb');
    });
    game.start([new Protolus.Game.Player(), new Protolus.Game.Player()]);
};

// Game Logic
Protolus.Game = new Class({
    players : [],
    currentPlayerIndex : [],
    rules : null,
    running : null,
    active : true,
    initialize : function(rules, board, gui){
        this.rules = rules;
        this.board = board;
    },
    getPlayers : function(){
        return this.players;
    },
    currentPlayer : function(){
        return this.players[this.currentPlayerIndex];
    },
    nextPlayer : function(){
        if(this.players[this.currentPlayerIndex]) return this.players[this.currentPlayerIndex];
        else return null;
    },
    isActive : function(){
        return this.active;
    },
    isRunning : function(){
        return this.running;
    },
    start : function(players){
        //todo: randomize player order
        console.log('Game Started!');
        players.each(function(player){
            this.players.push(player);
        }.bind(this));
        this.rules.go(this.players, this.board);
    },
    endTurn : function(){
        this.board.complete();
    }
});