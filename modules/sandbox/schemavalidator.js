if (Bogey == undefined){
    var Bogey = {};
}

Bogey.SchemaValidator = function(usrSchema, usrFormat)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    /**
     * @access private
     * @var object link to the current object
     */         
    
    var schema = null;
    
    /**
     * @access private
     * @var string format in which resulting data will be returned, can take following values:
     * 
     * 'raw' - result data will be returned as is (multidimensional array)
     * 'plain' - result data will be returned as plain array that contains processed data
     * 'plain-objects' - result data will be returned as plain array which consist of data from validation functions which returns object
     * 
     */         
    
    var format = 'raw';
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    function formatPlain(data)
    {    
        var elm = null;
        var subElm = null;

        var result = new Array();

        for (elm in data) {
            for (subElm in data[elm]) {
                switch (format) {
                    case 'plain-objects':
                        if (typeof data[elm][subElm][0] == 'object') {
                            result.push(data[elm][subElm][0]);
                        }
                        
                        break;
                        
                    default:
                        result.push(data[elm][subElm][0]);
                        break;
                }
            
                if (typeof data[elm][subElm][1] == 'object') {
                    result = result.concat(formatPlain(data[elm][subElm][1]));
                }                
            }          
        }

        return result;
    }    
    
    function validate(usrScheme, rootElm)
    {
        var result = new Array();
        var subRes = null;
        
        // check 'text' property
        if (usrScheme.text != undefined) {
            if (typeof usrScheme.text == 'string') {
                if (rootElm.innerHTML != usrScheme.text) {
                    return false;
                }
            } else if (typeof usrScheme.text == 'object') {
                if (typeof usrScheme.text[0] == 'function' && typeof usrScheme.text[1] == 'string') {
                    subRes = usrScheme.text[0](rootElm.innerHTML);
                    if (subRes != usrScheme.text[1]) {
                        return false;
                    }
                } else {
                    throw '"text" property parameters mismatch';
                }
            } else {
                throw '"text" property must be string or object';
            }
        }    
        
        // check 'func' property
        if (usrScheme.func != undefined) {
            if (typeof usrScheme.func == 'function') {
                result.push(usrScheme.func(rootElm));
            } else {
                throw '"func" property must be function';
            }
        } else {
            result.push(true);
        }
        
        // check 'sub' property
        if (usrScheme.sub != undefined) {
            if (typeof usrScheme.sub == 'object') {
                result.push(traverse(usrScheme.sub, rootElm));
            } else {
                throw '"sub" property must be object';
            }
        }  
        
        return result;        
    }
    
    function traverse(usrScheme, rootElm)
    {
        var globResult = new Array();
        var result = null;
        var subResult = false;
        
        var elm = null;
        var elmDOM = null;
        
        var selRes = null;
        
        for (elm in usrScheme) {
            // check 'sel' property
            if (usrScheme[elm].sel != undefined) {
                if (typeof usrScheme[elm].sel != 'string') {
                    throw '"sel" property is not a string';
                }
                
                if (rootElm == undefined) {
                    selRes = document.querySelectorAll(usrScheme[elm].sel);
                } else {
                    selRes = rootElm.querySelectorAll(usrScheme[elm].sel);
                }
                
                if (selRes.length <= 0) {
                    throw 'Element not found for: ' + usrScheme[elm].sel;
                }
                
                // check each element
                result = new Array();
                for (elmDOM = 0; elmDOM < selRes.length; elmDOM++) {                    
                    subResult = validate(usrScheme[elm], selRes.item(elmDOM));
                    
                    if (subResult != false) {
                        result.push(subResult);
                    }                  
                } 
                                
                if (result.length <= 0) {
                    throw 'Schema validation fail';
                }
                
                globResult.push(result);
            } else {
                throw '"sel" property is not present';
            }                                  
        }
        
        return globResult;
    }    
    
    /* Private core methods ends here */ 
    
    /* Privileged core methods starts here */
    
    this.checkElementsBySchema = function()
    {           
        // format
        switch(format) {
            case 'raw':
                return traverse(schema, undefined);
                break;
            case 'plain':
            case 'plain-objects':  
                return formatPlain(traverse(schema, undefined));
                break;
            default:
                throw 'Unrecognised format: "' + format + '"';
                break;
        }          
    }    
       
    /* Privileged core methods ends here */ 
 
    /* Privileged get methods starts here */
    /* Privileged get methods ends here */ 
 
    /* Privileged set methods starts here */
    
    this.setSchema = function(usrSchema)
    {
        if (typeof usrSchema != 'object' || usrSchema === null) {
            throw 'Provided schema must be object';
        }
        
        schema = usrSchema;
    }
    
    this.setFormat = function(usrFormat)
    {         
        if (usrFormat != undefined) {
            if (typeof usrFormat != 'string') {
                throw 'Format parameter must be string';
            }
        
            format = usrFormat.toLowerCase();    
        } else {
            format = 'raw';
        }        
    }
    
    /* Privileged set methods ends here */
    
    this.setSchema(usrSchema);
    this.setFormat(usrFormat);
}