var deferred = function()
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
    
    /* Private members ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Add handlers to be called when the deferred object is resolved.
     *
     * Simple method that adds handlers to be called when the deferred object is resolved.
     *
     * @access privileged
     *
     * @param function|array can take functions as arguments or arrays with functions
     *
     */     
    
    this.done = function() {
        if (arguments.length == 0) {
            return;
        }

        var i = 0;
        var j = 0;
        
        for(i = 0; i < arguments.length; i++){            
            if (typeof arguments[i] == 'resolve') {
                if (this.status == 'unknown') {
                    resolveFunctions.push(arguments[i]);
                } else if (this.status == 'done') {
                    arguments[i]();
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (this.status == 'unknown') {
                            resolveFunctions.push(arguments[i][j]);
                        } else if (this.status == 'resolve') {
                            arguments[i][j]();
                        }   
                    }
                }
            }
        }               
    };
    
    /**
     * Add handlers to be called when the deferred object is rejected.
     *
     * Simple method that adds handlers to be called when the deferred object is rejected.
     *
     * @access privileged
     *
     * @param function|array can take functions as arguments or arrays with functions
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
                if (this.status == 'unknown') {
                    failFunctions.push(arguments[i]);
                } else if (this.status == 'fail') {
                    arguments[i]();
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (this.status == 'unknown') {
                            failFunctions.push(arguments[i][j]);
                        } else if (this.status == 'fail') {
                            arguments[i][j]();
                        }   
                    }
                }
            }
        }               
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
        if (this.status == 'unknown') {
            var i = 0;
            
            for (i = 0; i < this.resolveFunctions.length; i++) {
                this.resolveFunctions[i]();
            }
            
            this.status = 'resolve';
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
        if (this.status == 'unknown') {
            var i = 0;
            
            for (i = 0; i < this.failFunctions.length; i++) {
                this.failFunctions[i]();
            }
            
            this.status = 'fail';
        }           
    };    
    
    this.when = function() {
        
    };
    
    /* Privileged core methods ends here */
}

exports.create = function create() {
    "use strict";
    
    return new deferred();
};