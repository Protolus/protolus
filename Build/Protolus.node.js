var GLOBAL_ITEMS = function(){ var items = []; for (var key in this) items.push(key); return items; }(); (function(){
/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- Class

provides: [Request]

*/
if(!Request){
    var Request = new Class({
        options : {
            url : '',
            method : 'GET',
            data : {},
            evalScripts : false,
            evalResponse : false,
            timeout : false,
            noCache : false,
            user : false,
            password : false,
            onRequest : false,
            onLoadStart : false,
            onProgress : false,
            onComplete : false,
            onCancel : false,
            onSuccess : false,
            onFailure : false,
            onException : false
        },
        initialize : function(){
        
        },
        send : function(){
            if(this.options.onRequest) this.options.onRequest(onRequest);
            if(this.options.onLoadStart) this.options.onLoadStart(onLoadStart);
            //TODO: WTF to do about progress?
            request({
                uri: this.options.url
            }, function (error, response, bodyText) {
                if(error){
                    //todo: create error object here
                    if(this.options.onException) this.options.onException(error);
                }else{
                    if(this.options.onSuccess) this.options.onSuccess(bodyText);
                }
                if(this.options.onComplete) this.options.onSuccess(onComplete);
            }.bind(this));
        },
        getHeader : function(){},
        setHeader : function(){},
        cancel : function(){},
    });
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Element){
    //dummy DOM for server-side management
    var Element = new Class({
        children : [],
        attributes : {},
        initialize : function(name, options){
            this.tagName = name;
            this.attributes = options;
            if(name.toLowerCase() == 'canvas'){
                var Canvas = require('canvas');
                this.canvasWedge = new Canvas(150, 150);
                Object.each(this.canvasWedge, function(value, key){
                    if(typeOf(value) == 'function'){
                        this[key] = value;
                    }
                }.bind(this));
            }
        },
        appendChild : function(element){
            this.children.push(element);
        },
        appendText : function(text){
            this.children.push(text);
        },
        getChildren : function(expression){
            if(expression.substring(0, 2) == '//'){
                var results = [];
                var val = expression.substring(2);
                this.traverse(function(node){
                    if( node.tagName == val ) results.push(node);
                });
            }
        }
    });
    Element.Events = {};
}

if(!Elements) var Elements = new Class({});
if(!NodeList) var NodeList = new Class({});/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Array.copy){
    Array.implement({
        copy : function() {
            var result = [];
            this.each(function(item){
                result.push(item);
            }.bind(this));
            return result;
        }
    });
}

if(!Array.sumStrings){
    Array.implement({
        sumStrings : function(){
            var result = 0;
            this.each(function(child){
                var val = parseInt(Number.from(child));
                if(val) result += val;
            });
            return result;
        }
    });
}

if(!Array.commonBase){
    Array.implement({
        commonBase : function(legalTerminals){ //todo: support callback
            if(legalTerminals && typeOf(legalTerminals) == 'string') legalTerminals = [legalTerminals];
            var directories = this.clone();
            if(directories.length == 0) throw('empty array has no base');
            var candidate = directories.pop();
            if(candidate.lastIndexOf('/') != -1) candidate = candidate.substring(0, candidate.lastIndexOf('/'));
            directories.each(function(directory){
                if(candidate == '') return;
                if(directory.indexOf(candidate) == -1 && legalTerminals.contains(candidate.substr(candidate.length-1, 1))) return;
                else candidate = candidate.substring(0, candidate.length-1);
            });
            return candidate;
        }
    });
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
//todo: wrap with conditional
Element.Events.hashchange = {
    onAdd: function (){
        var hash = location.hash;
        var hashchange = function (){
            if (hash == location.hash) return;
            hash = location.hash;
            document.id(window).fireEvent('hashchange', hash.indexOf('#') == 0 ? hash.substr(1) : hash);
        };
        if ("onhashchange" in window) window.onhashchange = hashchange;
        else hashchange.periodical(50);
    }
};

if(!Element.diff){
    Element.implement({
        diff : function(node){
            //console.log(['diff', this, node]);
            this.childNodes.each(function(child, index){
                //console.log(['node comp', child.sameAs(node.childNodes[index])]);
            });
        }
    });
}

if(!Element.sameAs){
    Element.implement({
        sameAs : function(node, recursive){
            different = false;
            if(this.nodeName != node.nodeName) different = true;
            this.attributes.each(function(value, name){
                if(node[name] != value) different = true;
            });
            if(recursive){
                if(this.childNodes.length != node.childNodes.length) different = true;
                else this.childNodes.each(function(child, index){
                    if(!child.sameAs(node.childNodes[index])) different = true;
                });
            }
            return !different;
        }
    });
}

if(!Element.traverse){
    Element.implement({
        traverse : function(nodeFunction){
            nodeFunction(this);
            this.getChildren().each(function(child){
                child.traverse(nodeFunction);
            });
        }
    });
}

if(!Element.siblingsBefore){
    Element.implement({
        siblingsBefore : function(){
            var results = [];
            var found = false;
            this.getParent().getChildren().each(function(child){
                if(this == child) found = true;
                if(!found) results.push(child);
            });
            return new Elements(results);
        }
    });
}

if(!Element.siblingsAfter){
    Element.implement({
        siblingsAfter : function(){
            var results = [];
            var found = false;
            this.getParent().getChildren().each(function(child){
                if(found) results.push(child);
                if(this == child) found = true;
            });
            return new Elements(results);
        }
    });
}

if(!Element.aquiresStyle){
    Element.implement({
        aquiresStyle : function(name, callback){
            if(this.getStyle(name)){
                callback(this.getStyle(name));
            }else{
                this.aquiresStyle.delay(50, this, [name, callback]);
            }
        }
    });
}

if(!Element.removeElements){
    Element.implement({
        removeElements : function(elements){
            elements.each(function(element){
                if(this.contains(element)){
                    try{
                        this.removeChild(element);
                    }catch(ex){ //this means it's contained but not a direct child... recurse
                        this.getChildren().each(function(child){
                            document.id(child).removeElements(elements);
                        }.bind(this));
                    }
                }
            }.bind(this));
            return this;
        }
    });
}

if(!Element.iFrameContainsJSON){
    Element.implement({
        iFrameContainsJSON : function(callback){
            try{
                var data = JSON.decode(this.contentWindow.document.body.innerHTML);
                if(!data) throw('nope');
                try{
                    callback(data);
                }catch(ex2){
                    console.log(['error', ex2])
                }
            }catch(ex){
                this.iFrameContainsJSON.delay(50, this, [callback]);
            }
        }
    });
}

if(!Element.hasStyle){
    Element.implement({
        hasStyle : function(name, style){
            var result = false;
            var num = Number.from(this.getStyle(name));
            if(num != null){
                switch(style.substring(0,1)){
                    case '>' :
                        if(num > Number.from(style.substring(1))) result = true;
                        break;
                    case '<' :
                        if(num > Number.from(style.substring(1))) result = true;
                        break;
                    default:
                        if(num == Number.from(style)) result = true;
                }
            }else{
                switch(style.substring(0,1)){
                    case '>' :
                        if(this.getStyle(name) > style.substring(1)) result = true;
                        break;
                    case '<' :
                        if(this.getStyle(name) > style.substring(1)) result = true;
                        break;
                    default:
                        if(this.getStyle(name) == style) result = true;
                }
            }
            return result;
        }
    })
}

if(!Elements.mergedStyles){
    Elements.implement({
        mergedStyles : function(styles){
            results = [];
            if(typeOf(styles) == 'string'){
                styles = styles.split(',');
            }
            styles.each(function(style){
                results = results.concat(this.getStyle(style));
            }.bind(this));
            return results;
        }
    });
}

if(!Element.enlargeToFit){
    Element.implement({
        enlargeToFit : function(element, callback){
            if(this.dummy && this.src == this.dummy.src){
                this.resizeToFit();
                return;
            }
            this.dummy = new Image();
            if(!this.resizeToFit){
                this.resizeToFit = function(){
                    var theseDim = {x:this.dummy.width, y:this.dummy.height};
                    var thoseDim = element.getSize();
                    var aR = this.dummy.height/this.dummy.width;
                    var viewAR = thoseDim.y/thoseDim.x;
                    if(aR > 1){ //viewport orientation
                        if(aR < viewAR){ //blow up to fit hieght
                            this.setStyle('height', thoseDim.y);
                            this.setStyle('width', (aR)*thoseDim.y);
                        }else{ //blow up to fit width
                            this.setStyle('height', (aR)*thoseDim.x);
                            this.setStyle('width', thoseDim.x);
                        }
                    }else{
                        if(aR < viewAR){ //blow up to fit hieght
                            this.setStyle('height', thoseDim.y);
                            this.setStyle('width', (1/aR)*thoseDim.y);
                        }else{ //blow up to fit width
                            this.setStyle('height', (aR)*thoseDim.x);
                            this.setStyle('width', thoseDim.x);
                        }
                    }
                    if(callback) callback();
                }.bind(this);
                this.dummy.onload = this.resizeToFit;
            }
            this.dummy.src = this.src;

        }
    });
}

if(!Elements.excludeStyles){
    Elements.implement({
        excludeStyles : function(styles){
            var results = [];
            this.each(function(element){
                var found = false;
                Object.each(styles, function(style, name){
                    if(typeOf(style) == 'array'){
                        style.each(function(thisStyle){
                            found = found || element.hasStyle(name, thisStyle);
                        }.bind(this));
                    }else{
                        found = found || element.hasStyle(name, style);
                    }
                }.bind(this));
                if(!found) results.push(element);
            }.bind(this));
            return new Elements(results);
        }
    });
}

if(!Elements.includeStyles){
    Elements.implement({
        includeStyles : function(styles){
            results = [];
            this.each(function(element){
                var found = false;
                Object.each(styles, function(style, name){
                    if(typeOf(style) == 'array'){
                        style.each(function(thisStyle){
                            found = found || element.hasStyle(name, thisStyle);
                        }.bind(this));
                    }else{
                        found = found || element.hasStyle(name, style);
                    }
                }.bind(this));
                if(found) results.push(element);
            }.bind(this));
            return new Elements(results);
        }
    });
}

if(!Element.transitionIn){
    Element.implement({
        transitionIn : function(element, options, outgoingOptions){ //todo: support callback
            if(typeOf(element) == 'string') element = element.toDOM();
            if(!outgoingOptions) outgoingOptions = options; //todo: actually we want to invert the option values here... later
            element.setStyle('position', 'absolute');
            element.setStyle('opacity', 0);
            element.inject(this, 'before');
            this.fade('out');
            element.fade('in');
            element.setStyle('position', 'relative');
            this.dispose();
            return element[0];
        }
    });
}

if(!Element.linkText){
	Element.implement({
		linkText : function(element, fieldname, regex){
			if(!this.tagName.toLowerCase() == 'input') throw('invalid element');
			if(!fieldname) fieldname = 'html';
			var reactor = function(){
				var val = this.value;
				element = document.id(element);
				if(element){
					element.set(fieldname, val);
				}
			}.bind(this);
			this.addEvent('keydown', reactor);
			this.addEvent('keyup', reactor);
			this.addEvent('keypress', reactor);
		}
	});
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!NodeList.prototype.each){
    NodeList.prototype.each = function(callback){
        for(index in this){
            callback(this[index], index);
        }
    }
}

if(!NodeList.prototype.indexOf){
    NodeList.prototype.indexOf = function(item){
        var result = -1;
        for(index in this){
            if(item === this[index]) result = index;
        }
        return result;
    }
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Function.actionTimeout) Function.actionTimeout = 16384;
if(!Function.whenTrue){
    Function.implement({
        whenTrue : function(actionFunction, args, delayFunction, timeoutFunction, timeout, counter){
            if(!timeout) timeout = Function.actionTimeout;
            if(!counter) counter = 0;
            if(!timeoutFunction) timeoutFunction = function(event){
                throw('Condition not met after '+event.time+'ms');
            };
            var result = this();
            if(!result){
                var delayTime = Math.pow(2, counter); // geometric falloff
                if(delayTime >= timeout){
                    timeoutFunction({
                        count : counter,
                        time : delayTime
                    });
                    return;
                }
                counter++;
                this.whenTrue.delay(delayTime, this, [actionFunction, args, delayFunction, timeoutFunction, timeout, counter]);
                if(delayFunction) delayFunction({
                    count : counter,
                    time : delayTime
                });
            }else{
                actionFunction.apply(this, args);
            }
        }
    });
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Number.isFloat){
    Number.implement({
        isFloat : function() {
            return /\./.test(this.toString());
        }
    });
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!Object.profile){
    Object.profile = function(object, deep, indent){
        switch(typeOf(object)){
            case 'element':
                return '[function]';
                break;
            case 'elements':
                return '[Element Collection]';
                break;
            case 'textnode':
                return '[text]';
                break;
            case 'whitespace':
                return '[whitespace]';
                break;
            case 'arguments':
                return '[arguments]';
                break;
            case 'array':
                break;
            case 'object':
                var results = '<table>'
                Object.each(object, function(field, name){
                    results += '<tr><td>'+name+'</td><td>'+Object.profile(field)+'</td></tr>'
                });
                results += '</table>';
                return results;
                break;
            case 'regexp':
                return '[RegExp]';
                break;
            case 'class':
                break;
                return '[Class]';
            case 'collection':
                return '[collection]';
                break;
            case 'window':
                return '[window]';
                break;
            case 'document':
                return '[document]';
                break;
            case 'event':
                return '[event]';
                break;
            case 'null':
                return 'NULL'
                break;
            case 'function':
                return '[function]';
                break;
            case 'string':
            case 'number':
            case 'date':
            case 'boolean':
            default :
                return ''+object;
        }
    }
}
/*

Object.expand(object, {
    'source.user_id' : 'user_id'
}, index);

//*/

if(!Object.propify){
    Object.propify = function(obj, property){
         obj[property].toString = function(){
            this();
         }
    }
}


if(!Object.expand){
    Object.expand = function(ob, fields, indices){ 
        Object.map(ob, function(value, key){
            if(typeOf(value) == 'object' && typeOf(value) == 'array'){
                //Object.traverse(value, fields, indices);
                Object.expand(value, fields, indices);
            }else{
                if(fields.contains(key) && indices[key] && indices[key][value]){
                    //inflate
                    if(key.endsWith('_id')){
                        key = key.substring(0, key.length-3);
                    }else{
                        key = key+'_object';
                    }
                    ob[key] = indices[key][value];
                }
            }
        }, this);
    }
}

/*if(!Object.watch){
    Object.implement({
        watch : function(property, callback, oldValue){
            if(!oldValue) oldValue = '';
            if(this[property] != oldValue){
                oldValue = this[property];
                callback(this[property]);
            }else this.watch.delay(5, this, [property, callback, oldValue]);
        }
    });
}*//*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- Request
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(Request){
    Request.Pool = new Class({
        workers : [],
        successes : [],
        errors : [],
        data : {},
        initialize : function(requests, globalSuccess, globalError){
            requests.each(function(requestOptions){
                var request;
                if(requestOptions.onSuccess) requestOptions.successFunc = requestOptions.onSuccess;
                if(requestOptions.onFailure) requestOptions.failFunc = requestOptions.onFailure;
                requestOptions.onSuccess = function(data, xml){
                    if(requestOptions.successFunc) requestOptions.successFunc(data, xml);
                    if(requestOptions.id){
                        data.id = requestOptions.id;
                    }
                    this.successes.push(data);
                    if(!this.isWorking()){
                        if(this.completeWithNoErrors()){
                            globalSuccess(this.successes);
                        }else{
                            globalError(this.errors, this.successes);
                        }
                    }
                }.bind(this);
                requestOptions.onFailure = function(data){
                    if(requestOptions.failFunc) requestOptions.failFunc(data);
                    if(requestOptions.id){
                        data.id = requestOptions.id;
                    }
                    this.errors.push(data);
                    if(!this.isWorking()){
                        if(this.completeWithNoErrors()){
                            globalSuccess(this.successes);
                        }else{
                            globalError(this.errors, this.successes);
                        }
                    }
                }.bind(this);
                switch(requestOptions.objectType.toUpperCase()){
                    case 'IMAGE' :
                    case 'IMG' :
                        request = Asset.image(requestOptions.url, {
                            id: requestOptions.id,
                            title: requestOptions.title,
                            onload: requestOptions.onSuccess,
                            onerror: requestOptions.onFailure
                        });
                        break;
                    case 'CSS' :
                        request = Asset.css(requestOptions.url, {
                            id: requestOptions.id,
                            title: requestOptions.title,
                            onload: requestOptions.onSuccess,
                            onerror: requestOptions.onFailure
                        });
                        break;
                    case 'JAVASCRIPT' :
                    case 'JS' :
                        request = Asset.javascript(requestOptions.url, {
                            id: requestOptions.id,
                            title: requestOptions.title,
                            onload: requestOptions.onSuccess,
                            onerror: requestOptions.onFailure
                        });
                        break;
                    case 'JSON' :
                        request = new Request.JSON(requestOptions);
                        request.send();
                        break;
                    case 'HTML' : 
                        request = new Request.HTML(requestOptions);
                        request.send();
                        break;
                    default :
                        request = new Request(requestOptions);
                        request.send();
                }
                this.workers.push(request);
            }.bind(this));
        },
        isWorking :function(){
            return (this.workers.length != (this.successes.length + this.errors.length));
        },
        completeWithNoErrors :function(){
            return (this.workers.length == this.successes.length);
        }
    });
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- Request
- Class

provides: [Request.Stable]

*/
if(Request){
    Request.Stable = new Class({
        worker : {},
        baseClass : null,
        initialize : function(options, baseClass){ //baseClass is experimental, do not use yet
            if(!baseClass) this.baseClass = Request;
            else this.baseClass = baseClass;
            var completed = false;
            options = this.wrap(options, 'onSuccess', this.complete.bind(this));
            options = this.wrap(options, 'onFailure', this.complete.bind(this));
            options = this.wrap(options, 'onError', this.complete.bind(this));
            Request.Stable.workers.each(function(worker){ //try to use the first inactive thread
                if(!worker.working && !completed){ //potential for thread collision
                    worker.working = true;
                    worker.slave = new this.baseClass(options);
                    worker.slave.send();
                    this.worker = worker;
                    completed = true;
                }
            }.bind(this));
            if(!completed){ //if we haven't already found a place to execute the job
                if(Request.Stable.workers.length < Request.Stable.workerSize){ //generate a thread if we have space for a new one
                    this.worker.slave = new this.baseClass(options);
                    this.worker.working = true;
                    Request.Stable.workers.push(this.worker);
                    this.worker.slave.send();
                }else{ //wait
                    Request.Stable.workQueue.push(options);
                }
            }
        },
        nextJob : function(){
            var job = Request.Stable.workQueue.pop();
            if(job){
                this.worker.slave = new this.baseClass(job);
                this.worker.working = false;
                this.worker.slave.send();
            } 
        },
        status : function(title){
            console.log(['S:'+title, {
                q : Request.Stable.workQueue.length,
                t : Request.Stable.workers.length,
                workers : Request.Stable.workers
            }]);
        },
        complete : function(){
            //if(!this.worker) console.log(['NW', this]);
            this.worker.working = false;
            this.nextJob();
            //this.status('complete');
        },
        wrap : function(obj, key, func){
            if(key in obj){
                var innerFunction = obj[key];
                var myFunction = func.bind(this);
                obj[key] = function(arg1, arg2){
                        myFunction(arg1, arg2);
                        innerFunction(arg1, arg2);
                }.bind(this);
            }else obj[key] = func;
            return obj;
        }
    });
    Request.Stable.workers = [];
    Request.Stable.workQueue = [];
    Request.Stable.workerSize = 6;
}/*
---
description: This is an asynchronous JS request pool for MooTools. Sometimes it's useful to fetch a bunch of resources in parallel, this plugin facilitates that.

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
- XHTMLParser
- Class
- Request.JSON
- Request.HTML
- Asset

provides: [Request.Stable]

*/
if(!String.whenIn){
    String.implement({
        whenIn : function(element, callback){
            (function(){
                return element.getElements(this.toString()).length > 0;
            }.bind(this)).whenTrue(function(){
                callback(element.getElements(this.toString())[0]);
            }.bind(this));
        }
    });
}
if(!String.whenFullIn){
    String.implement({
        whenFullIn : function(element, callback){
            (function(){
                var q = element.getElements(this.toString());
                return q.length > 0 && q[0].getChildren().length > 0;
            }.bind(this)).whenTrue(function(){
                callback(element.getElements(this.toString())[0]);
            }.bind(this));
        }
    });
}
if(!String.toDOM){
    String.implement({
        toDOM: function(mode) {
            if(!mode) mode = 'sax';
            var result = false;
            switch(mode){
                case 'sax':
                    //we're going to parse the HTML and build our own DOM off the page
                    var pageParser = new XHTMLParser();
                    return pageParser.parse(this);
                    break;
                case 'iframe':
                    var myIFrame = new IFrame({
                        src: 'about:blank',
                        id: 'dummy_iframe',
                    });
                    myIFrame.inject(document.body);
                    myIFrame.set('html', this);
                    result = myIFrame.clone();
                    myIFrame.destroy();
                    break;
                case 'div':
                    var injector = new Element('div', {
                        'html': this,
                        'styles': {
                            'position': 'absolute',
                            'left': -1000000
                        }
                    }).inject(document.body);
                    result = injector.getChildren();
                    injector.destroy();
                    break;
            }
            return result;
        }
    });
}
if(!String.startsWith){
    String.implement({
        startsWith : function(text) {
            return this.indexOf(text) == 0;
        }
    });
}

if(!String.endsWith){
    String.implement({
        endsWith : function(text) {
            return this.substr(text.length * -1) === text;
        }
    });
}

if(!String.reverse){
    String.implement({
        reverse : function(){
            splitext = this.split("");
            revertext = splitext.reverse();
            reversed = revertext.join("");
            return reversed;
        }
    });
}

if(!String.splitHonoringQuotes){
    String.implement({
        splitHonoringQuotes: function(delimiter, quotes) {
            if(quotes == undefined) quotes = ['\'', '"'];
            var results = [''];
            var inQuote = false;
            var quote = null;
            for(var lcv=0; lcv < this.length; lcv++){
                if(inQuote){
                    if(this[lcv] == quote){
                        inQuote = false;
                        //results[results.length-1] += this[lcv];
                        //results[results.length] = '';
                    }else{
                        results[results.length-1] += this.charAt(lcv);
                    }
                }else{
                    if(quotes.contains(this[lcv])){
                        quote = this[lcv];
                        //results[results.length-1] += this[lcv];
                        inQuote = true;
                    }else if(this[lcv] == delimiter){
                        results[results.length] = '';
                    }else{
                        results[results.length-1] += this.charAt(lcv);
                    }
                }
            }
            return results;
        }
    });
}

if(!String.distance){
    String.implement({
        distance : function(s2){
            // levenshtein code by: Carlos R. L. Rodrigues, Onno Marsman, Andrea Giammarchi, Brett Zamir, Alexander M Beedie, Kevin van Zonneveld
            if (this == s2)  return 0;
            var s1_len = this.length;
            var s2_len = s2.length;
            if (s1_len === 0) return s2_len;
            if (s2_len === 0) return s1_len;
            var split = false;                                       // IE hack
            try { split = !('0')[0]; } catch (e) { split = true; }   // IE hack
            var s1;
            if (split) { 
                s1 = this.split('');
                s2 = s2.split('');
            }else{
                s1 = this;
            }
            var v0 = new Array(s1_len + 1);
            var v1 = new Array(s1_len + 1);
            var s1_idx = 0,
                s2_idx = 0,
                cost = 0;
            for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
                v0[s1_idx] = s1_idx;
            }
            var char_s1 = '',
                char_s2 = '';
            for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
                v1[0] = s2_idx;
                char_s2 = s2[s2_idx - 1];
                for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
                    char_s1 = s1[s1_idx];
                    cost = (char_s1 == char_s2) ? 0 : 1;
                    var m_min = v0[s1_idx + 1] + 1;
                    var b = v1[s1_idx] + 1;
                    var c = v0[s1_idx] + cost;
                    if (b < m_min) m_min = b;
                    if (c < m_min) m_min = c;
                    v1[s1_idx + 1] = m_min;
                }
                var v_tmp = v0;
                v0 = v1;
                v1 = v_tmp;
            }
            return v0[s1_len];
        }
    });
}

