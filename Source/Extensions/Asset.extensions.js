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
Asset.cssWithNoCallback = Asset.css;
Asset.css = function(file, attributes){
    if(attributes.callback){
        var cb = attributes.callback;
        delete attributes.callback;
        if(Asset.cssTest(file, cb)) cb();
        else
    }else{
        console.log('fxvzfzdgz');
    }
}
Asset.cssTest = function(file, callback){
    var id = '_'+file.replace(/[^-a-z0-9A-Z]/gi,"")+'_load_test';
    var visible = (new Element('div', {
        class : id
    }));
    console.log(visible);
    //this.Asset.cssTest.delay(20, this, [file, callback]);
}