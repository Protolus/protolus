#!/usr/bin/env node
var argv;
var yargs = require('yargs');
var fs = require('fs');
var got = require('got');
var art = require('ascii-art');
var bower = require('bower');
var npm = require('npm');
var request = require('request');
var registryUrl = require('registry-url');
var userInfo = require('npm-user');

yargs.usage('Usage: $0 <command> [options]')
yargs
    // utility commands
    .command('init', 'initialize a new project')
    // component commands
    .command('add', 'Add a component/module.')
    .command('remove', 'Remove a component/module.')
    .command('info', 'Get info on the package.')
    // build commands
    .command('run', 'Run the application.')
    .command('build', 'Generate the assets needed to run this application.')
    .demand(0)

    .example('$0 add lodash ', 'install `lodash` into `./node_modules/lodash/`')
    .example('$0 add -t bower app-layout ', 'install Polymer WebComponent`app-layout` into `./bower_components/app-layout/`')
    .example('$0 run -e desktop -i main.js ', 'run `main.js` as a desktop application on `index.html`')
    .example('$0 build -c production.json -s application.keystore -e mobile:android -i main.js:index.html ', 'build using `production.json` config settings and signing using `application.keystore` on android mobile')
    .alias('c', 'config')
    	.nargs('c', 1)
    	.describe('c', 'config json file to load')
    .alias('s', 'sign')
    	.nargs('s', 1)
    	.describe('s', 'sign using the appropriate mechanism in this environment and the provided keyfile')
    .alias('d', 'debug')
    	.nargs('d', 0)
    	.describe('d', 'work in debug mode')
    .alias('e', 'environment')
    	.nargs('e', 1)
    	.describe('e', 'what environment to build for, of the form <environment>[:<device>]')
    .alias('i', 'interface')
        .nargs('i', 1)
        .describe('i', 'build the ui portion of the app <initializer js>[:<html root>]')
    .alias('t', 'type')
        .nargs('t', 1)
        .describe('t', 'the type of module')
    .alias('a', 'api')
    	.nargs('a', 0)
    	.describe('a', 'build the api portion of the app using the provided script')
    .alias('D', 'dependencies')
    	.nargs('D', 0)
    	.describe('D', 'also add dependencies to the main index')
    .help('h')
    .alias('h', 'help')
    .epilog('©2017 - Abbey Hawk Sparrow');
    //todo: support manual insertion of
argv = yargs.argv;
var action = argv._.shift();
var target = argv._.pop();
var ftp;
var request;

var info;
var email;
var username;
var executeIfReady = function(){};
var generateBlankElectronProject = function(){};

// I am aware my liberal use of sync functions is terrible
// this will be corrected in a future version.

function silentModuleInstall(name, cb){
    npm.load(function(err){
        console._stdout = { write : function () {} };
        npm.commands.install(
            Array.isArray(name)?name:[name],
            function(err, installed, deps) {
                console._stdout = process.stdout;
                var results = installed.map(function(item){
                    return {
                        name : item[0],
                        location : item[1],
                        deps : deps[0]
                    };
                })
                cb(err, err?undefined:results);
            }
        );
    });
}

function marker(label){
    return new RegExp(' *<!-- *\\['+label+'\\] *-->', 'g');
}

function markerText(label){
    return '<!-- ['+label+'] -->';
}

function modifyPackageJson(cb){
    modifyFile('./package.json', function(err, body, save){
        if(err) return cb(err);
        cb(undefined, JSON.parse(body), function(incoming){
            return save(JSON.stringify(
                incoming, undefined, '     '
            ));
        }, function(path){
            var parts = path.split('.');
            var root = parts;
            parts.pop(); //don't assign a leaf
            parts.forEach(function(name){
                if(!root[name]) root[name] = {};
                root = root[name];
            });
        });
    });
}

function modifyFile(name, cb){
    try{
        var body = fs.readFileSync(name).toString();
        cb(undefined, body, function(incoming){
            fs.writeFileSync(name, incoming);
        }, function(body, regex, replacement){
            var test = (typeof regex === 'string')?new RegExp(regex, 'g'):regex;
            var value =  body.replace(test, replacement);
            return value;
        });
    }catch(ex){
        cb(ex);
    }
}

//add import to html root
var addLibrary = function(pkg, mkrText, root, rel, filter){
    var items = Array.isArray(pkg.main)?pkg.main:[pkg.main];
    var pages = filter?items.filter(function(item){
        return item.indexOf(filter) !== -1;
    }):items;
    pages.forEach(function(loc){
        var page = loc;
        while(page.indexOf('/./') !== -1){
            page = loc.replace( '/./', '/' );
        }
        if(page.indexOf('./') === 0) page = page.substring(2);
        modifyFile('./index.html', function(err, body, save, replace){
            var newBody = replace(
                body,
                marker(mkrText),
                '      <link rel="'+rel+'" '+
                    'href="'+root+'/'+pkg.name+'/'+page+'">'+
                    "\n      "+markerText(mkrText)
            );
            save(newBody);
        });
    });
}

