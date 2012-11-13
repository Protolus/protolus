var FilterInputPanel = new Class({
    element : null,
    communicator : null,
    initialize : function(element, options){
        this.element = document.id(element);
    },
    harvest : function(){
        var rows = this.element.getElements('.filter');
        var results = [];
        rows.each(function(row){
            var fieldElement = row.getElement('.fieldSelector');
            var operatorElement = row.getElement('.operationSelector');
            var valueElement = row.getElement('.valueField');
            results.push({
                field : fieldElement.value,
                operator : operatorElement.value,
                value : valueElement.value
            })
        });
        return results;
    },
    makeFieldInput : function(field, operator, value){
        var input;
        switch(operator){
            case '==':
            case '=':
            case '>=':
            case '<=':
                input = new Element('select', {'class':'valueField'});
                budget.lineItems.fieldOptions[field].each(function(fieldValue){
                    (new Element('option', {html:fieldValue})).inject(input);
                });
                break;
            default:
                input = new Element('input', {
                    type:'text',
                    'class':'valueField'
                });
        }
        if(value) input.set('value', value);
        return input;
    },
    populate : function(data){
        data.each(function(item){
            this.new(item);
        }.bind(this))
    },
    push : function(callback){
        if(this.communicator) this.communicator(this.harvest(), function(data){
            if(callback) callback(data);
        })
    },
    'new' : function(values){
        if(!values) values = {};
        var container = new Element('div', {
            'class':'filter'
        });
        
        var valueInput = this.makeFieldInput(values.field, values.operator, values.value);
        
        var operationSelector = new Element('select', {
            'class':'operationSelector',
            events:{
                change : function(){
                    var field = fieldSelector.value;
                    var input = this.makeFieldInput(fieldSelector.value, operationSelector.value);
                    input.replaces(operationSelector.getSiblings('.valueField')[0]);
                }.bind(this)
            }
        });
        (new Element('option', {html:'='})).inject(operationSelector);
        (new Element('option', {html:'<'})).inject(operationSelector);
        (new Element('option', {html:'>'})).inject(operationSelector);
        (new Element('option', {html:'<='})).inject(operationSelector);
        (new Element('option', {html:'>='})).inject(operationSelector);
        (new Element('option', {html:'!='})).inject(operationSelector);
        
        if(values.operator) operationSelector.set('value', values.operator);
        
        var fieldSelector = new Element('select',{
            'class':'fieldSelector',
            events:{
                change : function(){
                    switch(operationSelector.value){
                        case '=':
                        case '>=':
                        case '<=':
                            var input = this.makeFieldInput(fieldSelector.value, operationSelector.value);
                            input.replaces(operationSelector.getSiblings('.valueField')[0]);
                    }
                }.bind(this)
            }
        });
        budget.lineItems.fields.each(function(field){
            (new Element('option', {html:field})).inject(fieldSelector);
        });
        
        if(values.field) fieldSelector.set('value', values.field);
        
        fieldSelector.inject(container);
        operationSelector.inject(container);
        valueInput.inject(container);
        (new Element('input', {
            type : 'button',
            value : 'x',
            events : {
                click : function(){
                    container.destroy();
                }.bind(this)
            }
        })).inject(container);
        
        container.inject(this.element);
    }

});
