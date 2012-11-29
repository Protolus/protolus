/*
---
description: Protolus RAD framework port to JS

license: MIT-style

authors:
    - Abbey Hawk Sparrow

requires:
    - core/1.2.4: '*'
    - [Midas.Smarty, Midas.INIParser, Midas.Properties]

provides: [Protolus.PageRenderer, Protolus.Panel, Protolus.Lib, Protolus.Logger, Protolus.WebApplication]
...
*/

if(!Protolus) var Protolus = {};
Protolus.PageRenderer = {
    callStack : [],
    panel_extension : '.panel.tpl',
    wrapper_extension : '.wrapper.tpl',
    template_location : '',
    compile_location : '',
    cache_location : '',
    root_location : '',
    wrapper : '',
    panel : 'protolus_root',
    oldPanel : 'protolus_root',
    wrapperRoot : null,
    time : 0,
    simpleRender : false,
    panelDefined : function(panel){
        if(Protolus.Lib.file_exists(this.template_location+panel+this.panel_extension)){
            return true;
        }
        return false;
    },
    route: function(){
        
    },
    siloForPanel: function(panel){
        
    },
    setWrapper: function(wrapperName){
        if(Protolus.PageRenderer.wrapper == ''){
            Protolus.PageRenderer.wrapper = wrapperName;
            var wrapper = new Protolus.Panel(wrapperName, true);
            var renderedWrapper = wrapper.render({content:'<div id="protolus_root"></div>'});
            var wrapperDOM = renderedWrapper.toDOM();
            var wrapperHead = wrapperDOM.getElementsByTagName('head')[0];
            //we try to clean up the head (browsers don't like this)
            for(childIndex in wrapperHead.children){
                if(wrapperHead.children[childIndex].tagName){
                    if(wrapperHead.children[childIndex].getAttribute('origin') != 'protolus'){
                        try{
                            wrapperHead.removeChild(document.scripts[childIndex]);
                        }catch(ex){
                            //console.log('error manipulating head!');
                        }
                    }
                }
            }
            for(childIndex in document.scripts){
                if(document.scripts[childIndex].tagName){
                    if(document.scripts[childIndex].getAttribute('origin') != 'protolus'){
                        try{
                            document.scripts.removeChild(document.scripts[childIndex]);
                        }catch(ex){
                            //console.log('error manipulating head!');
                        }
                    }
                }
            }
            document.head.adopt(wrapperHead.children);
            document.body.innerHTML = '';
            var wrapperBody = wrapperDOM.getElementsByTagName('body')[0];
            document.body.adopt(wrapperBody.children);
            window.fireEvent('domreload', wrapperName);
            document.fireEvent('domreload', wrapperName);
            Protolus.PageRenderer.wrapperRoot = document.id('protolus_root').parentNode;
        }else{
            if(Protolus.PageRenderer.wrapper == wrapperName){
                //console.log(['NE', Protolus.PageRenderer.wrapper, wrapperName, Protolus.PageRenderer.wrapperRoot]);
                //if(Protolus.PageRenderer.wrapperRoot) Protolus.PageRenderer.wrapperRoot.innerHTML = '<div id="protolus_root"></div>';
                return;
            }
            //if we made it here, the page needs a new wrapper, so we need to refresh
            var newURL = window.location.protocol+'//'+window.location.hostname+window.location.search+window.location.hash;
            window.location.assign(newURL);
            window.location.reload(); // we might just be changing the hash
        }
    },
    renderPage : function(panelName, options){
        var anchor = {};
        if( typeOf(options) == 'function' ) options = {
            'onSuccess':options
        };
        if(!options) options = {};
        if(!options.resources) options.resources = [];
        var panel = new Protolus.Panel(panelName, {
            wrapperSet : function(newWrapper){
                anchor.wrapper = newWrapper;
            },
            onLoad :function(panel){ //make sure panel.template is loaded
                panel.template.ensureResources(options.resources, function(){ //preload passed resources
                    panel.render(function(content){
                        if(!anchor.wrapper){
                            options.onSuccess(content);
                            return;
                        }
                        var wrapper = new Protolus.Panel(anchor.wrapper, {
                            templateMode : 'wrapper'
                        });
                        var data = Object.clone(panel.template.environment);
                        data.content = content;
                        wrapper.render(data, function(wrappedContent){
                            panel.template.loadingComplete(function(){
                                if(panel.template.requiresResources()){
                                    switch(options.scriptInclude || Protolus.defaultIncludeMode){
                                        //case undefined:
                                        case 'inline-combined':
                                            var content = {};
                                            content.wrapped = wrappedContent;
                                            panel.template.currentTargets().collect(function(target, key, emitTarget){ //each node
                                                panel.template.collectResources(target, function(resource, name, emitResource){
                                                    var count = 0;
                                                    var result = '';
                                                    resource.files('js', function(files){
                                                        if(files.length) result += '<script resources="'+name+'">'+(files.join("\n"))+'</scr'+'ipt>';
                                                        count++;
                                                        if(count == 2) emitResource(result); //complete a resource
                                                    });
                                                    resource.files('css', function(files){
                                                        if(files.length) result += '<style resources="'+name+'">'+(files.join("\n"))+'</style>';
                                                        count++;
                                                        if(count == 2) emitResource(result); //complete a resource
                                                    });
                                                }, function(resources){ //complete a target
                                                    emitTarget({
                                                        name : target,
                                                        content : resources
                                                    });
                                                });
                                            }, function(targets){ //complete all targets
                                                targets.each(function(target){
                                                    content.wrapped = content.wrapped.replace(
                                                        '<!--[['+target.name+']]-->', 
                                                        function(){ return target.content.join("\n")+'<!--[['+target.name+']]-->' }
                                                    );
                                                });
                                                options.onSuccess(content.wrapped);
                                            });
                                            break;
                                        case 'external':
                                            //*
                                            var minState = '';
                                            if(false) minState = 'min/';
                                            panel.template.currentTargets().each(function(targetName){
                                                var resources = panel.template.orderedResourcesForTarget(targetName);
                                                var locals = [];
                                                resources.each(function(name){ 
                                                    if(panel.template.directory(name) == 'App/Resources'){
                                                        resources.erase(name);
                                                        locals.push(name);
                                                    }
                                                });
                                                resources.each(function(resource){
                                                    wrappedContent = wrappedContent.replace(
                                                        '<!--[['+targetName+']]-->', 
                                                        function(){ return '<script src="/javascript/'+minState+resource+'.js"></scr'+'ipt>'+"\n"+'<!--[['+targetName+']]-->' }
                                                    );
                                                    wrappedContent = wrappedContent.replace(
                                                        '<!--[['+targetName+']]-->', 
                                                        function(){ return '<link rel="stylesheet" type="text/css" href="/style/'+minState+resource+'.css"></link>'+"\n"+'<!--[['+targetName+']]-->' }
                                                    );
                                                });
                                                if(locals.length > 0){
                                                    locals.each(function(resource){
                                                        wrappedContent = wrappedContent.replace(
                                                            '<!--[['+targetName+']]-->', 
                                                            function(){ return '<script src="/javascript/local/'+minState+resource+'.js"></scr'+'ipt>'+"\n"+'<!--[['+targetName+']]-->' }
                                                        );
                                                    });
                                                    locals.each(function(resource){
                                                        wrappedContent = wrappedContent.replace(
                                                            '<!--[['+targetName+']]-->', 
                                                            function(){ return '<link rel="stylesheet" type="text/css" href="/style/local/'+minState+resource+'.css"></link>'+"\n"+'<!--[['+targetName+']]-->' }
                                                        );
                                                    });
                                                }
                                            });
                                            options.onSuccess(wrappedContent);
                                            break;
                                        case 'external-raw':
                                        //case undefined:
                                            //*
                                            var minState = '';
                                            if(false) minState = 'min/';
                                            panel.template.currentTargets().each(function(targetName){
                                                var resources = panel.template.orderedResourcesForTarget(targetName);
                                                var locals = [];
                                                
                                                resources.each(function(name){ 
                                                    if(panel.template.directory(name) == 'App/Resources'){
                                                        resources.erase(name);
                                                        locals.push(name);
                                                    }
                                                });
                                                panel.template.eachResource(targetName, function(resource, resourceName){
                                                    resource.fileNames('js', function(names){
                                                        names.each(function(name){
                                                            wrappedContent = wrappedContent.replace(
                                                                '<!--[['+targetName+']]-->', 
                                                                function(){ return '<script src="/'+name+'"></scr'+'ipt>'+"\n"+'<!--[['+targetName+']]-->' }
                                                            );
                                                        });
                                                    });
                                                    resource.fileNames('css', function(names){
                                                        names.each(function(name){
                                                            wrappedContent = wrappedContent.replace(
                                                                '<!--[['+targetName+']]-->', 
                                                                function(){ return '<link rel="stylesheet" type="text/css" href="/'+name+'"></link>'+"\n"+'<!--[['+targetName+']]-->' }
                                                            );
                                                        });
                                                    });
                                                });
                                            });
                                            options.onSuccess(wrappedContent);
                                            break;
                                        case 'external-combined': //*/
                                            var minState = '';
                                            if(false) minState = 'min/';
                                            panel.template.currentTargets().each(function(targetName){
                                                //var resources = panel.template.resourceNames(targetName);
                                                var resources = panel.template.orderedResourcesForTarget(targetName);
                                                var locals = [];
                                                resources.each(function(name){ 
                                                    if(panel.template.directory(name) == 'App/Resources'){
                                                        resources.erase(name);
                                                        locals.push(name);
                                                    }
                                                });
                                                wrappedContent = wrappedContent.replace(
                                                    '<!--[['+targetName+']]-->', 
                                                    function(){ return '<script src="/javascript/'+minState+resources.join("-")+'"></scr'+'ipt>'+"\n"+'<!--[['+targetName+']]-->' }
                                                );
                                                wrappedContent = wrappedContent.replace(
                                                    '<!--[['+targetName+']]-->', 
                                                    function(){ return '<style src="/style/'+minState+resources.join("-")+'"></style>'+"\n"+'<!--[['+targetName+']]-->' }
                                                );
                                                if(locals.length > 0){
                                                    wrappedContent = wrappedContent.replace(
                                                        '<!--[['+targetName+']]-->', 
                                                        function(){ return '<link src="/javascript/local/'+minState+locals.join("-")+'"></link>'+"\n"+'<!--[['+targetName+']]-->' }
                                                    );
                                                    wrappedContent = wrappedContent.replace(
                                                        '<!--[['+targetName+']]-->', 
                                                        function(){ return '<link src="/style/local/'+minState+locals.join("-")+'"></link>'+"\n"+'<!--[['+targetName+']]-->' }
                                                    );
                                                }
                                            });
                                            options.onSuccess(wrappedContent);
                                            break;
                                    }
                                }else{
                                    options.onSuccess(wrappedContent);
                                }
                            });
                        });
                    });
                }, 'App/Resources');
            }
        });
        
        
    },
    render : function(panelName, callback, options){
        if(!options) options = {};
        var data = options.data || {};
        var panel = new Protolus.Panel(panelName, {
            onLoad :function(panel){ 
                panel.render(data, function(result){
                    callback(result);
                });
            }
        });
    }
    /*render: function(template, data, target, attrs){
        Protolus.PageRenderer.time = (new Date()).getTime();
        Protolus.PageRenderer.oldPanel = Protolus.PageRenderer.panel;
        Protolus.PageRenderer.panel = template;
        if(target) window.location.hash='#'+template;
        if(!attrs) attrs = {};
        var panel = new Protolus.Panel(template);
        if(!target) target = Protolus.PageRenderer.oldPanel;
        return panel.render(data, Protolus.PageRenderer.oldPanel, attrs);
    },
    render_panel: function(panel_name, data){
        if(panel_name.split("\n").length > 1){
            Protolus.Lib.render_panel(data, target, this, attrs, immediate);
        }else{
            var renderValue = Protolus.PageRenderer.simpleRender;
            Protolus.PageRenderer.simpleRender = true;
            var panel = new Protolus.Panel(panel_name);
            var result = panel.render(data, true);
            Protolus.PageRenderer.simpleRender = renderValue;
            return result;
        }
    }*/
};