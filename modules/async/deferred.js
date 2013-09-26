/**
 * Bogey
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the GNU GENERAL PUBLIC LICENSE (Version 3)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to red331@mail.ru so we can send you a copy immediately.
 *
 * Module deferred is a part of PhantomJS framework - Bogey.
 *
 * @package Bogey
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Modules for use in asynchronous code.
 *
 * @subpackage async
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Deferred class.
 *
 * Following code represents a simple realisation of Deferred object.
 *
 * @subpackage Deferred
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

// Modules include
var promise = require('../async/promise');

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
     * @var array of callback functions which will be executed after the current deferred object is resolved or rejected 
     */       
    
    var alwaysFunctions = new Array();
    
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
    
    this.done = function() 
    {
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
        
        return obj;
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
    
    this.fail = function() 
    { 
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
        
        return obj;
    }; 
    
    /**
     * Add handlers to be called when the deferred object is resolved or rejected.
     *
     * Simple method that adds handlers to be called when the deferred object is resolved or rejected. If the deferred object already been resolved or rejected, passed callback 
     * functions will be called instantly upon calling resolve() or fail() methods.
     *
     * @access privileged
     *
     * @param function|array can take functions as arguments or arrays with functions
     * 
     * @return object current deferred object.
     *
     */     
    
    this.always = function()
    {
        if (arguments.length == 0) {
            return;
        }

        var i = 0;
        var j = 0;
        
        for(i = 0; i < arguments.length; i++){            
            if (typeof arguments[i] == 'function') {
                if (status == 'unknown') {
                    alwaysFunctions.push(arguments[i]);
                } else if (status == 'fail' || status == 'resolve') {
                    arguments[i].apply(null);
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (status == 'unknown') {
                            alwaysFunctions.push(arguments[i][j]);
                        } else if (this.status == 'fail' || status == 'resolve') {
                            arguments[i][j].apply(null);
                        }   
                    }
                }
            }
        }   
        
        return obj;        
    }
    
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
    
    this.resolve = function() 
    {
        if (status == 'unknown') {
            var i = 0;

            resolveArgs = arguments;  
            for (i = 0; i < resolveFunctions.length; i++) {
                resolveFunctions[i].apply(null, resolveArgs);
            }
            
            for (i = 0; i < alwaysFunctions.length; i++) {
                alwaysFunctions[i].apply(null);
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
    
    this.reject = function() 
    {   
        if (status == 'unknown') {
            var i = 0;

            failArgs = arguments;
            for (i = 0; i < failFunctions.length; i++) {
                failFunctions[i].apply(null, failArgs);
            }
            
            for (i = 0; i < alwaysFunctions.length; i++) {
                alwaysFunctions[i].apply(null);
            }               
            
            status = 'fail';
        }           
    };  
    
    /**
     * Checks if deferred object has been resolved.
     *
     * Simple method that checks if deferred object has been resolved.
     *
     * @access privileged
     *
     * @return boolean true if deferred object has been resolved and false if not.
     *
     */       
        
    this.isDone = function() 
    {
        if (status == 'resolve') {
            return true;
        } else {
            return false;
        }
    } 
    
    /**
     * Checks if deferred object has been rejected.
     *
     * Simple method that checks if deferred object has been rejected.
     *
     * @access privileged
     *
     * @return boolean true if deferred object has been rejected and false if not.
     *
     */     
    
    this.isFail = function() 
    {
        if (status == 'fail') {
            return true;
        } else {
            return false;
        }        
    }
    
    /**
     * Checks if deferred object has been processed (e.g. has been resolved or rejected).
     *
     * Simple method that checks if deferred object has been processed (e.g. has been resolved or rejected).
     *
     * @access privileged
     *
     * @return boolean true if deferred object has been processed and false if not.
     *
     */      
    
    this.isProcessed = function() 
    {
        if (obj.isDone() == false && obj.isFail() == false) {
            return false;
        } else {
            return true;
        }
    }    
    
    /**
     * Returns promise object.
     *
     * Promise object restricts user to only add handler functions to the deferred object, but not to alter its state.
     *
     * @access privileged
     *
     * @return object promise object.
     * 
     * @throws string  
     *
     */     
    
    this.promise = function()
    {
        return promise.create(obj);
    }
            
    /* Privileged core methods ends here */
}

exports.constFunc = Deferred;
exports.create = function create() {
    "use strict";
    
    return new Deferred();
};