var ex = (function(){
    switch(action){
    	case 'init':
            //init
            if(
                (!fs.existsSync('./interface.js')) &&
                (!fs.existsSync('./api.js')) &&
                (!fs.existsSync('./package.json')) &&
                (!fs.existsSync('./bower.json')) &&
                (!fs.existsSync('./README.md'))
            ){
                if(!target){
                    //global init... init the project
                    npm.load(function(err){
                        npm.commands.whoami(function(err, user) {
                            username = user;
                            userInfo(user).then(function(user){
                            	info = user;
                                executeIfReady();
                            });
                            var url = `${registryUrl()}-/user/org.couchdb.user:${user}`
                            got(url, {json: true}).then(function(res){
                                email = res.body.email;
                                executeIfReady();
                            }).catch(function(err){
                    			if(err && err.statusCode === 404){
                    				throw new Error(`User ${user} doesn't exist`);
                    			}
                    			throw err;
                    		});
                        });
                    });
                }else{
                    if(target) throw new Error('cannot initialize a submodule until project is initialized');
                }
            }else{
                switch(target){
                    case 'mobile':
                        //setup cordova
                    case 'mobile:android':
                        //setup cordova android

                        if(target === "mobile:android") break;
                    case 'mobile:ios':
                        //setup cordova ios

                        if(target === "mobile:ios") break;
                    case 'mobile-trap': break;
                    case 'desktop': //setup electron inside the project
                        console.log('Protolus initializing desktop environment.');
                        silentModuleInstall([
                            'electron', 'babel-register'
                        ], function(err, results){
                            fs.writeFileSync(
                                './electron.js',
                                generateBlankElectronProject()
                            );
                            var installed = results.map(function(item){
                                return item.name;
                            }).join(", ")
                            modifyPackageJson(function(pkgerr, data, save, ensure){
                                if(!err){
                                    console.log(
                                        'Protolus installed '+
                                        art.style(installed, 'green', true)
                                    );
                                }else{
                                    console.log(
                                        'Protolus failed to install electron\n'+
                                        art.style(err.message, 'red', true)
                                    );
                                }
                                if(pkgerr) throw pkgerr;
                                ensure('scripts.desktop');
                                data.scripts.desktop = "electron electron.js";
                                save(data);
                                console.log(
                                    '    execute '+
                                    art.style('npm desktop', 'green', true)+
                                    ' to run.'
                                );
                            });
                        });
                        break;
                    default:
                        if(!target) throw new Error('target required for "info"!');

                        break;
                }
            }
    		break;
        case 'add':
        case 'remove':
        case 'info':
            var type = 'npm';
            if(target.indexOf('/') !== -1){
                if(target.indexOf('/') === target.lastIndexOf('/')){ //just one
                    type = 'bower'
                }else{
                    throw new Error('other protocols not yet implemented')
                }
            }
            if(argv.t) type = argv.t;


            switch(action){
                case 'add':
                    if(!target) throw new Error('target required for "add"!');
                    var processDependencies = !!argv.D;
                    console.log(
                        'Installing '+art.style(type, 'green', true)+
                            ' module '+art.style(target, 'green', true)
                    );
                    switch(type){
                        case 'npm':
                            silentModuleInstall(target, function(err, result){
                                var pkg = require(process.cwd()+'/node_modules/'+target+'/package.json');
                                var addNpm = function(dep){
                                    var pkg = require(process.cwd()+'/node_modules/'+dep+'/package.json');
                                    return addLibrary(
                                        pkg,
                                        'END LOGIC',
                                        'bower_components',
                                        'text/javascript'
                                    );
                                }
                                if(processDependencies){
                                    //todo: multilevel
                                    Object.keys(pkg.dependencies).forEach(function(dep){
                                        addNpm(dep);
                                    });
                                }
                                addNpm(target);
                            });
                            break;
                        case 'bower':
                            var parts = target.split('/');
                            var n = parts.pop();
                            bower.commands.install([
                                n
                            ], { save: true }).on('end', function(installed){
                                var addBower = function(libname){
                                    return addLibrary(
                                        installed[libname].pkgMeta,
                                        'END COMPONENTS',
                                        'bower_components',
                                        'import',
                                        '.html'
                                    );
                                }
                                if(processDependencies){
                                    Object.keys(installed).forEach(addBower);
                                }else{
                                    addBower(n);
                                }
                            }).on('error', function(err){

                            });
                            break;
                        default : throw new Error('unrecognized target: '+target)
                    }
                    break;
                case 'remove':
                    if(!target) throw new Error('target required for "remove"!');

                    break;
                case 'info':
                    if(!target) throw new Error('target required for "info"!');

                    break;
            }
            //components
            break;
        case 'run':
        case 'build':
            //build
            console.log(argv);
            break;
        case 'use':
            var type;
            var location;
            var parts = target.split('/');
            var pred = target.split('/');
            pred.shift();
            var position;
            if(fs.existsSync('./node_modules/'+parts[0])){
                var pkg = require('./node_modules/'+parts[0]+'/package.json');
                //todo: check for html files in .main
                location = package;
                if(location) type = 'npm';
                position = 'END LOGIC';
            }else{
                if(fs.existsSync('./bower_components/'+parts[0])){
                    if(fs.existsSync(
                        './bower_components/'+target+'/'+parts[parts.length-1]+'.html'
                    )){
                        location = {
                            name: parts[0],
                            main: parts[parts.length-1]+'/'+parts[parts.length-1]+'.html'
                        };
                        position = 'END COMPONENTS';
                    }
                    if(fs.existsSync(
                        './bower_components/'+target+'.html'
                    )){
                        location = {
                            name: parts[0],
                            main: pred.join('/')+'.html'
                        };
                        position = 'END COMPONENTS';
                    }
                    if(fs.existsSync(
                        './bower_components/'+target+'/'+parts[parts.length-1]+'.js'
                    )){
                        location = {
                            name: parts[0],
                            main:parts[parts.length-1]+'.js'
                        };
                        position = 'END LOGIC';
                    }
                    if(location) type = 'bower';
                }
            }
            if(!type) throw new Error('module '+parts[0]+' not found!');
            addLibrary(
                location,
                position,
                (type === 'npm'?'node_modules':'bower_components'),
                (position === 'END LOGIC'?'text/javascript':'import')
            );
            break;
        default : throw new Error('unknown action: '+action);
    }
});

