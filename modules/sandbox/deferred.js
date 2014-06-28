if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.async == undefined){
    Bogey.async = {};
}

if (Bogey.async.classes == undefined){
    Bogey.async.classes = {};
}

Bogey.async.classes.Deferred = function()
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

    this.when = function(def)
    {
        if (!obj.isProcessed()) {
            if (def instanceof Deferred || def instanceof promise.constFunc) {
                def.done(function(){
                    obj.resolve.apply(obj, arguments);
                }).fail(function(){
                    obj.reject.apply(obj, arguments);
                });
            } else if (typeof def == 'function') {
                var res = def();

                if (res instanceof Deferred || res instanceof promise.constFunc) {
                    res.done(function(){
                        obj.resolve.apply(obj, arguments);
                    }).fail(function(){
                        obj.reject.apply(obj, arguments);
                    });
                } else {
                    if (res == true) {
                        obj.resolve();
                    } else {
                        obj.reject();
                    }
                }
            } else {
                if (def == true) {
                    obj.resolve();
                } else {
                    obj.reject();
                }
            }
        }

        return obj.promise();
    }


    /**
     * Add a way to create deferred/promise chain.
     *
     * Method returns a promise object which will be resolved or rejected based on the code of the argument functions.
     *
     * @access privileged
     *
     * @param doneFunc function which will be called if the current deferred object is resolved
     * @param failFunc function which will be called if the current deferred object is rejected
     *
     * @return object promise.
     *
     */

    this.then = function(doneFunc, failFunc)
    {
        var def = new Deferred();

        obj.done(function(){
            if (typeof doneFunc == 'function'){
                doneFunc.apply(def, arguments);
            }
        }).fail(function(){
            if (typeof failFunc == 'function'){
                failFunc.apply(def, arguments);
            }
        });

        return def.promise();
    }

    /**
     * Resolve a deferred object and call any 'resolve' and 'always' callbacks with the given args.
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

            status = 'resolve';

            resolveArgs = arguments;
            for (i = 0; i < resolveFunctions.length; i++) {
                resolveFunctions[i].apply(null, resolveArgs);
            }

            for (i = 0; i < alwaysFunctions.length; i++) {
                alwaysFunctions[i].apply(null, resolveArgs);
            }
        }
    };

    /**
     * Reject a deferred object and call any 'reject' and 'always' callbacks with the given args.
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

            status = 'fail';

            failArgs = arguments;
            for (i = 0; i < failFunctions.length; i++) {
                failFunctions[i].apply(null, failArgs);
            }

            for (i = 0; i < alwaysFunctions.length; i++) {
                alwaysFunctions[i].apply(null, failArgs);
            }
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
        return new Bogey.async.classes.Promise(obj);
    }

    /* Privileged core methods ends here */
}

/* Module functions starts here */

/**
 * Provides a way to execute callback functions based on one or more Deferred objects that represent asynchronous events.
 *
 * If a single argument is passed to this method and it is not a deferred or a promise, it will be treated as a resolved
 * deferred and any "done" callbacks attached will be executed immediately. The method will resolve its master deferred as soon
 * as all the deferreds resolve, or reject the master deferred as soon as one of the deferreds is rejected. If the master deferred
 * is resolved, it is passed the resolved values of all the deferreds that were passed to this method.
 *
 * @access public
 *
 * @param mixed array of deferred (promise) objects or other values
 *
 * @return object promise.
 *
 */

Bogey.async.when = function()
{
    "use strict";

    var def = new Deferred();

    var defsNum = 0;
    var defsRes = 0;

    var args = new Array();

    var key;

    for (key = 0; key < arguments.length; key++) {
        if (typeof arguments[key] == 'object' && (arguments[key] instanceof Deferred || arguments[key] instanceof promise.constFunc)) {
            defsNum++;

            arguments[key].done(function(){
                defsRes++;
                var key;

                for (key = 0; key < arguments.length; key++) {
                    args.push(arguments[key]);
                }

                if (defsRes >= defsNum) {
                    def.resolve.apply(def, args);
                }
            }).fail(function(){
                def.reject.apply(def, arguments);
            });
        }
    }

    if (defsNum == 0) {
        def.resolve();
    }

    return def.promise();
}

/**
 * Provides a way to execute callback functions based on one or more Deferred objects that represent asynchronous events.
 *
 * If a single argument is passed to this method and it is not a deferred or a promise, it will be treated as a resolved
 * deferred and any "done" callbacks attached will be executed immediately. The method will resolve its master deferred as soon
 * as all the deferreds resolve or reject. If any of the deferred has been rejected, the master deferred will be also rejected.
 *
 * @access public
 *
 * @param mixed array of deferred (promise) objects or other values
 *
 * @return object promise.
 *
 */

Bogey.async.whenAll = function()
{
    "use strict";

    var def = new Deferred();

    var defsNum = 0;
    var defsRes = 0;

    var args = new Array();

    var key;
    var isRej = false;

    for (key = 0; key < arguments.length; key++) {
        if (typeof arguments[key] == 'object' && (arguments[key] instanceof Deferred || arguments[key] instanceof promise.constFunc)) {
            defsNum++;

            arguments[key].done(function(){
                defsRes++;
                var key;

                for (key = 0; key < arguments.length; key++) {
                    args.push(arguments[key]);
                }

                if (defsRes >= defsNum) {
                    if (isRej == true) {
                        def.resolve.apply(def, args);
                    } else {
                        def.reject.apply(def, args);
                    }

                    def.resolve.apply(def, args);
                }
            }).fail(function(){
                defsRes++;
                isRej = true;

                var key;

                for (key = 0; key < arguments.length; key++) {
                    args.push(arguments[key]);
                }

                if (defsRes >= defsNum) {
                    def.reject.apply(def, arguments);
                }
            });
        }
    }

    if (defsNum == 0) {
        def.resolve();
    }

    return def.promise();
}

/* Module functions ends here */