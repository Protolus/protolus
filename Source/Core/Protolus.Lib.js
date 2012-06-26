/*
---
description: Protolus RAD framework port to JS

license: MIT-style

authors:
    - Abbey Hawk Sparrow

requires:
    - core/1.2.4: '*'
    - [Midas.Smarty, Midas.INIParser, Midas.Properties]

provides: [Protolus.Lib]
...
*/

if(!Protolus) var Protolus = {};
Protolus.Application = new Class({
    Implements : Options,
    settings : {},
    configurations : {},
    datasources : {},
    mode : 'public',
    environment : false,
    options : {
        directory : 'Configuration',
        data : false
    },
    initialize : function(options, callback){
        this.setOptions(options);
        if(Protolus.isNode) this.mode = 'private';
        this.environment = this.getEnvironment('PROTOLUS_MACHINE_TYPE') || 'production';
        if(this.options.data){
            this.loadConfiguration(Protolus.configurationDirectory+'/'+this.environment+'.'+this.mode+'.json', function(){
                this.enableData(callback);
            }.bind(this));
        }
    },
    loadConfiguration : function(file, callback){
        if(Protolus.isNode){
            System.file.readFile(file,'utf8', function(err, data){
                var config = JSON.parse(data);
                this.configurations = config;
                callback(config);
            }.bind(this));
        }else{
            //todo
        }
    },
    error : function(error, type){
        console.log(error);
    },
    consoleOutput : function(){
        function ansiBox(text, color, boxColor, width){
            var halfwidth = (width-text.length-1)/2;
            var lpad = (halfwidth < 0)?'':Array(Math.floor(halfwidth)+1).join(" ");
            var rpad = (halfwidth < 0)?'':Array(Math.ceil(halfwidth)+1).join(" ");
            var message = AsciiArt.ansiCodes(text, color);
            return AsciiArt.ansiCodes('[', boxColor)+lpad+message+rpad+AsciiArt.ansiCodes(']', boxColor);
        }
        var name = this.getConfiguration('application.name');
        AsciiArt.font(name, 'Fonts/Doom', function(text){
            text.split('\n').each(function(line){
                console.log(AsciiArt.ansiCodes(line, Protolus.appColor));
            });
            var status = ansiBox(' v.'+Protolus.appVersion, 'white', 'red', 15);
            status += ansiBox(this.environment+' mode', 'white', 'red', 20);
            //status += ansiBox(foundDatasources.join(', '), 'blue', 'yellow', 40);
            console.log(status);
        }.bind(this));
    },
    enableData : function(callback){
        Protolus.require('Data', function(){
            var dbs = Object.keysThatBeginWith(this.configurations, 'DB:');
            Object.each(dbs, function(settings, name){
                settings.name = name;
                switch(settings.type){
                    case 'mysql':
                        this.datasources[name] = new MySQLDatasource(settings);
                        break;
                    case 'mongo':
                        this.datasources[name] = new MongoDatasource(settings);
                        break;
                    case 'rabbit':
                        this.datasources[name] = new RabbitDatastream(settings);
                        break;
                    default:
                        new APIError('Unsupported Type('+settings.type+')');
                }
            }.bind(this));
            if(callback) callback();
        }.bind(this));
    },
    getConfiguration : function(key){
        var result = this.configurations;
        key.split('.').each(function(part){
            if(result) result = result[part]
        });
        return result;
    },
    setConfiguration : function(key, value){
        this.configurations[key] = value;
    },
    getEnvironment : function(key){
        return process.env[key];
    }
});
