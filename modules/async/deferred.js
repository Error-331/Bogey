var Deferred = function()
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */      
    
    var obj = this;
        
    /**
     * @access private
     * @var string current status of the deferred object, can take following values: fail, resolve, unknown
     */       
    
    var status = 'unknown';
    
    /**
     * @access private
     * @var array of callback functions which will be executed when the current deferred object is resolved
     */       
    
    var resolveFunctions = new Array();
    
    /**
     * @access private
     * @var array of callback functions which will be executed when the current deferred object is rejected
     */      
    
    var failFunctions = new Array();
    
    /**
     * @access private
     * @var array arguments that will be passed to the callback functions when the deferred object is resolved
     */      
    
    var resolveArgs = new Array();
    
    /**
     * @access private
     * @var array arguments that will be passed to the callback functions when the deferred object is rejected
     */       
    
    var failArgs = new Array();
    
    /* Private members ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Add handlers to be called when the deferred object is resolved.
     *
     * Simple method that adds handlers to be called when the deferred object is resolved. If the deferred object already been resolved, passed callback 
     * functions will be called instantly upon calling done() method (with arguments previously passed to the resolve() method).
     *
     * @access privileged
     *
     * @param function|array can take functions as arguments or arrays with functions
     * 
     * @return object current deferred object.
     *
     */     
    
    this.done = function() {
        if (arguments.length == 0) {
            return;
        }

        var i = 0;
        var j = 0;
        
        for(i = 0; i < arguments.length; i++){                
            if (typeof arguments[i] == 'function') {
                if (status == 'unknown') {
                    resolveFunctions.push(arguments[i]);
                } else if (status == 'resolve') {
                    arguments[i].apply(null, resolveArgs);
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (status == 'unknown') {
                            resolveFunctions.push(arguments[i][j]);
                        } else if (status == 'resolve') {
                            arguments[i][j].apply(null, resolveArgs);
                        }   
                    }
                }
            }
        } 
        
        return this;
    };
    
    /**
     * Add handlers to be called when the deferred object is rejected.
     *
     * Simple method that adds handlers to be called when the deferred object is rejected. If the deferred object already been rejected, passed callback 
     * functions will be called instantly upon calling fail() method (with arguments previously passed to the reject() method).
     *
     * @access privileged
     *
     * @param function|array can take functions as arguments or arrays with functions
     * 
     * @return object current deferred object.
     *
     */       
    
    this.fail = function() {
        if (arguments.length == 0) {
            return;
        }

        var i = 0;
        var j = 0;
        
        for(i = 0; i < arguments.length; i++){            
            if (typeof arguments[i] == 'function') {
                if (status == 'unknown') {
                    failFunctions.push(arguments[i]);
                } else if (status == 'fail') {
                    arguments[i].apply(null, failArgs);
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (status == 'unknown') {
                            failFunctions.push(arguments[i][j]);
                        } else if (this.status == 'fail') {
                            arguments[i][j].apply(null, failArgs);
                        }   
                    }
                }
            }
        }   
        
        return this;
    };  
    
    /**
     * Resolve a deferred object and call any 'resolve' callbacks with the given args.
     *
     * You can resolve deferred object once, any subsequent method calls will be ignored.
     *
     * @access privileged
     *
     * @param mixed callback function parameters
     *
     */     
    
    this.resolve = function() {
        if (status == 'unknown') {
            var i = 0;

            resolveArgs = arguments;
            for (i = 0; i < resolveFunctions.length; i++) {
                resolveFunctions[i].apply(null, arguments);
            }
            
            status = 'resolve';
        }
    };
    
    /**
     * Reject a deferred object and call any 'reject' callbacks with the given args.
     *
     * You can reject deferred object once, any subsequent method calls will be ignored.
     *
     * @access privileged
     *
     * @param mixed callback function parameters
     *
     */      
    
    this.reject = function() {   
        if (status == 'unknown') {
            var i = 0;
            
            failArgs = arguments;
            for (i = 0; i < failFunctions.length; i++) {
                failFunctions[i].apply(null, arguments);
            }
            
            status = 'fail';
        }           
    };    
        
    /* Privileged core methods ends here */
}

exports.constFunc = Deferred;
exports.create = function create() {
    "use strict";
    
    return new Deferred();
};