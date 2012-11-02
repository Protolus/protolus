Protolus.js
===========

Protolus.js is a Node.js Application framework, for rapid development and iteration of web applications.

How to use
----------

Protolus consists of 3 major subsystems and a couple of minor ones:

1. Templating : Protolus supports templating using a subset of the Smarty syntax or alternatively other existing template languages (or your own). The key feature is render flow is controlled by the view rather than the 'controller' logic (which only serves to populate data for a given interface).
2. Data : There is a data stub interface which abstracts the Data implementation from those using data stubs without each type of selection requiring member functions on the stub object.
3. Resource Bundling : While CommonJS and AMD have done a good job of thinking through the issues of encapsulating JS resources and to a limited extent sharing it between environments, there has been no thought or effort put into the other resources it takes to build a working web app. Our resource bundler supports mixed data types both in the browser and in the mid tier.
4. Routing : aliasing URLs to other URLs or Arguments. The Protolus routing system is entirely text based and does not require you to encapsulate the whole of the routed outcome in the body of a function.
5. Configuration : Protolus uses JSON based configuration files based on your PROTOLUS_MACHINE_TYPE environment variable (defaulting to 'production')

Templating
----------
//todo

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
    
One thing to note: This data layer is designed to discourage both streaming data sets and joins which generally impact production machines in bad ways. If you need these features or you find this level of indirection uncomfortable you should probably manipulate the DB directly and skip the whole data layer (or even better, interface with an API). 

Other Datasource specific features (for example MapReduce under mongo) must be accessed from the DB driver directly which may be accessed directly:

    Datasource::get('myAwesomeDatasource');

But when you do this you are circumventing the data layer (other than letting protolus negotiate the connection for you).
    

ResourceBundling
----------------
Resource Bundles are also configured by a JSON file, which defines the list of files included in this component as well as any other resources it depends on.

//todo

Abbey Hawk Sparrow