var Protolus = {};

Protolus.UI = function(){

};

Protolus.API = function(){

};

executeIfReady = function(){
    if(info && email && username){
        //todo: see if we're in a git repo, if so ... hook in
        var enclosingDirName = process.cwd().split("/").pop();
        fs.writeFileSync(
            './package.json',
            JSON.stringify({
                "name": enclosingDirName,
                "version": "0.0.1",
                "main": "index.js",
                "description": "Protolus Application",
                "keywords": [],
                "author": {
                    "name": username,
                    "email": email,
                    "url": info.homepage
                },
                "contributors": [],
                "scripts": {
                    "browser": "proto run -i interface.js:index.html -e browser"
                },
                "license": "proprietary",
                "private": true,
                "dependencies": {
                    "protolus": "*"
                },
                "engines": {
                    "node": "*"
                }
            }, undefined, '    ')
        );
        fs.writeFileSync(
            './main.js',
            '//Protolus AutoRunner' + "\n"+
            'var Protolus = require(\'protolus\');' + "\n"+
            'var application = new Protolus.UI(' + "\n"+
            '    \'interface.js\', \'index.html\'' + "\n"+
            ');' + "\n"+
            'var api = new Protolus.API(\'api.js\');' + "\n"+
            'application.connect(api);' + "\n"+
            'application.start();' + "\n"
        );
        fs.writeFileSync(
            './interface.js',
            '// This file is for the application UI'
        );

        fs.writeFileSync(
            './api.js',
            '// This file is for application data'
        );
        fs.writeFileSync(
            './index.html',
            '<!DOCTYPE html>' + "\n" +
            '<html>' + "\n" +
            '    <head>' + "\n" +
            '        <meta charset="UTF-8">' + "\n" +
            '        <title>'+enclosingDirName+'</title>' + "\n" +
            '        <!-- [END COMPONENTS] -->' + "\n" +
            '    </head>' + "\n" +
            '    <body>' + "\n" +
            '        <!-- [END LOGIC] -->' + "\n" +
            '        <script src="interface.js"></script>' + "\n" +
            '  </body>' + "\n" +
            '</html>' + "\n"
        );
    }
}

generateBlankElectronProject = function(){
    return "\"use strict\";\n\n"+
    "require('babel-register');\n\n"+
    "var electron = require('electron');\n"+
    "var app = electron.app;\n"+
    "var BrowserWindow = electron.BrowserWindow;\n\n"+
    "var mainWindow = null;\n\n"+
    "app.on('window-all-closed', function(){\n"+
    "    if(process.platform !== 'darwin') app.quit();\n"+
    "});\n\n"+
    "app.on('ready', function(){\n"+
    "    mainWindow = new BrowserWindow({width: 800, height: 600});\n"+
    "    mainWindow.loadURL('file://' + __dirname + '/index.html');\n"+
    "    mainWindow.webContents.openDevTools();\n\n"+
    "    mainWindow.on('closed', function(){\n"+
    "        mainWindow = null;\n"+
    "    });\n\n"+
    "});\n";
}

ex();

module.exports = Protolus;