if(!String.existsAsURL){
    if(!String.urlExistences) String.urlExistences = [];
    String.implement({
        existsAsURL : function(callback){
            if(String.urlExistences[this] === true || String.urlExistences[this] === false) return String.urlExistences[this]; //buffer
            if(callback){
                throw('callback not yet supported!');
                //todo: support callback
            }else{
                try{
                    var req = document.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                    if (!req) throw new Error('XMLHttpRequest not supported');
                    req.open('HEAD', this, false);
                    req.send(null);
                    if (req.status == 200){
                        String.urlExistences[this] = true;
                        return true;
                    }else{
                        String.urlExistences[this] = false;
                        return false;
                    }
                }catch(ex){
                    return false;
                }
            }
        }
    });
}

if(!String.whenInDOM){ // try to execute the function using the string as an id
    if(!String.defaultReplacementTimeout) String.defaultReplacementTimeout = 16384;
    String.implement({
        whenInDOM : function(callback, delayCallback, timeoutCallback, timeout, counter){
            if(!timeout) timeout = String.defaultReplacementTimeout;
            if(!counter) counter = 0;
            if(!timeoutCallback) timeoutCallback = function(event){
                throw('Element did not appear in DOM(\''+event.id+'\') after '+event.time+'ms');
            };
            if(!document.id(this)){
                //we want to get the DOM node when it appears so we're looking for a gradient falloff of intervals as it approaches timeout
                //if(!String.DOMQueryCounts[this]) String.DOMQueryCounts[this] = 0;
                var delayTime = Math.pow(2, counter);
                if(delayTime >= timeout){
                    timeoutCallback({
                        id : this,
                        count : counter, 
                        time : delayTime
                    });
                }
                counter++;
                this.whenInDOM.delay(delayTime, this, [callback, delayCallback, timeoutCallback, timeout, counter]);
                if(delayCallback) delayCallback({
                    count : counter, 
                    time : delayTime
                });
            }else{
                callback(document.id(this));
            }
        }
    });
}

