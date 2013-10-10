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
    
    /**
     * @access private
     * @var bool inverts work of the validator (if the element is found - error will be thrown)
     */       
    
    var invert = false;
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    /**
     * Method that throws error connected with the supplied element.
     *
     * Method checks whether the element contains 'errorMes' property and if it is present throws error with the message in 
     * this property. If the method does not contain this property - default message will be thrown.
     *
     * @access private
     * 
     * @param object elm current schema element
     * @param string defErr default error message
     * 
     * @throws string 
     * 
     */      
    
    function throwError(elm, defErr)
    {
        if (elm.errorMes !== undefined) {
            throw elm.errorMes;
        } else {
            throw defErr;
        }
    }
    
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
    
    function runFuncParam(usrScheme, rootElm)
    {       
        var func = null;
        var tmpArr;
            
        var extractFuncFormString = function(usrFunc)
        {
            var func = null; 
            var i = 0;
            
            usrFunc = usrFunc.split('.');
                
            for (i = 0; i < usrFunc.length; i++) {
                if (i == 0) {
                    func = window[usrFunc[i]];
                } else {
                    func = func[usrFunc[i]];
                }                
            }
                
            return func;            
        }
            
        if (typeof usrScheme.func == 'function') {
            return usrScheme.func(rootElm);
        } else if (typeof usrScheme.func == 'string') {                
            usrScheme.func = extractFuncFormString(usrScheme.func);
            return usrScheme.func(rootElm);
        } else if (typeof usrScheme.func == 'object') {
            if (usrScheme.func.length <= 0) {
                throwError(usrScheme, 'Function array cannot be zero length');
            }
            
            tmpArr = new Array();
                
            tmpArr.push(rootElm);     
            tmpArr = tmpArr.concat(usrScheme.func.slice(1));               

            if (typeof usrScheme.func[0] == 'string') {                                  
                func = extractFuncFormString(usrScheme.func[0]);
                return func.apply(null, tmpArr);
            } else if (typeof usrScheme.func[0] == 'function') {           
                return usrScheme.func[0].apply(null, tmpArr);
            } else {
                throwError(usrScheme, '"func" property must be function or string');
            }
        } else {
            throwError(usrScheme, '"func" property must be function, string or array');
        }     
    }
    
    function validate(usrScheme, rootElm)
    {
        var result = new Array();
        var subRes = null;
    
        var funcRes = null;
        
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
                    throwError(usrScheme, '"text" property parameters mismatch'); 
                }
            } else {
                throwError(usrScheme, '"text" property must be string or object'); 
            }
        }    
        
        // check 'func' property
        if (usrScheme.func != undefined) {
            funcRes = runFuncParam(usrScheme, rootElm);        
        } else {
            funcRes = {};
        }

        // check 'varName' property      
        if (usrScheme.varName !== undefined) {
            if (typeof usrScheme.varName != 'string' || usrScheme.varName.length <= 0) {
                throwError(usrScheme, '"varName" property must be string and its length must be greater than zero'); 
            }
            
            funcRes.varName = usrScheme.varName
            result.push(funcRes);
        } else {
            result.push(funcRes);
        }          
         
        // check 'sub' property
        if (usrScheme.sub != undefined) {
            if (typeof usrScheme.sub == 'object') {
                result.push(traverse(usrScheme.sub, rootElm));
            } else {
                throwError(usrScheme, '"sub" property must be object');  
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
        
        // check for params element
        for (elm in usrScheme) {
            if (elm.toLowerCase() == 'params') {
                
                if (usrScheme[elm].invert !== undefined) {
                    setInvert(usrScheme[elm].invert);
                }
                
                break;
            }
        }
        
        // traverse all elements
        for (elm in usrScheme) {   
            // skip params
            if (elm.toLowerCase() == 'params') {
                continue;
            }
            
            // check 'sel' property
            if (usrScheme[elm].sel === undefined) {
                throwError(usrScheme[elm], '"sel" property is not present');         
            }
            
            if (typeof usrScheme[elm].sel != 'string') {
                throwError(usrScheme[elm], '"sel" property is not a string');   
            }
                
            if (rootElm == undefined) {
                selRes = document.querySelectorAll(usrScheme[elm].sel);
            } else {
                selRes = rootElm.querySelectorAll(usrScheme[elm].sel);
            }
                
            result = new Array();    
            
            if (invert == true) {
                if (selRes.length <= 0) {
                    // check 'defValue' property
                    if (usrScheme[elm].defValue !== undefined) {
                        throwError(usrScheme[elm], 'Element found for: ' + usrScheme[elm].sel);   
                    }               
                } else {
                    throw selRes.length.toString();
                    // check each element
                    if (selRes.length > 0) {
                        throwError(usrScheme[elm], 'Element found for: ' + usrScheme[elm].sel);  
                    }                                                 
                }                                      
            } else {
                if (selRes.length <= 0) {
                    // check 'defValue' property
                    if (usrScheme[elm].defValue === undefined) {
                        throwError(usrScheme[elm], 'Element not found for: ' + usrScheme[elm].sel);  
                    }                
                
                    result.push(usrScheme[elm].defValue); 
                } else {
                    // check each element
                    for (elmDOM = 0; elmDOM < selRes.length; elmDOM++) {                    
                        subResult = validate(usrScheme[elm], selRes.item(elmDOM));

                        if (subResult != false) {
                            result.push(subResult);
                        } else {
                            if (usrScheme[elm].defData !== undefined) {
                                result.push([usrScheme[elm].defData]);
                            }
                        }                  
                    }                                 
                }
               
                if (result.length <= 0) {
                    throw 'Schema validation fail';
                }
                
                globResult.push(result);   
            }                                                     
        }
        
        return globResult;
    }    
    
    /* Private core methods ends here */ 
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */
    
    /**
     * Method that sets value for "invert" property.
     *
     * Simple method that sets value for "invert" property.
     *
     * @access private
     * 
     * @param bool val new value for the property
     * 
     * @throws string 
     * 
     */      
    
    function setInvert(val)
    {
        if (typeof val != 'boolean') {
            throw 'Value for "invert" property must be boolean';
        }
        
        invert = val;
    }
    
    /* Private set methods ends here */
    
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