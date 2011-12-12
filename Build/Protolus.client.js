var GLOBAL_ITEMS = function(){
    var items = [];
    for (var key in this) items.push(key);
    return items;
}();

/*
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
});/*
---
description: An extensible Mootools object container bridging to a pureJS SAX parser

license: [MIT-style, LGPL]

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.XMLParser]
...
*/
Protolus.TagParser = new Class({ //my ultra-slim tag parser
    strict : true,
    opener : '<',
    closer : '>',
    attributeAssign : '=',
    attributeDelimiters : ['"'],
    closeEscape : '/',
    allowUndelimitedAttributes : false,
    literalTags : [],
    unaryTags : [],
    specialTags : {},
    initialize: function(options){
        Object.each(options, function(option, name){
            this[name] = option;
        }.bind(this));
        if(typeOf(this.literalTags) == 'string') this.literalTags = this.literalTags.split(',');
        if(typeOf(this.attributeDelimiters) == 'string') this.attributeDelimiters = this.attributeDelimiters.split(',');
        console.log(['this', this]);
    },
    open: function(tag){
        console.log('open:'+tag.name);
    },
    content: function(text){
        console.log('con:'+text);
    },
    close: function(tag){
        console.log('close:'+tag.name);
    },
    error: function(exception){
        console.log(exception);
    },
    parse: function(xmlChars){
        var tagOpen = false;
        var currentTag = '';
        var content = '';
        var ch;
        var tagStack = [];
        var literalMode = false;
        var strictError = 'Strict parse error: Unmatched Tag!';
        for(var lcv = 0; lcv < xmlChars.length; lcv++){
            ch = xmlChars[lcv];
            console.log(['char', ch]);
            if(tagOpen){
                if(ch == this.closer){
                    console.log('closer');
                    var tag = this.parseTag(currentTag);
                    if(tag.name[0] == this.closeEscape){
                        console.log('close closing tag');
                        tag.name = tag.name.substring(1);
                        this.close(tag);
                        var lastTag = tagStack.pop();
                        if(this.strict && lastTag.name != tag.name){
                            this.error(strictError+' ['+lastTag.name+']');
                            return;   
                        }
                        literalMode = this.literalTags.contains(tagStack[tagStack.length-1]);
                    }else{
                        console.log('close opening tag');
                        this.open(tag);
                        tagStack.push(tag);
                        literalMode = this.literalTags.contains(tagStack[tagStack.length-1]);
                        if(currentTag[currentTag.length-1] == this.closeEscape || this.unaryTags.contains(tag.name)){
                            this.close(tag);
                            var lastTag = tagStack.pop();
                            if(this.strict && lastTag.name != tag.name){
                                this.error(strictError+' ['+lastTag.name+']');
                                return;
                            }
                            literalMode = this.literalTags.contains(tagStack[tagStack.length-1]);
                        }
                    }
                    tagOpen = false;
                }else currentTag += ch;
                console.log('tag char');
            }else{
                if(!literalMode && ch == this.opener){
                    console.log('found open');
                    currentTag = '';
                    tagOpen = true;
                    if(content.trim() != '') this.content(content.trim());
                    content = '';
                }else content += ch;
                console.log('ch++');
            }
        }
        if(content.trim() != '') this.content(content.trim());
        this.root = lastTag;
        return lastTag;
    },
    parseTag: function(tag){
        var ch;
        var currentValue = '';
        var tagName = false;
        var attributeName = false;
        var inQuote = false;
        var attributes = {};
        for(var lcv = 0; lcv < tag.length; lcv++){
            ch = tag[lcv];
            if(tagName){
                var endedQuote = false;
                if(inQuote){
                    if(inQuote == ch){ //end of quote
                        inQuote = false;
                        endedQuote = true;
                    }else{
                        currentValue += ch;
                        continue;
                    }
                }else{
                    if(this.attributeDelimiters.contains(ch)){
                        inQuote = ch;
                        continue;
                    }
                }
                if(attributeName){
                    if(ch == ' ' || endedQuote){
                        attributes[attributeName.trim()] = currentValue;
                        attributeName = false;
                        currentValue = '';
                    }else currentValue += ch;
                }else{
                    if(ch == this.attributeAssign){
                        attributeName = currentValue;
                        currentValue = '';
                    }else currentValue += ch;
                }
                this.attributeDelimiters.contains(ch)
            }else{
                if(ch == ' '){
                    tagName = currentValue;
                    currentValue = '';
                }else currentValue += ch;
            }
        }
        if(attributeName && currentValue != ''){
            attributes[attributeName.trim()] = currentValue;
        }
        if(!tagName) tagName = currentValue;
        return {
            name: tagName,
            attributes: attributes
        };
    }
});/*
---
description: An extensible Smarty Parser in Mootools

license: MIT-style

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Protolus.Template, Protolus.Template.Node]
...
*/
Protolus.Template = new Class({
    Extends : Protolus.TagParser,
    parsedTemplate : null,
    tagRegistry : null,
    tagStack : [],
    root : null,
    initialize: function(text, options){
        this.tagRegistry = new Protolus.Registry();
        this.parent(options);
        this.root = new Protolus.Template.RootNode();
        this.tagStack.push(this.root);
        this.parsedTemplate = this.parse(text);
        console.log(['template', this.parsedTemplate]);
    },
    open: function(tag){
        console.log('open:'+tag.name);
        if(!this.tagRegistry[tag.name]) throw('Unkown tag('+tag.name+')');
        this.tagStack.push(new this.tagRegistry[tag.name](tag.name, tag.attributes));
    },
    content: function(text){
        this.tagStack[this.tagStack.length-1].addChild(new Protolus.Template.TextNode(text));
    },
    close: function(tag){
        this.tagStack.pop();
    },
    render : function(data, callback){
        return this.root.render();
    }
    
});
Protolus.Template.Node = new Class({ //basically an XML Node
    name: null,
    attributes : {},
    content: '',
    children: [],
    initialize: function(name, attributes){
        this.name = name;
        if(attributes) Object.each(attributes, function(attribute, key){
            attributes[key] = attribute;
        }.bind(this));
    },
    setContent: function(text){
        this.content = text;
    },
    addChild: function(node){
        this.children.push(node);
    },
    getChild: function(id){
        if(typeOf(id) == 'integer') return this.children[id];
        else{
            var result = false;
            this.children.each(function(child){
                if(child.name == id) result = child;
            }.bind(this));
            return result;
        }
    },
    render: function(){
        throw('Render not implemented!');
    }
});
Protolus.Template.TextNode = new Class({
    Extends: Protolus.Template.Node,
    render: function(){
        return this.content;
    }
});
Protolus.Template.RootNode = new Class({
    Extends: Protolus.Template.Node,
    renderFunction : null,
    initialize : function(){
    },
    render: function(){
        var result = '';
        this.children.each(function(child){
            result += child.render();
        });
        return result;
    }
});
Protolus.Template.GenericNode = new Class({
    Extends: Protolus.Template.Node,
    renderFunction : null,
    initialize : function(renderFunction){
        this.renderFunction = renderFunction;
    },
    render: function(){
        return this.renderFunction(this);
    }
});
Protolus.Template.registry = new Protolus.Registry();
Protolus.Template.scan = function(type, classObject){
    var templates = document.getElements('head style[@type="protolus/'+type+'"]');
    templates.each(function(item, index){
        console.log('Registered '+item.getAttribute('name')+'.');
        Protolus.Template.registry.register(item.getAttribute('name'), new classObject(item.innerHTML));
    });
};
Protolus.Template.render = function(name, data, callback){
    var template = Protolus.Template.registry.get(name);
    if(!template) throw('No template '+name);
    template.render(data, callback);
};/*
---
description: An extensible Mootools object container bridging to a pureJS SAX parser

license: [MIT-style]

authors:
- Abbey Hawk Sparrow

requires:
    core/1.2.4: '*'

provides: [Midas.XMLParser]
...
*/
if(!Protolus) var Protolus = {};
Protolus.HTMLParser = new Class({
    Extends : Protolus.TagParser,
    root : null,
    nodeStack : [],
    initialize: function(){
        this.parent({
            strict : true,
            opener : '<',
            closer : '>',
            attributeAssign : '=',
            attributeDelimiters : ['"', "'"],
            closeEscape : '/',
            allowUndelimitedAttributes : false,
            literalTags : ['script'],
            unaryTags : ['br', 'hr', 'img']
        });
        this.root = new Element('root');
        this.  nodeStack.push(this.root);
    },
    open: function(tagName, attributes){
        var element = new Element(tagName, attributes);
        this.nodeStack.getLast().appendChild(element);
        this.nodeStack.push(element);
    },
    content: function(text){
        this.nodeStack.getLast().appendText(text);
    },
    close: function(tagName){
        this.nodeStack.pop(element);
    }
});/*
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
Protolus.Template.Smarty = new Class({
    Extends : Protolus.Template,
    initialize: function(text){
        this.parent(text, {
            strict : true,
            opener : '{',
            closer : '}',
            attributeAssign : '=',
            attributeDelimiters : ['"', "'"],
            closeEscape : '/',
            allowUndelimitedAttributes : true,
            literalTags : ['literal'],
            specialTags : {
                'if':function(text){
                    
                },
                'for':function(text){
                
                }
            }
        });
        this.tagRegistry.register('test', new Protolus.Template.GenericNode(function(node){
            return 'this is a test';
        }));
    },
    render: function(){
        
    }
});
Protolus.Template.Smarty.scan = function(){
    Protolus.Template.scan('smarty', Protolus.Template.Smarty);
};