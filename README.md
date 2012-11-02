Protolus.js
===========

Protolus.js is a Node.js/Client Application framework, for rapid development and iteration of web applications.

How to use
----------

Protolus consists of 3 major subsystems and a couple of minor ones:

1. Templating : Protolus supports templating using a subset of the Smarty syntax or alternatively other existing template languages (or your own). The key feature is render flow is controlled by the view rather than the 'controller' logic (which only serves to populate data for a given interface).
2. Data : There is a data stub interface which abstracts the Data implementation from those using data stubs without each type of selection requiring member functions on the stub object.
3. Resource Bundling : While CommonJS and AMD have done a good job of thinking through the issues of encapsulating JS resources and to a limited extent sharing it between environments, there has been no thought or effort put into the other resources it takes to build a working web app. Our resource bundler supports mixed data types both in the browser and on the server.
4. Routing : aliasing URLs to other URLs or Arguments. The Protolus routing system is entirely text based and does not require you to encapsulate the whole of the routed outcome in the body of a function.
5. Configuration : Protolus uses JSON based configuration files based on your PROTOLUS_MACHINE_TYPE environment variable (defaulting to 'production')

Templating
----------
The templates started as an experiment to validate recursive smarty rendering in php, and slowly extended from there incorporating multi-level controllers, wrappers, 2nd pass javascript injection, AB Testing, and (in conjunction with Data) full MVC abstraction. The basic concept is that a unit of work is a 'panel' which is a chunk of html which adds the Macro language Smarty to add render logic to the basic HTML, on top of this we add a number of macros which add awareness of our environment along with macros to control special features. When it moved to JS it naturally came along with a new parser/renderer.

The template itself is an HTML file using a set of macro tags optionally coupled with a controller
###Macros
1. **page**
This is where we set the main data for the page macro, and should be set on the entry panel of all requests (rather than us manually setting them in the controller, and thus obfuscating it from the GUI layer).
    1. title : this is the actual title tag content
    2. heading: page heading, used as a subsection label, but can be used for most anything.
    3. meta: text for the meta tag
    4. wrapper: this is the wrapper that we will render the page inside of
            
2. **panel**
    This is where a subpanel is rendered as well as a test is defined. In order to render a panel:
        
        {panel name="path/relative/to/panel/root"}
        
    It also accepts a 'params' argument which is an associative array of the parameters being passed in. To define a test on any given panel, just add the test panels with the format <identifier>_test such as:
        
        {panel name="path/relative/to/panel/root" my_test="anotherpath/relative/to/panel/root"}
        
    to create a conversion for a given test
        
        {convert name="path/relative/to/panel/root"}
        
    convert also allows you an additional 'drop' parameter that gives you a little flexibility on how the conversion happens:
            1. timer(<seconds>) prevents the conversion from firing until the user has persisted on the view for the specified interval.
        
3. **value**
    Any value can be be output in the form:
        
        {$var}
        
    or
        
        {$var.subvalue}
        
4. **if**
    the if construct allows you to conditionally execute logic, for example:
            
        {if $hasItem}
            <!--iterate over list-->
        {/if}
            
    it also supports else clauses:
            
        {if $myList.length > 0}
            <!--iterate over list-->
        {else}
            <!--show 'no data' state-->
        {/if}
5. **foreach**
    You can iterate across a collection using the foreach macro which supports 3 attributes
    1. from : the object or array we are iterating over
    2. item : the variable name we store the current iteration's value in
    3. key : the variable name we store the current iteration's key in
    
    as an example:

        {foreach from="$thing" item="item" key="key"}
            <li>{$key}:{$item}</li>
        {/foreach}
    
###Controllers
A controller is just an arbitrary piece of JS which allows you to register data with the view's renderer. This is exposed as 'renderer' in the scope of the controller where you do the assignments.
        
        renderer.set('myValue', aVariable);
        
You can use the data layer, interact with an API or manually manage these resources the controllers are raw node.js, so they are agnostic to the origin of the data.
    
###Wrappers

Wrappers are a special kind of template which renders upon completion of the inner content generation and serve as a container for global page structure which you want to persist across many pages. The wrapper, like a panel, also has an optional controller, and it attempts to write the rendered page into the 'content' variable.

Resources may be targeted to outputs (by default all output will be to 'HEAD' which is assumed to be at the bottom of your HEAD tag) which occur within the wrapper. Let's look at the simplest working example: sample.wrapper.tpl

    <html>
        <head>
            <title>WTFBBQ!</title>
            {$HEAD}
        </head>
        <body>
            {$content}
        </body>
    </html>
    

Data
----------
Datasources are registered by creating an entry in the configuration

Let's say you want to create a class to represent alien invaders (in this case Red 'Lectroids) containing a few fields('ganglia_state', 'institutionalized', 'ship_completeness', 'origin_dimension'), you'd name your file based on your classname in the 'Classes' directory, such as 'RedLectroid.js'.

an example looks like:

    new Class({
        Extends : Data,
        initialize : function(options){
            //if options comes in as a string, we assume it's the key we're selection (AKA 'id')
            if(typeOf(options) == 'string') options = {key:options};
            if(!options) options = {};
            //link this to a particular datasource (defined in your configuration)
            options.datasource = 'myAwesomeDatasource';
            //this is the storage location for this object (think table or collection name)
            options.name = 'red_lectroid';
            this.fields = [
                'ganglia_state',
                'institutionalized',
                'ship_completeness',
                'origin_dimension'
            ];
            this.primaryKey = 'id';
            this.parent(options);
            if(options.key) this.load(options.key);
        }
    });
    
You would use this class like this:

    var DrEmilioLizardo = new RedLectroid();
    DrEmilioLizardo.set('ganglia_state', 'twitching');
    DrEmilioLizardo.set('institutionalized', true);
    DrEmilioLizardo.set('ship_completeness', 0.90);
    DrEmilioLizardo.set('origin_dimension', 8);
    DrEmilioLizardo.save();
    
And you would search for a set using:

    Data::search('RedLectroid', "institutionalized == true");
    
or if you only wanted the data payload (not a set of objects)

    Data::query('RedLectroid', "institutionalized == true");
    
One thing to note: This data layer is designed to discourage both streaming data sets and joins. If you need these features or you find this level of indirection uncomfortable you should probably manipulate the DB directly and skip the whole data layer (or even better, interface with an API). 

Other Datasource specific features (for example MapReduce under mongo) must be accessed from the DB driver directly which may be accessed directly:

    Datasource::get('myAwesomeDatasource').connection;

But when you do this you are circumventing the data layer (other than letting protolus negotiate the connection for you).
    

ResourceBundling
----------------
Resource Bundles are also configured by a JSON file, which defines the list of files included in this component as well as any other resources it depends on.

Routing
-------

Configuration
-------------
    

//todo

Abbey Hawk Sparrow