if(!String.regexEncode){
    String.regexChars = ['\\', '&','^', '$', '*', '+', '?', '.', '(', ')', '|', '{', '}', '[', ']'];
    String.regexEncodeRegexObject = new RegExp('([\\'+String.regexChars.join('|\\')+'])', 'g');
    String.implement({
        regexEncode : function(){
            return this.replace(String.regexEncodeRegexObject, '\\$1');
        }
    });
}

if(!String.nl2br){
    String.implement({
        nl2br : function(){
            return this.replace(/\n/mg, '<br/>');
        }
    });
}

if( (!String.entityEncode) && (!String.entityDecode) ){
    String.entities = {};
    String.entities.byCode = { 38: '&amp;', 60: '&lt;', 62: '&gt;', 160: '&nbsp;', 161: '&iexcl;', 162: '&cent;', 163: '&pound;', 164: '&curren;', 165: '&yen;', 166: '&brvbar;', 167: '&sect;', 168: '&uml;', 169: '&copy;', 170: '&ordf;', 171: '&laquo;', 172: '&not;', 173: '&shy;', 174: '&reg;', 175: '&macr;', 176: '&deg;', 177: '&plusmn;', 178: '&sup2;', 179: '&sup3;', 180: '&acute;', 181: '&micro;', 182: '&para;', 183: '&middot;', 184: '&cedil;', 185: '&sup1;', 186: '&ordm;', 187: '&raquo;', 188: '&frac14;', 189: '&frac12;', 190: '&frac34;', 191: '&iquest;', 192: '&Agrave;', 193: '&Aacute;', 194: '&Acirc;', 195: '&Atilde;', 196: '&Auml;', 197: '&Aring;', 198: '&AElig;', 199: '&Ccedil;', 200: '&Egrave;', 201: '&Eacute;', 202: '&Ecirc;', 203: '&Euml;', 204: '&Igrave;', 205: '&Iacute;', 206: '&Icirc;', 207: '&Iuml;', 208: '&ETH;', 209: '&Ntilde;', 210: '&Ograve;', 211: '&Oacute;', 212: '&Ocirc;', 213: '&Otilde;', 214: '&Ouml;', 215: '&times;', 216: '&Oslash;', 217: '&Ugrave;', 218: '&Uacute;', 219: '&Ucirc;', 220: '&Uuml;', 221: '&Yacute;', 222: '&THORN;', 223: '&szlig;', 224: '&agrave;', 225: '&aacute;', 226: '&acirc;', 227: '&atilde;', 228: '&auml;', 229: '&aring;', 230: '&aelig;', 231: '&ccedil;', 232: '&egrave;', 233: '&eacute;', 234: '&ecirc;', 235: '&euml;', 236: '&igrave;', 237: '&iacute;', 238: '&icirc;', 239: '&iuml;', 240: '&eth;', 241: '&ntilde;', 242: '&ograve;', 243: '&oacute;', 244: '&ocirc;', 245: '&otilde;', 246: '&ouml;', 247: '&divide;', 248: '&oslash;', 249: '&ugrave;', 250: '&uacute;', 251: '&ucirc;', 252: '&uuml;', 253: '&yacute;', 254: '&thorn;', 255: '&yuml;', 264: '&#264;', 265: '&#265;', 338: '&OElig;', 339: '&oelig;', 352: '&Scaron;', 353: '&scaron;', 372: '&#372;', 373: '&#373;', 374: '&#374;', 375: '&#375;', 376: '&Yuml;', 402: '&fnof;', 710: '&circ;', 732: '&tilde;', 913: '&Alpha;', 914: '&Beta;', 915: '&Gamma;', 916: '&Delta;', 917: '&Epsilon;', 918: '&Zeta;', 919: '&Eta;', 920: '&Theta;', 921: '&Iota;', 922: '&Kappa;', 923: '&Lambda;', 924: '&Mu;', 925: '&Nu;', 926: '&Xi;', 927: '&Omicron;', 928: '&Pi;', 929: '&Rho;', 931: '&Sigma;', 932: '&Tau;', 933: '&Upsilon;', 934: '&Phi;', 935: '&Chi;', 936: '&Psi;', 937: '&Omega;', 945: '&alpha;', 946: '&beta;', 947: '&gamma;', 948: '&delta;', 949: '&epsilon;', 950: '&zeta;', 951: '&eta;', 952: '&theta;', 953: '&iota;', 954: '&kappa;', 955: '&lambda;', 956: '&mu;', 957: '&nu;', 958: '&xi;', 959: '&omicron;', 960: '&pi;', 961: '&rho;', 962: '&sigmaf;', 963: '&sigma;', 964: '&tau;', 965: '&upsilon;', 966: '&phi;', 967: '&chi;', 968: '&psi;', 969: '&omega;', 977: '&thetasym;', 978: '&upsih;', 982: '&piv;', 8194: '&ensp;', 8195: '&emsp;', 8201: '&thinsp;', 8204: '&zwnj;', 8205: '&zwj;', 8206: '&lrm;', 8207: '&rlm;', 8211: '&ndash;', 8212: '&mdash;', 8216: '&lsquo;', 8217: '&rsquo;', 8218: '&sbquo;', 8220: '&ldquo;', 8221: '&rdquo;', 8222: '&bdquo;', 8224: '&dagger;', 8225: '&Dagger;', 8226: '&bull;', 8230: '&hellip;', 8240: '&permil;', 8242: '&prime;', 8243: '&Prime;', 8249: '&lsaquo;', 8250: '&rsaquo;', 8254: '&oline;', 8260: '&frasl;', 8364: '&euro;', 8472: '&weierp;', 8465: '&image;', 8476: '&real;', 8482: '&trade;', 8501: '&alefsym;', 8592: '&larr;', 8593: '&uarr;', 8594: '&rarr;', 8595: '&darr;', 8596: '&harr;', 8629: '&crarr;', 8656: '&lArr;', 8657: '&uArr;', 8658: '&rArr;', 8659: '&dArr;', 8660: '&hArr;', 8704: '&forall;', 8706: '&part;', 8707: '&exist;', 8709: '&empty;', 8711: '&nabla;', 8712: '&isin;', 8713: '&notin;', 8715: '&ni;', 8719: '&prod;', 8721: '&sum;', 8722: '&minus;', 8727: '&lowast;', 8729: '&#8729;', 8730: '&radic;', 8733: '&prop;', 8734: '&infin;', 8736: '&ang;', 8743: '&and;', 8744: '&or;', 8745: '&cap;', 8746: '&cup;', 8747: '&int;', 8756: '&there4;', 8764: '&sim;', 8773: '&cong;', 8776: '&asymp;', 8800: '&ne;', 8801: '&equiv;', 8804: '&le;', 8805: '&ge;', 8834: '&sub;', 8835: '&sup;', 8836: '&nsub;', 8838: '&sube;', 8839: '&supe;', 8853: '&oplus;', 8855: '&otimes;', 8869: '&perp;', 8901: '&sdot;', 8968: '&lceil;', 8969: '&rceil;', 8970: '&lfloor;', 8971: '&rfloor;', 9001: '&lang;', 9002: '&rang;', 9642: '&#9642;', 9643: '&#9643;', 9674: '&loz;', 9702: '&#9702;', 9824: '&spades;', 9827: '&clubs;', 9829: '&hearts;', 9830: '&diams;' };
    String.entities.byName = {};
    Object.each(String.entities.byCode, function(entity, code){ String.entities.byName[entity] = code; });
    var charSelectorString = '('+Object.keys(String.entities.byCode).map( function(code){ return String.fromCharCode(code).regexEncode() }, this).join('|')+')';
    String.entities.charSelector = new RegExp( charSelectorString, 'g' );
    var entitySelectorString = '('+Object.keys(String.entities.byName).map(function(entity){ return entity.regexEncode() }, this).join('|')+')';
    String.entities.entitySelector = new RegExp( entitySelectorString, 'gi');
    String.implement({
        entityEncode : function(){
            return this.replace(
                String.entities.charSelector,
                function(str, chr) {
                    return String.entities.byCode[chr.charCodeAt()];
                }
            );
        },
        entityDecode : function(){
            return this.replace(
                String.entities.entitySelector,
                function(str, entity) {
                    return String.fromCharCode(String.entities.byName[entity]);
                }
            );
        }
    });
}/*
---
description: An extensible Smarty Parser in Mootools

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.Smarty]
...
*/
if(!Protolus) var Protolus = {};
Protolus.missingResource = function(uri) {
    console.log('Resource missing: '+uri);
}
Protolus.createServer = function(options){ //options currently unused
    var url = require('url');
    var fs = require('fs');
    Protolus.serverApplication = require('http').createServer(function handler (req, res) {
        var uri = url.parse(req.url,true);
        res.writeHead(200);
        var type = uri.pathname.lastIndexOf('.') != -1 ? uri.pathname.substring(uri.pathname.lastIndexOf('.')+1) : '!';
        var path = ((type == '!' && uri.pathname != '/')?uri.pathname+'.html':uri.pathname);
        type = path.lastIndexOf('.') != -1 ? path.substring(path.lastIndexOf('.')+1) : '!';
        console.log(['path', path, type, '|'+uri.pathname+'|']);
        switch(path){
            case '/':
                fs.readFile(__dirname+'/Pages/index.html', function (err, data) {
                    if (err) throw(err);
                    res.end(data);
                });
                break;
            default :
                //console.log([type, (__dirname+'/Images'+uri.pathname)]);
                switch(type.toLowerCase()){
                    case 'png':
                    case 'gif':
                    case 'jpg':
                    case 'jpeg':
                        fs.readFile(__dirname+'/Images'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Images'+path);
                            res.end(data);
                        });
                        break;
                    case 'js':
                        fs.readFile(__dirname+'/Lib/Client'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Lib/Client'+path);
                            res.end(data);
                        });
                        break;
                    case 'html':
                        fs.readFile(__dirname+'/Pages'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Pages'+path);
                            res.end(data);
                        });
                        break;
                    case 'css':
                        fs.readFile(__dirname+'/Styles'+path, function (err, data) {
                            if (err) Protolus.missingResource(__dirname+'/Styles'+path);
                            res.end(data+'._'+path.replace(/[^-a-z0-9A-Z]/gi,"")+'_load_test {display: none;}');
                        });
                        break;
                    default:
                        //?????
                        fs.readFile(__dirname+'/404.html', function (err, data) {
                            if (err) throw(err);
                            res.end(data);
                        });   
                }
        }
    });
    
    Protolus.serverIO = require('socket.io').listen(Protolus.serverApplication);
    Protolus.filesystem = require('fs');
    Protolus.serverApplication.listen(80);
    
    Protolus.serverIO.set('log level', 1);
    Protolus.serverIO.sockets.on('connection', function (socket) {
        socket.on('template', function(data){
            
        });
        socket.on('render', function(data){
            
        });
        socket.on('handler', function(data){
            
        });
        socket.emit('startup', {
            
        });
    });
    return Protolus.serverApplication;
};

Protolus.createClient = function(){
    Protolus.socket = io.connect(window.location.protocol+"//"+window.location.host);
};

