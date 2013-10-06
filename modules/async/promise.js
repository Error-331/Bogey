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
 * Module promise is a part of PhantomJS framework - Bogey.
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
 * Documents the Promise class.
 *
 * Following code represents a simple realisation of Promise object.
 *
 * @subpackage Promise
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

var Promise = function(usrDeferred)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */      
    
    var obj = this;    
    
    /**
     * @access private
     * @var object deferred object
     */      
    
    var deferred = null;        
    
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
     * @return object current promise object.
     *
     */     
    
    this.done = function() 
    {
        deferred.done.apply(deferred, arguments);
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
     * @return object current promise object.
     *
     */       
    
    this.fail = function() 
    {
        deferred.fail.apply(deferred, arguments);    
        return obj;
    };
    
    /**
     * Add a way to create deferred/promise chain.
     *
     * Method resolves or rejects current deferred based on the supplied argument. If deferred (or promise) object is
     * passed - current deferred will be resolve or rejected based on the state of the supplied deferred. If function is supplied 
     * it will be executed and if it returns deferred(or promise), final result will be based on it. If supplied function 
     * returns any other value or current method is supplied with other value (non function, non deferred/promise) and if it 
     * resolves to true current deferred will be resolved and vice versa.
     *
     * @access privileged
     *
     * @param def mixed can be another deferred(promise) object, function or any other value
     * 
     * @return object promise.
     *
     */      
    
    this.when = function()
    {
        return deferred.when.apply(deferred, arguments);    
    }
    
    /**
     * Add a way to create deferred/promise chain.
     *
     * Method returns a promise object which will be resolved or rejected based on the code of the argument functions. 
     *
     * @access privileged
     *
     * @param function which will be called if the current deferred object is resolved
     * @param function which will be called if the current deferred object is rejected
     * 
     * @return object promise.
     *
     */       
    
    this.then = function()
    {       
        return deferred.then.apply(deferred, arguments);          
    }
    
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
        deferred.always.apply(deferred, arguments);    
        return obj;
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
        return deferred.fail.isDone(deferred, arguments);
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
        return deferred.fail.isFail(deferred, arguments);     
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
        return deferred.fail.isProcessed(deferred, arguments); 
    }
    
    /* Privileged core methods ends here */
    
    // cconstructor
    if (typeof usrDeferred != 'object') {
        throw 'Deferred must be object';
    }
    
    deferred = usrDeferred;
}

exports.constFunc = Promise;
exports.create = function create(deferred) {
    "use strict";
    
    return new Promise(deferred);
};