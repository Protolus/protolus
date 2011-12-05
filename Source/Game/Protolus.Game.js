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
if(!Midas) var Midas = {};
Midas.Game = {};

Midas.startGame = function(){
    var board = new Midas.Game.Board('game_panel');
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
    var loader = new Midas.Game.Board.XMLLoader(board);
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
    var game = new Midas.Game(conquest, board, gui);
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
    game.start([new Midas.Game.Player(), new Midas.Game.Player()]);
};

// Game Logic
Midas.Game = new Class({
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
Midas.Game.ListenerRegistry = new Class({
    listenerRegistry : {},
    addEvent : function(eventType, listenerFunction){
        if(!this.listenerRegistry[eventType]) this.listenerRegistry[eventType] = [];
        this.listenerRegistry[eventType].push(listenerFunction);
    },
    trigger : function(eventType){
        if(this.listenerRegistry[eventType]){
            this.listenerRegistry[eventType].each(function(listenerCallback){
                listenerCallback();
            }.bind(this));
        }
    }
});
Midas.Game.GUI = new Class({
    show : function(id){
    
    },
    hide : function(id){
    
    }
});
Midas.Game.Player = new Class({
    Implements : Midas.Game.ListenerRegistry,
    sendMessage : function(text){
        
    },
});
Midas.Game.Phase = new Class({
    implements : Midas.Game.ListenerRegistry,
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
Midas.Game.Rules = new Class({
    Extends : Midas.Game.Phase,
    initialize : function(mode, maxPlayers, minPlayers, gui){
        this.gui = gui;
    },
    play : function(players, board){
        
    }
});

// Game Board

Midas.Game.Board = new Class({
    Implements : Midas.Game.ListenerRegistry,
    cells: [],
    markers: [],
    units: [],
    panel: null,
    cellSelectionCallback: null,
    initialize: function(identifier){
        this.panel = Raphael(identifier, 1000, 600);
    },
    addCell: function(cell){
        this.cells.push(cell);
    },
    removeCell: function(identifier){
    
    },
    getCell: function(name){
        this.cells.each(function(cell, index){
            if(cell.getAttribute('name') === name){
                return cell;
            }
        });
        return null;
    }
});

Midas.Game.Board.Loader = new Class({
    board : null,
    cells : null,
    initialize : function(board){
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
    }
});

Midas.Game.Board.Item = new Class({
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

Midas.Game.Board.Cell = new Class({
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

// Utilities
Midas.Game.CardHand = new Class({
    cards : [],
    initialize : function(deck, cards){
    
    },
    add : function(card){
    
    },
    remove : function(card){
    
    },
    addListener : function(listener){
    
    },
});

Midas.Game.CardDeck = new Class({
    cards : [],
    library : [],
    graveyard : [],
    initialize : function(deck){
    
    },
    shuffle : function(){
        //todo: randomize library cards
    },
    addListener : function(listener){
    
    },
});

Midas.Game.Card = new Class({
    addListener : function(listener){
    
    },
    is : function(verb){ // is tapped, turned, marked, etc..
    
    },
    get : function(){
    
    }
});

Midas.Game.Dice = new Class({
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

// Loader Implementations:

Midas.Game.Board.XMLLoader = new Class({
    Extends : Midas.SAXParser,
    Implements : [Midas.Game.Board.Loader],
    initialize : function(board){
        this.parent();
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
        var loader = new Request({
            url : uri,
            onSuccess : function(requestData){
                this.parse(requestData);
                this.board.cells.each(function(cell){
                    cell.create(this.board.panel);
                }, this);
                this.board.trigger('load');
            }.bind(this)
        }).send();
    },
    open: function(tag, attributes){
        if(tag == "territory"){
            //when we find a path, draw it on the raphael canvas
            var cell = new Midas.Game.Board.Cell(this.board);
            cell.attributes = attributes;
            this.board.addCell(cell);
        }
    }
});

Midas.Game.Board.JSONLoader = new Class({
    Extends : Midas.Game.Board.Loader,
    initialize : function(board){
        this.parent();
        this.board = board;
    },
    load : function(uri, options){
        console.log('loading '+uri);
        var loader = new Request.JSON({
            url : uri,
            onSuccess : function(data){
                this.board.cells.each(function(cell){
                    cell.create(this.board.panel);
                }, this);
                this.board.trigger('load');
            }.bind(this)
        }).send();
    }
});