Protolus.Formats = {};
Protolus.Formats.uuid = function(){
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++)  s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    var uuid = s.join("");
    return uuid;
};/*
---
description: A simple registry wrapper for binding objects to an id, textually

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Registry]
...
*/
Protolus.Registry = new Class({
    registry : {},
    initialize : function(name){
    
    },
    register : function(key, value){
        this.registry[key] = value;
    },
    get : function(key){
        return this.registry[key];
    }
});Protolus.Image = new Class({
    height: null,
    width : null,
    window : null,
    currentLayer : null,
    layers: [],
    layerNumber : 1,
    initialize: function(){
        //check if it's an image, if so... swap, or edit.
        this.layers = [];
        this.buffer = new Element('canvas');
        //$ = old$;
    },
    getWidth: function(){
        return this.width;
    },
    getHeight: function(){
        return this.height;
    },
    newLayer : function(image){
        if(image != null){
            if(this.layers.length == 0){ //we're adding the first one, so we need to size the buffer
                //todo: add explicit sizing check
                this.buffer.setProperty('width', image.width);
                this.buffer.setProperty('height', image.height);
            }
            if(this.height == null || this.width == null){
                this.height = image.height;
                this.width = image.width;
                if(this.window != null){
                    this.window.setSize(this.getWidth() + 6, this.getHeight() + 53);
                    this.window.positionAtCenter();
                }
            }
            
            var result = new Protolus.Layer(image, this);
            this.layers.push(result);
            this.repaint();
            this.currentLayer = result;
            this.lastImage = image;
            this.buffer.fireEvent('createlayer');
            return result;
        }else{
            if(this.height && this.width){
                var result = new ImBo_Layer(this.lastImage, this);
                this.layers.push(result);
                this.repaint();
                this.currentLayer = result;
                this.buffer.fireEvent('createlayer');
                return result;
            }
        }
    },
    repaint : function(){
        var result = null;
        var context = this.buffer.getContext('2d');
        this.layers.each(function(layer){
            if(layer.show){
                if(result != null){
                    result = Protolus.Image.Booth.merge(layer.pixels, result, context);
                }else{
                    result = layer.pixels;
                }
            }
        });
        if(result != null) context.putImageData(result, 0, 0);
    },
    hex : function(){
        return this.currentLayer.hex();
    },
    png : function(){
        return this.currentLayer.png();
    }
});Protolus.Image.Booth = {
    // registries
    filters : [],
    transformations : [],
    operations : [],
    brushes : [],
    tools : [],
    foreground : '000000',
    background : 'FFFFFF',
    gui: null,
    currentImage : null,
    currentBrush : null,
    currentTool : null,
    clonePosition : null,
    cloneBrushPosition : null,
    // init
    startup: function(){
        /*Bootstrap.initialize(
            [
                {
                    name : 'MooTools',
                    signature : 'document.id',
                    location : 'Lib/mootools-1.2.4-core.js'
                },
                {
                    name : 'MooTools.More',
                    location : 'Lib/mootools-1.2.4.2-more.js',
                    depends : 'MooTools'
                },
                {
                    name : 'Image',
                    location : 'Core/Image.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Layer',
                    location : 'Core/Layer.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Filter',
                    location : 'Core/Filter.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Brush',
                    location : 'Core/Brush.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Operation',
                    location : 'Core/Operation.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Tool',
                    location : 'Core/Tool.js',
                    depends : 'MooTools.More'
                }
            ],
            function(){
                // you are now loaded, do your stuff here
                this.load('operations', 'Negative');
                this.load('operations', 'BrightnessContrast');
                
                this.load('filters', 'GaussianBlurFilter');
                this.load('filters', 'SobelFilter');
                this.load('filters', 'LaplacianFilter');
                this.load('filters', 'SharpenFilter');
                this.load('filters', 'EmbossFilter');
                this.load('filters', 'HighPassFilter');
                
                this.load('brushes', '1pxSquareBrush');
                this.load('brushes', '3pxRoundBrush');
                this.load('brushes', '5pxSquareBrush');
                this.load('brushes', '5pxRoundBrush');
                this.load('brushes', '5pxSoftRoundBrush');
                this.load('brushes', '10pxScatterBrush');
                this.load('brushes', '10pxSoftRoundBrush');
                this.load('brushes', '15pxSoftRoundBrush');
                this.load('brushes', '20pxSoftRoundBrush');
                this.load('brushes', '40pxSoftRoundBrush');
                
                this.load('tools', 'Paintbrush');
                this.load('tools', 'Eraser');
                this.load('tools', 'Clone');
                this.load('tools', 'Eyedropper');
                this.load('tools', 'Paintbucket');
                
            }.bind(this)
        );*/
        if(Protolus.Image.Booth.filters.length == 0){
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.GaussianBlur());
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.Sobel());
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.Laplacian());
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.Sharpen());
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.Emboss());
            Protolus.Image.Booth.registerFilter(new Protolus.Image.Filter.HighPass());
            
            Protolus.Image.Booth.registerOperation(new Protolus.Image.Operation.Negative());
            Protolus.Image.Booth.registerOperation(new Protolus.Image.Operation.BightnessContrast());
            
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.Square1px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.Round3px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.Square5px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.Round5px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.SoftRound5px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.Scatter10px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.SoftRound10px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.SoftRound15px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.SoftRound20px());
            Protolus.Image.Booth.registerBrush(new Protolus.Image.Brush.SoftRound40px());
            
            Protolus.Image.Booth.registerTool(new Protolus.Image.Tool.Paintbrush());
            Protolus.Image.Booth.registerTool(new Protolus.Image.Tool.Eraser());
            Protolus.Image.Booth.registerTool(new Protolus.Image.Tool.Clone());
            Protolus.Image.Booth.registerTool(new Protolus.Image.Tool.Eyedropper());
            Protolus.Image.Booth.registerTool(new Protolus.Image.Tool.Paintbucket());
        }
    },
    load : function(type, name){
        var id = type[0].toUpperCase()+type.substring(1).toLowerCase()+'/'+name+'.js';
        Bootstrap.JS(id);
    },
    log : function(value){
        if(console) {
            if(navigator.userAgent.toLowerCase().indexOf("applewebkit") != -1) {
                console.log(value);
            } else {
                console.log.apply(this,arguments);
            }
        }
    },
    bindGUI : function(gui){
        this.gui = gui;
    },
    //registration
    registerFilter: function(filter){
        Protolus.Image.Booth.filters[filter.name()] = filter;
    },
    registerOperation: function(operation){
        Protolus.Image.Booth.operations[operation.name()] = operation;
    },
    registerTransformation: function(transformation){
        Protolus.Image.Booth.transformations[transformation.name()] = transformation;
    },
    registerBrush: function(brush){
        if(Protolus.Image.Booth.currentBrush == null) Protolus.Image.Booth.currentBrush = brush.name();
        Protolus.Image.Booth.brushes[brush.name()] = brush;
    },
    registerTool: function(tool){
        if(Protolus.Image.Booth.currentTool == null) Protolus.Image.Booth.currentTool = tool.name();
        Protolus.Image.Booth.tools[tool.name()] = tool;
    },
    //core
    newImage : function(img){
        var img = new ImBo_Image(document.id('body'));
        Protolus.Image.Booth.currentImage = img;
        return img;
    },
    filter : function(name, layer, controls){
        Protolus.Image.Booth.checkInitialization();
        if(!controls && this.gui){
            var controls = Protolus.Image.Booth.filters[name].getControls();
            var count = 0;
            for(controlKey in controls) count++;
            if(count == 0){
                if(Protolus.Image.Booth.filters[name] != null) return Protolus.Image.Booth.filters[name].filter(layer.pixels, controls);
                return;
            }
            if(this.gui) this.gui.makeOptionsWindow(name, controls, layer, this.filter);
        }else{
            var target = layer;
            if (target.layer_signature) target = target.pixels;
            if(Protolus.Image.Booth.filters[name] != null) return Protolus.Image.Booth.filters[name].filter(target, controls);
            else Protolus.Image.Booth.error('OMG no filter! '+name);
        }
    },
    transform : function(name, layer, controls){
        Protolus.Image.Booth.checkInitialization();
        if(Protolus.Image.Booth.transformations[name] != null) return Protolus.Image.Booth.transformations[name].transform(layer, controls);
        else Protolus.Image.Booth.error('OMG no transformation! '+name);
    },
    operate : function(name, layer, controls){
        Protolus.Image.Booth.checkInitialization();
        if(!controls && this.gui){
            var controls = Protolus.Image.Booth.operations[name].getControls();
            var count = 0;
            for(controlKey in controls) count++;
            if(count == 0){
                if(Protolus.Image.Booth.operations[name] != null) return Protolus.Image.Booth.operations[name].operate(layer.pixels, controls);
                return;
            }
            if(this.gui) this.gui.makeOptionsWindow(name, controls, layer, this.operate);
        }else{
            var target = layer;
            if (target.layer_signature) target = target.pixels;
            if(Protolus.Image.Booth.operations[name] != null) return Protolus.Image.Booth.operations[name].operate(target, controls);
            else Protolus.Image.Booth.error('OMG no filter! '+name);
        }
    },
    brush : function(name, layer, x, y, controls){
        Protolus.Image.Booth.checkInitialization();
        if(Protolus.Image.Booth.brushes[name] != 'undefined'){
            if(Protolus.Image.Booth.brushes[name].getBrush == undefined) Protolus.Image.Booth.error('no brush! '+name);
            else if(Protolus.Image.Booth.currentTool == null || Protolus.Image.Booth.tools[Protolus.Image.Booth.currentTool].paint == undefined) Protolus.Image.Booth.error('no tool ! '+Protolus.Image.Booth.currentTool);
            else return Protolus.Image.Booth.tools[Protolus.Image.Booth.currentTool].paint(Protolus.Image.Booth.brushes[name].getBrush(), layer, x, y);
        }
        else Protolus.Image.Booth.error('OMG no brush! '+name);
    },
    // Utility functions
    brushDimensions: function(name){
        Protolus.Image.Booth.checkInitialization();
        if(Protolus.Image.Booth.brushes[name] != 'undefined'){
            return {x:Protolus.Image.Booth.brushes[name].brush.length, y:Protolus.Image.Booth.brushes[name].brush[0].length};
        }
        else return {x:0, y:0};
    },
    decodeHex: function(color){
        var result = [
            parseInt(color.substring(0,2), 16),
            parseInt(color.substring(2,4), 16),
            parseInt(color.substring(4,6), 16) 
        ];
        return result;
    },
    performConvolution : function(pixels, convolution_matrix, levels){
        if(levels == undefined) levels = convolution_matrix.length * convolution_matrix[0].length;
        return Protolus.Image.Booth.convolve(pixels, convolution_matrix, levels, 0);
        
    },
    error : function(message){
        Protolus.Image.Booth.log(message);
    },
    flipY : function(matrix){
        var temp;
        var matrixCopy = matrix;
        var end = matrix.length-1;
        var half = matrix.length/2+1;
        for(var lcv = 0; lcv < half ; lcv++){
            matrixCopy[lcv] = matrix[end-lcv];
            matrixCopy[end-lcv] = matrix[lcv];
        }
        return matrixCopy;
    },
    flipX : function(matrix){
        var temp;
        var matrixCopy = matrix;
        var end = matrix.length-1;
        for(var y = 0; y < matrix.length; y++){
            for(var x = 0; x < matrix.width/2+1; x++){
                matrixCopy[y][lcv] = matrix[y][end-lcv];
                matrixCopy[y][end-lcv] = matrix[y][lcv];
            }
        }
        return matrixCopy;
    },
    convolveBuffer : new Element('canvas'),
    convolve: function(pixels, filter, filter_div, offset){ //src == image
        if (pixels == null){
            Protolus.Image.Booth.error('Tried to convolve nothing!');
        }
        //setup buffer
        Protolus.Image.Booth.convolveBuffer.setProperty('width', pixels.width);
        Protolus.Image.Booth.convolveBuffer.setProperty('height', pixels.height);
        var context = Protolus.Image.Booth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        var new_r, new_g, new_b, new_a, alpha, yv, pxl, new_pxl, kernel_size;
        //kernel_size = filter.length; //coming soon
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                new_r = new_g = new_b = 0;
                new_a = pixels.data[((y*(sx*4)) + (x*4)) + 3];
                //convolve this pixel to produce this pixel's value
                for(var j = 0; j < filter.length; j++) { //rows
                    yv = Math.min( Math.max(y - 1 + j, 0), sy - 1);
                    for(var i = 0; i < filter[j].length; i++) { //cols
                        pxl = [ Math.min( Math.max(x - 1 + i, 0), sx - 1), yv]; 
                        if(filter[j] && filter[j][i]){
                            new_r += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4))    ] * filter[j][i];
                            new_g += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 1] * filter[j][i];
                            new_b += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 2] * filter[j][i];
                        }
                    }
                }
                if ((y >= 0) && (y < sy)) { //y coordinate in range?
                    //
                    new_r = (new_r/filter_div)+offset;
                    new_g = (new_g/filter_div)+offset;
                    new_b = (new_b/filter_div)+offset;
                    //bound 0 .. 255
                    new_r = (new_r > 255)? 255 : ((new_r < 0)? 0:new_r); 
                    new_g = (new_g > 255)? 255 : ((new_g < 0)? 0:new_g);
                    new_b = (new_b > 255)? 255 : ((new_b < 0)? 0:new_b);
                    //copy the altered values for this pixel into the buffer we created
                    newPixels.data[((y*(sx*4)) + (x*4))    ] += new_r;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 1] += new_g;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 2] += new_b;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 3] += new_a;
                }
            }
        }
        // return the buffer
        return newPixels;
    },
    merge: function(aPixels, bPixels, buffer, mode, opacity){ //src == image 
        //for clarity's sake, we are layering layer a over layer b
        if (aPixels == null || bPixels == null) Protolus.Image.Booth.error('Tried to convolve nothing!');
        if(aPixels.height != bPixels.height || aPixels.width != bPixels.width){
            Protolus.Image.Booth.error('Mismatched pixel sizes');
            Protolus.Image.Booth.error(aPixels);
            Protolus.Image.Booth.error(bPixels);
        }
        if(mode == null) mode = 'overlay';
        //setup buffer
        var newPixels;
        if(!buffer || buffer == null){
            Protolus.Image.Booth.convolveBuffer.setProperty('width', aPixels.width);
            Protolus.Image.Booth.convolveBuffer.setProperty('height', aPixels.height);
            var context = Protolus.Image.Booth.convolveBuffer.getContext('2d');
            newPixels  = context.getImageData(0,0, aPixels.width, aPixels.height);
        }else{
            newPixels = buffer.getImageData(0,0, aPixels.width, aPixels.height);
        }
        var sx = aPixels.width; //getx
        var sy = aPixels.height; //gety
        switch(mode){
            case 'average':
                
                break;
            case 'lighten':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'darken':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'overlay':
                var index, a_alpha, b_alpha;
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        index = ((y*(sx*4)) + (x*4));
                        a_alpha = aPixels.data[index  + 3];
                        if(a_alpha == 0){
                            newPixels.data[index    ] =  bPixels.data[index     ];
                            newPixels.data[index + 1 ] = bPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = bPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = bPixels.data[index + 3 ];
                        }else if (a_alpha == 255){
                            newPixels.data[index    ] =  aPixels.data[index     ];
                            newPixels.data[index + 1 ] = aPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = aPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = a_alpha;
                        }else{
                            //technically b should be a composite, and not use additive 
                            var a_combine_amount = a_alpha/255;
                            var b_combine_amount = (255-a_alpha)/255;
                            var b_alpha = bPixels.data[index  + 3];
                            newPixels.data[index    ] = 
                                (aPixels.data[index     ] * a_combine_amount) 
                                + (bPixels.data[index     ] * b_combine_amount)
                            ;
                            newPixels.data[index + 1 ] = 
                                (aPixels.data[index + 1 ] * a_combine_amount) 
                                + (bPixels.data[index + 1 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 2 ] = 
                                (aPixels.data[index + 2 ] * a_combine_amount) 
                                + (bPixels.data[index + 2 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 3 ] = Math.max(a_alpha, b_alpha);
                        }
                    }
                }
                break;
        }
        buffer.putImageData(newPixels, 0, 0);
        return newPixels;
    },
    rotate: function(layer, angle, anchor){
    },
    hexDump: function(buffer, x, y){
        var data = '';
        var pos;
        for(var ypos = 0; ypos < y; ypos++){
            for(xpos = 0; xpos < x; xpos++){
                pos = ((ypos*(x*4)) + (xpos*4));
                data  += 
                    buffer.data[pos    ].toString(16).toUpperCase() +
                    buffer.data[pos + 1].toString(16).toUpperCase() +
                    buffer.data[pos + 2].toString(16).toUpperCase() +
                    buffer.data[pos + 3].toString(16).toUpperCase();
            }
            data += '\n';
        }
        return data;
    },
    imageObject: function(buffer){
        var uri = buffer.toDataURL();
        var obj = new Element('img', {
            src : uri
        });
        if(!obj.width) obj.width = buffer.width;
        if(!obj.height) obj.height = buffer.height;
        //document.body.appendChild(obj);
        return obj;
    },
    imageDump: function(buffer, type){
        if(type == null) type = 'png';
        var uri = buffer.toDataURL();
        var result = '';
        var signature = 'data:image/'+type+';base64,';
        if(uri.startsWith(signature)){
            var data = uri.substr(signature.length);
            return data;
        }else{
            //blow up
        }
    }
};
//Protolus.Image.Booth.startup();
Protolus.Image.Layer = new Class({
    layer_signature : true,
    last_x : null,
    last_y : null,
    painting : false,
    name : 'Layer',
    show : true,
    initialize : function(img, image){
        if(img.nodeName && img.nodeName.toLowerCase() == 'img') this.image = img;
        this.parentImage = image;
        this.name = 'Layer '+(image.layerNumber++);
        this.buffer = new Element('canvas', { //the internal drawing buffer
            'width': img.width,
            'height': img.height
        });
        this.context2d = this.buffer.getContext('2d');
        if(img.nodeName && img.nodeName.toLowerCase() == 'img'){
            this.context2d.drawImage(this.image,0,0);
            this.pixels = this.context2d.getImageData(0,0, img.width, img.height);
        }else{
            //clear canvas
            var data = this.context2d.getImageData(0,0, img.width, img.height)
            for(var ypos = 0; ypos < img.height; ypos++){
                for(xpos = 0; xpos < img.width; xpos++){
                        pos = ((ypos*(img.width*4)) + (xpos*4));
                        data.data[pos + 3] = 0;
                }
            }
            this.pixels = data;
        }
        //TODO: we need to handle cross domain security here
        //netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        //what for webkit?
        //this.pixels = this.context2d.getImageData(0,0, img.width, img.height);
        //img.setStyle('display','none');
    },
    filter : function(name, controls){
        var filteredPixels = Protolus.Image.Booth.filter(name, this, controls);
        if(filteredPixels) this.drawOnto(filteredPixels);
    },
    operate : function(name, controls){
        var pixels = Protolus.Image.Booth.operate(name, this, controls);
        if(pixels) this.drawOnto(pixels);
    },
    brush : function(name, x, y, controls){
        var pixels = Protolus.Image.Booth.brush(name, this.pixels, x, y, controls);
        //this.drawOnto(pixels);
        this.context2d.putImageData(pixels, 0, 0);
        this.parentImage.repaint();
    },
    hex : function(){
        return Protolus.Image.Booth.hexDump(this.pixels, this.pixels.width, this.pixels.height);
    },
    png : function(){
        return Protolus.Image.Booth.imageDump(this.buffer, 'png');
    },
    getIMG : function(){
        return Protolus.Image.Booth.imageObject(this.buffer);
    },
    strokeLine : function(name, x, y, x2, y2, controls){
        //compute the points on a line to brush
        //var dist = Math.round(Math.sqrt( (x-x2)*(x-x2) + (y-y2)*(y-y2))); //get distance in pixels
        var xdist = Math.abs(x-x2); //get distance in pixels
        var ydist = Math.abs(y-y2);
        var brush_size = Protolus.Image.Booth.brushDimensions(name);
        var avg_size = 2;
        var thisx, thisy;
        var div = 2;
        if(brush_size.x < 4 && brush_size.y < 4){
            div = 1;
        }
        if(xdist > ydist){
            var num_segments = xdist / div;
            var interval = xdist/num_segments;
            var coefficient = (y2-y)/(x2-x);
            var pixels = this.pixels;
            for(var lcv=0; lcv < num_segments; lcv++){
                thisx = x + (lcv*interval);
                thisy = Math.round(y + (thisx - x) * coefficient);
                //alert('['+thisx+', '+thisy+']');
                pixels = Protolus.Image.Booth.brush(name, pixels, thisx, thisy, controls);
                this.context2d.putImageData(pixels, 0, 0);
            }
        }else{
            var num_segments = ydist / div;
            var interval = ydist/num_segments;
            var coefficient = (x2-x)/(y2-y);
            var pixels = this.pixels;
            for(var lcv=0; lcv < num_segments; lcv++){
                thisy = y + (lcv*interval);
                thisx = Math.round(x + (thisy - y) * coefficient);
                //alert('['+thisx+', '+thisy+']');
                pixels = Protolus.Image.Booth.brush(name, pixels, thisx, thisy, controls);
                this.context2d.putImageData(pixels, 0, 0);
            }

        }
        this.parentImage.repaint();
    },
    duplicate : function(){
        
    },
    height : function(){
        this.image.height;
    },
    width : function(){
        this.image.width;
    },
    drawInto: function(canvas2DContext){
        //todo: composite, don't replace
        canvas2DContext.putImageData(this.pixels, 0, 0);
    },
    drawOnto: function(pixels){
        //duplicate the data
        for(var lcv=0; lcv < this.pixels.data.length; lcv++) this.pixels.data[lcv] = pixels.data[lcv];
        //push it all back up the render tree
        this.flush();
    },
    addFunctionLayer : function(func, parameters){
        
    },
    flush: function(){
        this.context2d.putImageData(this.pixels, 0, 0); //write pixel data back to the internal canvas
        this.parentImage.repaint(); //paint the pixels back into the parent image
    }
});Protolus.Image.Filter = new Class({
    name : function(){
        return '';
    },
    filter: function(layer, controls){
        //this is the key method to override
    },
    getControls : function(){
        return {};
    },
    getLabel : function(){
        return this.name();
    }
});Protolus.Image.Tool = new Class({
    name : function(){
        return '';
    },
    paint: function(brush, pixels, x, y){
    },
    getToolIcon : function(){
        return 'Graphics/Tools/missing.png';
    },
    getControls : function(){
        return {};
    }
});Protolus.Image.Brush = new Class({
    name : function(){
        return '';
    },
    // 5 x 5, fully opaque, square
    brush : [
        [255]
    ],
    getBrush : function(){
        return this.brush;
    }
});Protolus.Image.Operation = new Class({
    name : function(){
        return '';
    },
    operate: function(pixels, controls){
        //this is the key method to override
    },
    getControls : function(){
        return {};
    },
    getLabel : function(){
        return this.name();
    }
});Protolus.Image.Brush.Scatter10px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '10px_scatter';
    },
    brush : [
        [000, 000, 000, 100, 000, 000, 000, 000, 100, 000],
        [000, 000, 100, 150, 100, 000, 000, 100, 150, 100],
        [000, 050, 000, 100, 000, 000, 050, 000, 100, 000],
        [050, 100, 050, 000, 000, 050, 100, 050, 000, 000],
        [000, 050, 000, 100, 000, 000, 050, 000, 000, 000],
        [000, 000, 100, 150, 100, 000, 000, 000, 050, 000],
        [000, 000, 000, 100, 000, 000, 000, 000, 000, 000],
        [000, 000, 000, 000, 000, 000, 000, 050, 000, 000],
        [000, 050, 000, 000, 050, 000, 050, 100, 050, 000],
        [000, 000, 000, 000, 000, 000, 000, 050, 000, 000],
    ]
});Protolus.Image.Brush.Round3px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '3px_round';
    },
    brush : [
        [025, 100, 025],
        [100, 255, 100],
        [025, 100, 025],
    ]
});Protolus.Image.Brush.SoftRound10px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '10px_soft_round';
    },
    brush : [
        [000, 000, 000, 005, 010, 010, 005, 000, 000, 000],
        [000, 000, 005, 030, 050, 050, 030, 005, 000, 000],
        [000, 005, 030, 100, 120, 120, 100, 030, 005, 000],
        [005, 030, 100, 160, 180, 180, 160, 100, 030, 005],
        [010, 050, 120, 180, 200, 200, 180, 120, 050, 010],
        [010, 050, 120, 180, 200, 200, 180, 120, 050, 010],
        [005, 030, 100, 160, 180, 180, 160, 100, 030, 005],
        [000, 005, 030, 100, 120, 120, 100, 030, 005, 000],
        [000, 000, 005, 030, 050, 050, 030, 005, 000, 000],
        [000, 000, 000, 005, 010, 010, 005, 000, 000, 000],
    ]
});Protolus.Image.Brush.SoftRound40px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '40px_soft_round';
    },
    brush : [
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 004, 007, 009, 011, 012, 012, 012, 011, 009, 007, 004, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 003, 008, 013, 016, 019, 022, 024, 025, 025, 025, 024, 022, 019, 016, 013, 008, 003, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 003, 009, 015, 020, 025, 029, 032, 034, 036, 037, 038, 037, 036, 034, 032, 029, 025, 020, 015, 009, 003, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 007, 014, 020, 026, 032, 037, 041, 044, 047, 049, 050, 051, 050, 049, 047, 044, 041, 037, 032, 026, 020, 014, 007, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 001, 010, 017, 025, 031, 038, 043, 049, 053, 057, 059, 062, 063, 063, 063, 062, 059, 057, 053, 049, 043, 038, 031, 025, 017, 010, 001, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 002, 011, 019, 027, 035, 042, 049, 055, 060, 065, 069, 072, 074, 076, 076, 076, 074, 072, 069, 065, 060, 055, 049, 042, 035, 027, 019, 011, 002, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 001, 011, 020, 029, 037, 045, 053, 060, 066, 072, 077, 081, 084, 087, 088, 089, 088, 087, 084, 081, 077, 072, 066, 060, 053, 045, 037, 029, 020, 011, 001, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 010, 019, 029, 038, 047, 055, 063, 071, 077, 083, 089, 093, 097, 099, 101, 102, 101, 099, 097, 093, 089, 083, 077, 071, 063, 055, 047, 038, 029, 019, 010, 000, 000, 000, 000],
[000, 000, 000, 000, 007, 017, 027, 037, 047, 056, 065, 073, 081, 088, 095, 100, 105, 109, 112, 114, 114, 114, 112, 109, 105, 100, 095, 088, 081, 073, 065, 056, 047, 037, 027, 017, 007, 000, 000, 000],
[000, 000, 000, 003, 014, 025, 035, 045, 055, 065, 074, 083, 091, 099, 106, 112, 117, 121, 124, 126, 127, 126, 124, 121, 117, 112, 106, 099, 091, 083, 074, 065, 055, 045, 035, 025, 014, 003, 000, 000],
[000, 000, 000, 009, 020, 031, 042, 053, 063, 073, 083, 092, 101, 109, 117, 123, 129, 134, 137, 139, 140, 139, 137, 134, 129, 123, 117, 109, 101, 092, 083, 073, 063, 053, 042, 031, 020, 009, 000, 000],
[000, 000, 003, 015, 026, 038, 049, 060, 071, 081, 091, 101, 110, 119, 127, 134, 140, 146, 149, 152, 153, 152, 149, 146, 140, 134, 127, 119, 110, 101, 091, 081, 071, 060, 049, 038, 026, 015, 003, 000],
[000, 000, 008, 020, 032, 043, 055, 066, 077, 088, 099, 109, 119, 128, 137, 145, 152, 157, 162, 164, 165, 164, 162, 157, 152, 145, 137, 128, 119, 109, 099, 088, 077, 066, 055, 043, 032, 020, 008, 000],
[000, 000, 013, 025, 037, 049, 060, 072, 083, 095, 106, 117, 127, 137, 146, 155, 163, 169, 174, 177, 178, 177, 174, 169, 163, 155, 146, 137, 127, 117, 106, 095, 083, 072, 060, 049, 037, 025, 013, 000],
[000, 004, 016, 029, 041, 053, 065, 077, 089, 100, 112, 123, 134, 145, 155, 164, 173, 180, 186, 189, 191, 189, 186, 180, 173, 164, 155, 145, 134, 123, 112, 100, 089, 077, 065, 053, 041, 029, 016, 004],
[000, 007, 019, 032, 044, 057, 069, 081, 093, 105, 117, 129, 140, 152, 163, 173, 182, 191, 197, 202, 204, 202, 197, 191, 182, 173, 163, 152, 140, 129, 117, 105, 093, 081, 069, 057, 044, 032, 019, 007],
[000, 009, 022, 034, 047, 059, 072, 084, 097, 109, 121, 134, 146, 157, 169, 180, 191, 200, 209, 214, 216, 214, 209, 200, 191, 180, 169, 157, 146, 134, 121, 109, 097, 084, 072, 059, 047, 034, 022, 009],
[000, 011, 024, 036, 049, 062, 074, 087, 099, 112, 124, 137, 149, 162, 174, 186, 197, 209, 218, 226, 229, 226, 218, 209, 197, 186, 174, 162, 149, 137, 124, 112, 099, 087, 074, 062, 049, 036, 024, 011],
[000, 012, 025, 037, 050, 063, 076, 088, 101, 114, 126, 139, 152, 164, 177, 189, 202, 214, 226, 236, 242, 236, 226, 214, 202, 189, 177, 164, 152, 139, 126, 114, 101, 088, 076, 063, 050, 037, 025, 012],
[000, 012, 025, 038, 051, 063, 076, 089, 102, 114, 127, 140, 153, 165, 178, 191, 204, 216, 229, 242, 255, 242, 229, 216, 204, 191, 178, 165, 153, 140, 127, 114, 102, 089, 076, 063, 051, 038, 025, 012],
[000, 012, 025, 037, 050, 063, 076, 088, 101, 114, 126, 139, 152, 164, 177, 189, 202, 214, 226, 236, 242, 236, 226, 214, 202, 189, 177, 164, 152, 139, 126, 114, 101, 088, 076, 063, 050, 037, 025, 012],
[000, 011, 024, 036, 049, 062, 074, 087, 099, 112, 124, 137, 149, 162, 174, 186, 197, 209, 218, 226, 229, 226, 218, 209, 197, 186, 174, 162, 149, 137, 124, 112, 099, 087, 074, 062, 049, 036, 024, 011],
[000, 009, 022, 034, 047, 059, 072, 084, 097, 109, 121, 134, 146, 157, 169, 180, 191, 200, 209, 214, 216, 214, 209, 200, 191, 180, 169, 157, 146, 134, 121, 109, 097, 084, 072, 059, 047, 034, 022, 009],
[000, 007, 019, 032, 044, 057, 069, 081, 093, 105, 117, 129, 140, 152, 163, 173, 182, 191, 197, 202, 204, 202, 197, 191, 182, 173, 163, 152, 140, 129, 117, 105, 093, 081, 069, 057, 044, 032, 019, 007],
[000, 004, 016, 029, 041, 053, 065, 077, 089, 100, 112, 123, 134, 145, 155, 164, 173, 180, 186, 189, 191, 189, 186, 180, 173, 164, 155, 145, 134, 123, 112, 100, 089, 077, 065, 053, 041, 029, 016, 004],
[000, 000, 013, 025, 037, 049, 060, 072, 083, 095, 106, 117, 127, 137, 146, 155, 163, 169, 174, 177, 178, 177, 174, 169, 163, 155, 146, 137, 127, 117, 106, 095, 083, 072, 060, 049, 037, 025, 013, 000],
[000, 000, 008, 020, 032, 043, 055, 066, 077, 088, 099, 109, 119, 128, 137, 145, 152, 157, 162, 164, 165, 164, 162, 157, 152, 145, 137, 128, 119, 109, 099, 088, 077, 066, 055, 043, 032, 020, 008, 000],
[000, 000, 003, 015, 026, 038, 049, 060, 071, 081, 091, 101, 110, 119, 127, 134, 140, 146, 149, 152, 153, 152, 149, 146, 140, 134, 127, 119, 110, 101, 091, 081, 071, 060, 049, 038, 026, 015, 003, 000],
[000, 000, 000, 009, 020, 031, 042, 053, 063, 073, 083, 092, 101, 109, 117, 123, 129, 134, 137, 139, 140, 139, 137, 134, 129, 123, 117, 109, 101, 092, 083, 073, 063, 053, 042, 031, 020, 009, 000, 000],
[000, 000, 000, 003, 014, 025, 035, 045, 055, 065, 074, 083, 091, 099, 106, 112, 117, 121, 124, 126, 127, 126, 124, 121, 117, 112, 106, 099, 091, 083, 074, 065, 055, 045, 035, 025, 014, 003, 000, 000],
[000, 000, 000, 000, 007, 017, 027, 037, 047, 056, 065, 073, 081, 088, 095, 100, 105, 109, 112, 114, 114, 114, 112, 109, 105, 100, 095, 088, 081, 073, 065, 056, 047, 037, 027, 017, 007, 000, 000, 000],
[000, 000, 000, 000, 000, 010, 019, 029, 038, 047, 055, 063, 071, 077, 083, 089, 093, 097, 099, 101, 102, 101, 099, 097, 093, 089, 083, 077, 071, 063, 055, 047, 038, 029, 019, 010, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 001, 011, 020, 029, 037, 045, 053, 060, 066, 072, 077, 081, 084, 087, 088, 089, 088, 087, 084, 081, 077, 072, 066, 060, 053, 045, 037, 029, 020, 011, 001, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 002, 011, 019, 027, 035, 042, 049, 055, 060, 065, 069, 072, 074, 076, 076, 076, 074, 072, 069, 065, 060, 055, 049, 042, 035, 027, 019, 011, 002, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 001, 010, 017, 025, 031, 038, 043, 049, 053, 057, 059, 062, 063, 063, 063, 062, 059, 057, 053, 049, 043, 038, 031, 025, 017, 010, 001, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 007, 014, 020, 026, 032, 037, 041, 044, 047, 049, 050, 051, 050, 049, 047, 044, 041, 037, 032, 026, 020, 014, 007, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 003, 009, 015, 020, 025, 029, 032, 034, 036, 037, 038, 037, 036, 034, 032, 029, 025, 020, 015, 009, 003, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 003, 008, 013, 016, 019, 022, 024, 025, 025, 025, 024, 022, 019, 016, 013, 008, 003, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
[000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 004, 007, 009, 011, 012, 012, 012, 011, 009, 007, 004, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
]
});Protolus.Image.Brush.SoftRound15px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '15px_soft_round';
    },
    brush : [
        [000, 000, 000, 000, 000, 007, 014, 017, 014, 007, 000, 000, 000, 000, 000],
        [000, 000, 000, 009, 026, 039, 048, 051, 048, 039, 026, 009, 000, 000, 000],
        [000, 000, 014, 037, 056, 071, 081, 085, 081, 071, 056, 037, 014, 000, 000],
        [000, 009, 037, 062, 085, 102, 114, 119, 114, 102, 085, 062, 037, 009, 000],
        [000, 026, 056, 085, 110, 132, 147, 153, 147, 132, 110, 085, 056, 026, 000],
        [007, 039, 071, 102, 132, 158, 178, 187, 178, 158, 132, 102, 071, 039, 007],
        [014, 048, 081, 114, 147, 178, 206, 221, 206, 178, 147, 114, 081, 048, 014],
        [017, 051, 085, 119, 153, 187, 221, 255, 221, 187, 153, 119, 085, 051, 017],
        [014, 048, 081, 114, 147, 178, 206, 221, 206, 178, 147, 114, 081, 048, 014],
        [007, 039, 071, 102, 132, 158, 178, 187, 178, 158, 132, 102, 071, 039, 007],
        [000, 026, 056, 085, 110, 132, 147, 153, 147, 132, 110, 085, 056, 026, 000],
        [000, 009, 037, 062, 085, 102, 114, 119, 114, 102, 085, 062, 037, 009, 000],
        [000, 000, 014, 037, 056, 071, 081, 085, 081, 071, 056, 037, 014, 000, 000],
        [000, 000, 000, 009, 026, 039, 048, 051, 048, 039, 026, 009, 000, 000, 000],
        [000, 000, 000, 000, 000, 007, 014, 017, 014, 007, 000, 000, 000, 000, 000],
    ]
});Protolus.Image.Brush.Round5px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '5px_round';
    },
    brush : [
        [000, 120, 255, 120, 000],
        [120, 255, 255, 255, 120],
        [255, 255, 255, 255, 255],
        [120, 255, 255, 255, 120],
        [000, 120, 255, 120, 000],
    ]
});Protolus.Image.Brush.Square1px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '1px_square';
    },
    brush : [
        [255],
    ]
});Protolus.Image.Brush.SoftRound5px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '5px_soft_round';
    },
    brush : [
        [000, 100, 120, 100, 000],
        [100, 150, 175, 150, 100],
        [120, 175, 200, 175, 120],
        [100, 150, 175, 150, 100],
        [000, 100, 120, 100, 000],
    ]
});Protolus.Image.Brush.SoftRound20px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '20px_soft_round';
    },
    brush : [
        [000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000],
        [000, 000, 000, 000, 000, 000, 003, 013, 019, 024, 025, 024, 019, 013, 003, 000, 000, 000, 000, 000],
        [000, 000, 000, 000, 000, 014, 026, 037, 044, 049, 051, 049, 044, 037, 026, 014, 000, 000, 000, 000],
        [000, 000, 000, 002, 019, 035, 049, 060, 069, 074, 076, 074, 069, 060, 049, 035, 019, 002, 000, 000],
        [000, 000, 000, 019, 038, 055, 071, 083, 093, 099, 102, 099, 093, 083, 071, 055, 038, 019, 000, 000],
        [000, 000, 014, 035, 055, 074, 091, 106, 117, 124, 127, 124, 117, 106, 091, 074, 055, 035, 014, 000],
        [000, 003, 026, 049, 071, 091, 110, 127, 140, 149, 153, 149, 140, 127, 110, 091, 071, 049, 026, 003],
        [000, 013, 037, 060, 083, 106, 127, 146, 163, 174, 178, 174, 163, 146, 127, 106, 083, 060, 037, 013],
        [000, 019, 044, 069, 093, 117, 140, 163, 182, 197, 204, 197, 182, 163, 140, 117, 093, 069, 044, 019],
        [000, 024, 049, 074, 099, 124, 149, 174, 197, 218, 229, 218, 197, 174, 149, 124, 099, 074, 049, 024],
        [000, 025, 051, 076, 102, 127, 153, 178, 204, 229, 255, 229, 204, 178, 153, 127, 102, 076, 051, 025],
        [000, 024, 049, 074, 099, 124, 149, 174, 197, 218, 229, 218, 197, 174, 149, 124, 099, 074, 049, 024],
        [000, 019, 044, 069, 093, 117, 140, 163, 182, 197, 204, 197, 182, 163, 140, 117, 093, 069, 044, 019],
        [000, 013, 037, 060, 083, 106, 127, 146, 163, 174, 178, 174, 163, 146, 127, 106, 083, 060, 037, 013],
        [000, 003, 026, 049, 071, 091, 110, 127, 140, 149, 153, 149, 140, 127, 110, 091, 071, 049, 026, 003],
        [000, 000, 014, 035, 055, 074, 091, 106, 117, 124, 127, 124, 117, 106, 091, 074, 055, 035, 014, 000],
        [000, 000, 000, 019, 038, 055, 071, 083, 093, 099, 102, 099, 093, 083, 071, 055, 038, 019, 000, 000],
        [000, 000, 000, 002, 019, 035, 049, 060, 069, 074, 076, 074, 069, 060, 049, 035, 019, 002, 000, 000],
        [000, 000, 000, 000, 000, 014, 026, 037, 044, 049, 051, 049, 044, 037, 026, 014, 000, 000, 000, 000],
        [000, 000, 000, 000, 000, 000, 003, 013, 019, 024, 025, 024, 019, 013, 003, 000, 000, 000, 000, 000],
    ]
});Protolus.Image.Brush.Square5px = new Class({
    Extends : Protolus.Image.Brush,
    name : function(){
        return '5px_square';
    },
    brush : [
        [255, 255, 255, 255, 255],
        [255, 255, 255, 255, 255],
        [255, 255, 255, 255, 255],
        [255, 255, 255, 255, 255],
        [255, 255, 255, 255, 255],
    ]
});Protolus.Image.Filter.Emboss = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Emboss';
    },
    emboss_a_matrix : [
        [  2.0,  0.0,  0.0  ],
        [  0.0, -1.0,  0.0 ],
        [  0.0,  0.0, -1.0  ]
    ],
    emboss_b_matrix : [
        [  0.0, 0.0,  0.0  ],
        [  0.0, 1.0,  0.0 ],
        [  0.0, 0.0, -1.0  ]
    ],
    name : function(){
        return 'emboss';
    },
    filter: function(pixels, controls){
        if(controls.type == 'a') return Protolus.Image.Booth.convolve(pixels, this.emboss_a_matrix, controls.amount, controls.threshold);
        if(controls.type == 'b') return Protolus.Image.Booth.convolve(pixels, this.emboss_b_matrix, controls.amount, controls.threshold);
        return pixels;
    },
    getControls : function(){
        return {
            'type' : {
                'value' : 'a',
                'default' : 'a',
                'options' : 'a,b',
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Filter.Laplacian = new Class({
    Extends : Protolus.Image.Filter,
    laplacian_matrix : [
        [   0.0, -1.0, 0.0  ],
        [  -1.0, 4.0, -1.0 ],
        [  0.0, -1.0, 0.0  ]
    ],
    laplacian_matrix2 : [
        [   -1.0, -1.0, -1.0  ],
        [  -1.0, 8.0, -1.0 ],
        [  -1.0, -1.0, -1.0  ]
    ],
    name : function(){
        return 'gradient_detect';
    },
    getLabel : function(){
        return 'Gradient Detector';
    },
    filter: function(pixels, controls){
        var resultA = Protolus.Image.Booth.performConvolution(pixels, this.laplacian_matrix, 2);
        var resultB = Protolus.Image.Booth.performConvolution(pixels, this.laplacian_matrix2, 2);
        return Protolus.Image.Booth.merge(resultA, resultB, 'lighten');
    },
    getControls : function(){
        return [];
    }
});Protolus.Image.Filter.GaussianBlur = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Gaussian Blur';
    },
    /*gaussianMatrix : [
        [ 1.0, 2.0, 1.0 ],
        [ 2.0, 4.0, 2.0 ],
        [ 1.0, 2.0, 1.0 ]
    ],*/
    /*gaussianMatrix : [
        [  1,  4,  7,  4,  1 ],
        [  4, 16, 26, 16,  4 ],
        [  7, 26, 41, 26,  7 ],
        [  4, 16, 26, 16,  4 ],
        [  1,  4,  7,  4,  1 ]
    ],*/
    matrix : function(x, y){
        var matrix = [];
        var row;
        var o = 0.84089642;
        //if(x > 6 * o) x = Math.ceil(6 * o);
        //if(y > 6 * o) y = Math.ceil(6 * o);
        var sum = 0;
        var count = 0;
        for(var ypos = 0; ypos < y; ypos++){
            row = [];
            var value;
            for(var xpos = 0; xpos < x; xpos++){
                value = ( 1 / (2 * Math.PI * (o^2) ) ) *
                    (Math.E^( ((x^2)+(y^2)) / (2 * (o^2)) ));
                row.push( 
                    value
                );
                sum += value
                count++;
            }
            matrix.push(row);
        }
        var avg = sum / count;
        //*
        for(var ypos = 0; ypos < y; ypos++){
            for(var xpos = 0; xpos < x; xpos++){
                matrix[ypos][xpos] = matrix[ypos][xpos]/sum;
            }
        }//*/
        return matrix;
        
    },
    name : function(){
        return 'blur';
    },
    filter: function(pixels, controls){
        //alert(profile(controls));
        var matrix = this.matrix(controls.radius, controls.radius);
        //alert(profile(matrix));
        return Protolus.Image.Booth.convolve(pixels, matrix, controls.amount, controls.threshold);
        //return Protolus.Image.Booth.performConvolution(pixels, matrix, controls.amount);
    },
    getControls : function(){
        return {
            'amount' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
            'radius' : {
                'value' : '6',
                'default' : '6',
                'upper_bound' : '12',
                'lower_bound' : '3'
            },
            'threshold' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Filter.Sharpen = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Sharpen';
    },
    sharpenMatrix : function(k){return [
        [  -1*k, -1*k, -1*k ],
        [  -1*k,  8*k+1, -1*k ],
        [  -1*k, -1*k, -1*k ]
    ];},
    name : function(){
        return 'sharpen';
    },
    filter: function(pixels, controls){
        return Protolus.Image.Booth.convolve(pixels, this.sharpenMatrix(controls.k), controls.amount, controls.threshold);;
    },
    getControls : function(){
        return {
            'k' : {
                'value' : '4',
                'default' : '4',
                'upper_bound' : '4',
                'lower_bound' : '0'
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Filter.HighPass = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'High Pass Filter';
    },
    a3x3_matrix : [
        [ -1.0, -1.0, -1.0 ],
        [ -1.0,  9.0, -1.0 ],
        [ -1.0, -1.0, -1.0 ]
    ],
    a5x5_matrix : [
        [  0.0, -1.0, -1.0, -1.0,   0.0  ],
        [  -1.0,  2.0, -4.0,  2.0,  -1.0  ],
        [  0.0, -4.0, 13.0, -4.0,  -1.0  ],
        [  0.0,  2.0, -4.0,  2.0,  -1.0  ],
        [  0.0, -1.0, -1.0, -1.0,   0.0  ],
    ],
    name : function(){
        return 'high_pass_filter';
    },
    filter: function(pixels, controls){
        if(controls.type == '3x3') return Protolus.Image.Booth.convolve(pixels, this.a3x3_matrix, controls.amount, controls.threshold);
        if(controls.type == '5x5') return Protolus.Image.Booth.convolve(pixels, this.a5x5_matrix, controls.amount, controls.threshold);
        return pixels;
    },
    getControls : function(){
        return {
            'type' : {
                'value' : '3x3',
                'default' : '3x3',
                'options' : '3x3,5x5',
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Filter.Sobel = new Class({
    Extends : Protolus.Image.Filter,
    getLabel : function(){
        return 'Sobel Edge Detector';
    },
    sobel_gy_matrix : [
        [  1.0,  2.0,  1.0 ],
        [  0.0,  0.0,  0.0 ],
        [ -1.0, -2.0, -1.0 ]
    ],
    sobel_gx_matrix : [
        [ -1.0, 0.0, 1.0 ],
        [ -2.0, 0.0, 2.0 ],
        [ -1.0, 0.0, 1.0 ]
    ],
    sobel_gy2_matrix : [
        [  -1.0, -2.0, -1.0 ],
        [  0.0,  0.0,  0.0 ],
        [  1.0,  2.0, 1.0 ]
    ],
    sobel_gx2_matrix : [
        [ 1.0, 0.0, -1.0 ],
        [ 2.0, 0.0, -2.0 ],
        [ 1.0, 0.0, -1.0 ]
    ],
    name : function(){
        return 'edge_detect';
    },
    filter: function(pixels, controls){
        var result;
        switch(controls.direction){
            case 'east' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gx_matrix, controls.amount, controls.threshold);
                break;
            case 'west' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gx2_matrix, controls.amount, controls.threshold);
                break;
            case 'north' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gy_matrix, controls.amount, controls.threshold);
                break;
            case 'south' :
                result =  Protolus.Image.Booth.convolve(pixels, this.sobel_gy2_matrix, controls.amount, controls.threshold);
                break;
            default:
                result = pixels;
        }
        return result;
    },
    getControls : function(){
        return {
            'direction' : {
                'value' : 'east',
                'default' : 'east',
                'options' : 'east,west,north,south',
            },
            'amount' : {
                'value' : '10',
                'default' : '10',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Tool.Clone = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'clone';
    },
    clonePoint : null,
    oldPoint : null,
    paint: function(brush, pixels, x, y){
        //TODO: figure out why this will not stay set without using this static to store it's state
        this.clonePoint = Protolus.Image.Booth.clonePosition;
        this.oldPoint = Protolus.Image.Booth.cloneBrushPosition;
        if(KeyboardHandler.isKeyPressed('alt')){
                this.clonePoint = {x:x, y:y};
                this.oldPoint = null;
                Protolus.Image.Booth.clonePosition = this.clonePoint;
                Protolus.Image.Booth.cloneBrushPosition = this.oldPoint;
                return pixels;
            }
        if(this.clonePoint == null || this.clonePoint == undefined){
            alert('No source! Please option-click to select a clone source.');
            return pixels;
        }
        //update clone point coordinates to be the difference in the 2
        if(this.oldPoint != null){
            //alert('ping');
            this.clonePoint.x += (x - this.oldPoint.x);
            this.clonePoint.y += (y - this.oldPoint.y);
            this.oldPoint.x = x;
            this.oldPoint.y = y;
        }else{
            this.oldPoint = {x:x, y:y};
        }
        Protolus.Image.Booth.clonePosition = this.clonePoint;
        Protolus.Image.Booth.cloneBrushPosition = this.oldPoint;
        var transparency = 0;
        var opaquness = 255 - transparency;
        // turn it into a ratio
        if(transparency != 0) transparency =  (transparency) / 255.0;
        if(opaquness != 0) opaquness = ( opaquness) / 255.0;
        var color = Protolus.Image.Booth.decodeHex(Protolus.Image.Booth.background);
        var brush = brush;
        //reset X/Y for the brush size
        var sx = pixels.width;
        var sy = pixels.height;
        //offset by half the brush size so the brush centers on the cursor
        x = x - Math.round(brush.length/2);
        y = y - Math.round(brush[0].length/2);
        var brushx, brushy;
        var pos, old_mult, new_mult, clone_pos;
        var x_offset = x - this.clonePoint.x;
        var y_offset = y - this.clonePoint.y;
        //var output = '';
        for(var ypos = y; ypos < y + brush[0].length; ypos++){
            brushy = ypos - y;
            for(xpos = x; xpos < x + brush.length; xpos++){
                brushx = xpos - x;
                if(opaquness != 0){
                    pos = ((ypos*(sx*4)) + (xpos*4));
                    clone_pos = (((ypos-y_offset)*(sx*4)) + ((xpos-x_offset)*4));
                    color = [
                        pixels.data[clone_pos    ],
                        pixels.data[clone_pos + 1],
                        pixels.data[clone_pos + 2]
                    ];
                    if(transparency != 0 || brush[brushx][brushy] != 255){ //is the overall paint at 100% opaqueness? is this portion of the brush an opaque pixel?
                        //we need to composite the 2 pixels
                        old_mult = (transparency == 0)? brush[brushx][brushy]/255 : transparency * brush[brushx][brushy]/255;
                        new_mult = opaquness * (255 - brush[brushx][brushy])/255;
                        pixels.data[pos    ] = (new_mult * pixels.data[pos    ]) + (old_mult * color[0]);
                        pixels.data[pos + 1] = (new_mult * pixels.data[pos + 1]) + (old_mult * color[1]);
                        pixels.data[pos + 2] = (new_mult * pixels.data[pos + 2]) + (old_mult * color[2]);
                        pixels.data[pos + 3] = Math.max(pixels.data[pos + 3], brush[brushx][brushy]);
                    }else{ //draw in the opaque pixel
                        pixels.data[pos    ] = brush[brushx][brushy]/255 * color[0];
                        pixels.data[pos + 1] = brush[brushx][brushy]/255 * color[1];
                        pixels.data[pos + 2] = brush[brushx][brushy]/255 * color[2];
                        pixels.data[pos + 3] = brush[brushx][brushy];
                    }
                } // if we fail this test, we don't need to draw this pixel, it's the same as the old one
            }
        }
        //alert(output);
        return pixels;
    },
});Protolus.Image.Tool.Paintbrush = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'paintbrush';
    },
    paint: function(brush, pixels, x, y){
        //the following numbers are reflections across the value scale
        var transparency = 0;
        var opaquness = 255 - transparency;
        // turn it into a ratio
        if(transparency != 0) transparency =  (transparency) / 255.0;
        if(opaquness != 0) opaquness = ( opaquness) / 255.0;
        var color = Protolus.Image.Booth.decodeHex(Protolus.Image.Booth.foreground);
        var brush = brush;
        //reset X/Y for the brush size
        var sx = pixels.width;
        var sy = pixels.height;
        //offset by half the brush size so the brush centers on the cursor
        x = x - Math.round(brush.length/2);
        y = y - Math.round(brush[0].length/2);
        var brushx, brushy;
        var pos, old_mult, new_mult;
        for(var ypos = y; ypos < y + brush[0].length; ypos++){
            brushy = ypos - y;
            for(xpos = x; xpos < x + brush.length; xpos++){
                brushx = xpos - x;
                if(opaquness != 0){
                    pos = ((ypos*(sx*4)) + (xpos*4));
                    if(transparency != 0 || brush[brushx][brushy] != 255){ //is the overall paint at 100% opaqueness? is this portion of the brush an opaque pixel?
                        //we need to composite the 2 pixels
                        old_mult = (transparency == 0)? brush[brushx][brushy]/255 : transparency * brush[brushx][brushy]/255;
                        new_mult = opaquness * (255 - brush[brushx][brushy])/255;
                        pixels.data[pos    ] = (new_mult * pixels.data[pos    ]) + (old_mult * color[0]);
                        pixels.data[pos + 1] = (new_mult * pixels.data[pos + 1]) + (old_mult * color[1]);
                        pixels.data[pos + 2] = (new_mult * pixels.data[pos + 2]) + (old_mult * color[2]);
                        pixels.data[pos + 3] = Math.max(pixels.data[pos + 3], brush[brushx][brushy]);
                    }else{ //draw in the opaque pixel
                        pixels.data[pos    ] = brush[brushx][brushy]/255 * color[0];
                        pixels.data[pos + 1] = brush[brushx][brushy]/255 * color[1];
                        pixels.data[pos + 2] = brush[brushx][brushy]/255 * color[2];
                        pixels.data[pos + 3] = brush[brushx][brushy];
                    }
                } // if we fail this test, we don't need to draw this pixel, it's the same as the old one
            }
        }
        return pixels;
    },
});Protolus.Image.Tool.Eraser = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'eraser';
    },
    paint: function(brush, pixels, x, y){
        //TODO: implement transparent layer erasing
        //the following numbers are reflections across the value scale
        var transparency = 0;
        var opaquness = 255 - transparency;
        // turn it into a ratio
        if(transparency != 0) transparency =  (transparency) / 255.0;
        if(opaquness != 0) opaquness = ( opaquness) / 255.0;
        var color = Protolus.Image.Booth.decodeHex(Protolus.Image.Booth.background);
        var brush = brush;
        //reset X/Y for the brush size
        var sx = pixels.width;
        var sy = pixels.height;
        //offset by half the brush size so the brush centers on the cursor
        x = x - Math.round(brush.length/2);
        y = y - Math.round(brush[0].length/2);
        var brushx, brushy;
        var pos, old_mult, new_mult;
        for(var ypos = y; ypos < y + brush[0].length; ypos++){
            brushy = ypos - y;
            for(xpos = x; xpos < x + brush.length; xpos++){
                brushx = xpos - x;
                if(opaquness != 0){
                    pos = ((ypos*(sx*4)) + (xpos*4));
                    if(transparency != 0 || brush[brushx][brushy] != 255){ //is the overall paint at 100% opaqueness? is this portion of the brush an opaque pixel?
                        //we need to composite the 2 pixels
                        old_mult = (transparency == 0)? brush[brushx][brushy]/255 : transparency * brush[brushx][brushy]/255;
                        new_mult = opaquness * (255 - brush[brushx][brushy])/255;
                        pixels.data[pos    ] = (new_mult * pixels.data[pos    ]) + (old_mult * color[0]);
                        pixels.data[pos + 1] = (new_mult * pixels.data[pos + 1]) + (old_mult * color[1]);
                        pixels.data[pos + 2] = (new_mult * pixels.data[pos + 2]) + (old_mult * color[2]);
                        pixels.data[pos + 3] = Math.max(pixels.data[pos + 3], brush[brushx][brushy]);
                    }else{ //draw in the opaque pixel
                        pixels.data[pos    ] = brush[brushx][brushy]/255 * color[0];
                        pixels.data[pos + 1] = brush[brushx][brushy]/255 * color[1];
                        pixels.data[pos + 2] = brush[brushx][brushy]/255 * color[2];
                        pixels.data[pos + 3] = brush[brushx][brushy];
                    }
                } // if we fail this test, we don't need to draw this pixel, it's the same as the old one
            }
        }
        return pixels;
    },
});Protolus.Image.Tool.Paintbucket = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'paintbucket';
    },
    paint: function(brush, pixels, x, y, sourceColor, foreground){
        var options = ImageBoothApplication.brushOptions;
        var pos = ((y*(pixels.width*4)) + (x*4));
        var hits = [];
        if(sourceColor == null){
            sourceColor = [pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]];
            foreground = hex2rgb(Protolus.Image.Booth.foreground);
        }
        var stack = [];
        stack.push([x, y, 'left']);
        var item, opacity;
        opacity = (options.opacity/100);
        while(stack.length > 0){
            pos = ((y*(pixels.width*4)) + (x*4));
            item = stack.pop();
            x = item[0];
            y = item[1];
            if(
                !hits[pos] &&
                colorDiff(
                    sourceColor[0], 
                    sourceColor[1], 
                    sourceColor[2], 
                    pixels.data[pos], 
                    pixels.data[pos+1], 
                    pixels.data[pos+2]
                ) < (options.amount/100)
            ){
                pixels.data[pos] = (foreground[0]*opacity) + ((1.0-opacity)*pixels.data[pos]);
                pixels.data[pos+1] = (foreground[1]*opacity) + ((1.0-opacity)*pixels.data[pos+1]);
                pixels.data[pos+2] = (foreground[2]*opacity) + ((1.0-opacity)*pixels.data[pos+2]);
                hits[pos] = true;
                switch(item[2]){
                    case 'left' :
                        stack.push([x, y, 'right']);
                        x--
                        if(x >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]){
                            stack.push([x, y, 'left']);
                        }
                        break;
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
                continue;
            }
            if(item[2] != 'left'){
                switch(item[2]){
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
            }
        }
        return pixels;
    },
    getControls : function(){
        return {
            'amount' : {
                'value' : '50',
                'default' : '50',
                'upper_bound' : '100',
                'lower_bound' : '0'
            },
            'opacity' : {
                'value' : '100',
                'default' : '100',
                'upper_bound' : '100',
                'lower_bound' : '0'
            },
        };
    }
});Protolus.Image.Tool.Eyedropper = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'eyedropper';
    },
    paint: function(brush, pixels, x, y){
        var pos = ((y*(pixels.width*4)) + (x*4));
        Protolus.Image.Booth.foreground = rgb2hex(pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]);
        if(Protolus.Image.Booth.gui) Protolus.Image.Booth.gui.repaintColors();
        return pixels;
    },
});Protolus.Image.Operation.BightnessContrast = new Class({
    Extends: Protolus.Image.Operation,
    name : function(){
        return 'brightness_contrast';
    },
    getLabel : function(){
        return 'Brightness/Contrast';
    },
    operate: function(pixels, controls){
        Protolus.Image.Booth.convolveBuffer.setProperty('width', pixels.width);
        Protolus.Image.Booth.convolveBuffer.setProperty('height', pixels.height);
        controls.contrast = (controls.contrast+150)/150;
        //controls.brightness = (controls.brightness+150)/150;
        var context = Protolus.Image.Booth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        var legacy = true;
		//contrast = Math.max(0,controls.contrast+1);
        var mul, add;
        if (legacy) {
            mul = controls.contrast;
            add = (Math.min(150,Math.max(-150,controls.brightness)) - 128) * controls.contrast + 128;
        } else {
            mul = (1 + Math.min(150,Math.max(-150,controls.brightness)) / 150) * controls.contrast;
            add = - controls.contrast * 128 + 128;
        }
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                pos = ((y*(sx*4)) + (x*4));
                r = pixels.data[pos    ] * mul + add;
                g = pixels.data[pos + 1] * mul + add;
                b = pixels.data[pos + 2] * mul + add;
                newPixels.data[pos    ] = (r < 255)? ((r < 0)? 0 : r) : 255;
                newPixels.data[pos + 1] = (g < 255)? ((g < 0)? 0 : g) : 255;
                newPixels.data[pos + 2] = (b < 255)? ((b < 0)? 0 : b) : 255;
                newPixels.data[pos + 3] = pixels.data[pos + 3];
            }
        }
        return newPixels;
    },
    getControls : function(){
        return {
            'brightness' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '150',
                'lower_bound' : '-150'
            },
            'contrast' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '150',
                'lower_bound' : '-150'
            },
        };
    }
});
Protolus.Image.Operation.Negative = new Class({
    Extends: Protolus.Image.Operation,
    name : function(){
        return 'negative';
    },
    getLabel : function(){
        return 'Negative';
    },
    operate: function(pixels, controls){
        Protolus.Image.Booth.convolveBuffer.setProperty('width', pixels.width);
        Protolus.Image.Booth.convolveBuffer.setProperty('height', pixels.height);
        var context = Protolus.Image.Booth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                newPixels.data[((y*(sx*4)) + (x*4))    ] = 255 - pixels.data[((y*(sx*4)) + (x*4))    ];
                newPixels.data[((y*(sx*4)) + (x*4)) + 1] = 255 - pixels.data[((y*(sx*4)) + (x*4)) + 1];
                newPixels.data[((y*(sx*4)) + (x*4)) + 2] = 255 - pixels.data[((y*(sx*4)) + (x*4)) + 2];
                newPixels.data[((y*(sx*4)) + (x*4)) + 3] = pixels.data[((y*(sx*4)) + (x*4)) + 3];
            }
        }
        return newPixels;
    },
    getControls : function(){
        return [];
    }
});this.Protolus = Protolus; })(); if (typeof exports != 'undefined') (function(){ for (var key in this) if (!GLOBAL_ITEMS.contains(key)){ exports[key] = this[key]; } exports.apply = function(object){ Object.append(object, exports); }; })();
