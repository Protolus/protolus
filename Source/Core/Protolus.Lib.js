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
    options : {
        directory : 'Configuration',
        data : false
    },
    initialize : function(options, callback){
        this.setOptions(options);
        if(Protolus.isNode) this.mode = 'private';
        if(this.options.data){
            this.loadConfiguration(Protolus.configurationDirectory+'/'+this.getEnvironment('PROTOLUS_MACHINE_TYPE')+'.'+this.mode+'.json', function(){
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
    enableData : function(callback){
        Protolus.require('Data', function(){
            var dbs = Object.keysThatBeginWith(this.configurations, 'DB:');
            Object.each(dbs, function(settings, name){
                switch(settings.type){
                    case 'mysql':
                        this.datasources[name] = new MySQLDatasource({
                            host: settings.host,
                            user: settings.user,
                            password: settings.password,
                            database: settings.database,
                            name: name
                        });
                        break;
                    case 'mongo':
                        this.datasources[name] = new MongoDatasource({
                            host: settings.host,
                            user: settings.user,
                            password: settings.password,
                            database: settings.database,
                            name: name
                        });
                        break;
                    case 'rabbit':
                        this.datasources[name] = new RabbitDatastream({
                            host: settings.host,
                            user: settings.user,
                            password: settings.password,
                            database: settings.database,
                            name: name
                        });
                        break;
                    default:
                        new APIError('Unsupported Type('+settings.type+')');
                }
            }.bind(this));
            if(callback) callback();
        }.bind(this));
    },
    getConfiguration : function(key){
        return this.configurations[key];
    },
    setConfiguration : function(key, value){
        this.configurations[key] = value;
    },
    getEnvironment : function(key){
        return process.env[key];
    }
});
