//global js here
var socket = io.connect('http://localhost:11198');
var capitalize = function(str){
    return str.toLowerCase().replace('_', ' ').replace(
        /^.|\s\S/g, 
        function(a) { return a.toUpperCase(); }
    );
};
var budget = {};
budget.session_id = false;
budget.lineItems = {};
budget.lineItems.fields = [];
budget.lineItems.fieldOptions = {};

document.check = function(){
    socket.emit('hierarchy-request', {
        type : 'budget',
        session_id : budget.session_id,
        hierarchies : [
            ['superfund', 'fund', 'department'],
            ['department', 'division']
        ]
    });
};
    
document.addEvent('domready', function(){
    (new Request({
        'url' : 'Test/rule.txt',
        onSuccess : function(code){
            window.ruleInput = new RulesInputPanel(document.id('well'), {
                toolbarElement : document.id('gui'),
                rules : [
                    code
                ]
            });
            window.ruleInput.callback = false;
            window.ruleInput.communicator = function(rules, callback){ //do rule
                window.rules.callback = callback;
                socket.emit('rules-set', {
                    rules : rules.rules,
                    session_id : budget.session_id
                });
            }
        }
    })).send();
    /*window.ruleInput = new RulesInputPanel(document.id('well'), {
        toolbarElement : document.id('gui'),
        rules : [
            "var budget = []; \
            var o = 4 + (3 * 6) >= 0;\
            budget.o.forEach(function(item){\
                item.rule_based = false;\
                item.jobs = '';\
            });\
            var blah = function(){\
                var b = [];\
            };"
        ]
    });*/
    //var tb = window.ruleInput.getToolbar(); //get toolbar for the 1st rule
    //var rule = new RulesGUI.Rule(document.id('well'));
    //var tb = new RulesGUI.Toolbar(document.id('gui'), {
    //    rules : [rule]
    //});
    //var rule = window.ruleInput.rules[0];
    //rule.parse = make_parse();
    //rule.parse.error = console.log;
    /*rule.load("var budget = []; \
    var o = 4 + (3 * 6) >= 0;\
    budget.o.forEach(function(item){\
        item.rule_based = false;\
        item.jobs = '';\
    });\
    var blah = function(){\
        var b = [];\
    };");*/
    
    window.filters = new FilterInputPanel('filters');
    window.filters.callback = false;
    window.filters.communicator = function(fields, callback){ //do filter
        window.filters.callback = callback;
        socket.emit('filter-set', {
            filters : fields,
            session_id : budget.session_id
        });
    }
    
    //window.ruleInput = new RulesInputPanel('rules');
    
    var dataGrid = new EditableGrid("BudgetGrid", {baseUrl : 'App/Resources/Table'});
    var employeeGrid = new EditableGrid("EmployeeGrid", {baseUrl : 'App/Resources/Table'});
    
    //ensure budget load
    var payload = {
        filters : [{
            field : 'year',
            value : 2013
        }]
    };
    var session_id = Cookie.read('simulation_session_id');
    if(session_id && session_id != '' && session_id != 'undefined') payload.session_id = session_id;
    else payload.city = 'paloalto';
    socket.emit('budget', payload);
    //refresh enumerations
    var refreshFieldOptions = function(data){
        budget.lineItems.fieldOptions = {};
        data.data.budget.each(function(item){
            budget.lineItems.fields.each(function(fieldName){
                if(!budget.lineItems.fieldOptions[fieldName]) budget.lineItems.fieldOptions[fieldName] = [];
                if(!budget.lineItems.fieldOptions[fieldName].contains(item[fieldName])) budget.lineItems.fieldOptions[fieldName].push(item[fieldName]);
            });
        });
    };
    //refresh column names
    var refreshFields = function(data){
        console.log('data', data);
        var result = [];
        data.data.budget.each(function(item){
            var keys = Object.keys(data.data.budget[0]);
            keys.each(function(key){
                if(key.indexOf('_') !== 0){
                    if(!result.contains(key)) result.push(key);
                }
            });
        });
        budget.lineItems.fields = result;
    };
    //load the main data table
    var loadGrid = function(data){
        //*
        console.log('data', data);
        var metadata = [];
        if(data.data.budget[0]){
            var keys = Object.keys(data.data.budget[0]);
            keys.each(function(key){
                if(key.indexOf('_') !== 0){
                    if(key == 'amount'){
                        metadata.push({ name: key, label: capitalize(key), datatype: "double($)", editable: true});
                    }else{
                        metadata.push({ name: key, label: capitalize(key), datatype: "string", editable: true});
                    }
                }
            });
        }
        var gridData = [];
        data.data.budget.each(function(item){
            gridData.push({id:item['_id'], values:item});
        });
        dataGrid.load({ "metadata":metadata, "data": gridData});
        dataGrid.renderGrid("tablecontent", "testgrid");
        
        
        metadata = [];
        if(data.data.budget[0]){
            var keys = Object.keys(data.data.employees[0]);
            keys.each(function(key){
                if(key.indexOf('_') !== 0){
                    if(key == 'amount'){
                        metadata.push({ name: key, label: capitalize(key), datatype: "double($)", editable: true});
                    }else{
                        metadata.push({ name: key, label: capitalize(key), datatype: "string", editable: true});
                    }
                }
            });
        }
        gridData = [];
        data.data.employees.each(function(item){
            gridData.push({id:item['_id'], values:item});
        });
        employeeGrid.load({ "metadata":metadata, "data": gridData});
        employeeGrid.renderGrid("employeetablecontent", "testgrid");
        //*/
    };
    //document.id(document.body).spin({message: 'Loading Budget Data'});
    
    //React to server events
    socket.on('load', function (data) {
        console.log('load', data);
        document.id(document.body).unspin();
        refreshFields(data);
        refreshFieldOptions(data);
        loadGrid(data);
        budget.session_id = data.session_id;
        Cookie.write('simulation_session_id', data.session_id);
        window.rules.populate(data.rules);
        if(data.filters) filters.populate(data.filters);
        
    });
    socket.on('update', function (data) {
        document.id('warnings').empty();
        loadGrid(data);
    });
    socket.on('error', function (ex) {
        console.log('ERROR', ex);
        if(ex.error === 'bad_session'){
            Cookie.dispose('simulation_session_id');
            window.location.reload();
        }else alert(ex.error);
    });
    socket.on('filter-set-return', function (data) {
        loadGrid(data);
        if(window.filters.callback){
            window.filters.callback(data);
            delete window.filters.callback;
        }
    });
    socket.on('filter-set-return', function (data) {
        loadGrid(data);
        if(window.filters.callback){
            window.filters.callback(data);
            delete window.filters.callback;
        }
    });
    socket.on('hierarchy-enumerations', function (result) {
        console.log('hierarchy-enumerations', result);
    });
    socket.on('warning', function (data) {
        console.log('WARNING', data);
        if(typeOf(data) == 'string'){
            (new Element('span',{
                html : data+'<br/>'
            })).inject(document.id('warnings'));
        }else{
            (new Element('span',{
                html : data.message + (data.amount?' [' + data.amount + ']':'')+'<br/>'
            })).inject(document.id('warnings'));
        }
    });
});