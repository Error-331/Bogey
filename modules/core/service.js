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
 * Module service is a part of PhantomJS framework - Bogey.
 *
 * @package Phantasm
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Core modules of the framework.
 *
 * @subpackage core
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Service class.
 *
 * Following class is a base class for all services (e.q. wrappers classes for different sites and APIs).
 *
 * @subpackage Service
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

// Modules include
var args = require('system').args;
var page = require('webpage');

var logmessage = require('../io/logmessage');
var srError = require('../error/serviceerror');
var deferred = require('../async/deferred');

var fileUtils = require('../utils/fileutils');
var dummy = require('../core/dummy');

var Service = function(configObj, usrServiceName)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;     
        
    /**
     * @access private
     * @var string current service name
     */      
    
    var serviceName = 'service';    
    
    /**
     * @access private
     * @var object page object used for core mechanics
     */       
    
    var curPage = page.create();
    
    /**
     * @access private
     * @var boolean flag that indicates whether current operation has finished or not
     */    
    
    var isOpFinish = true; 
    
    /**
     * @access private
     * @var array of deferred objects of the operations
     */       
    
    var opDefStack = new Array();
    
    /**
     * @access private
     * @var array of functions, which are operations to be executed
     */        
    
    var opFuncStack = new Array();
    
    /**
     * @access private
     * @var array of arguments for operation functions
     */      
    
    var opFuncArgsStack = new Array();
       
    /**
     * @access private
     * @var array stack of callback functions which can be called when URL of the page is changed
     */      
    
    var urlChangeFuncStack = new Array();
    
    /**
     * @access private
     * @var array stack of callback functions which can be called when page content is loaded
     */      
    
    var pageLoadFuncStack = new Array();
    
    /**
     * @access private
     * @var string current page URL
     */       
    
    var curPageURL = '';
    
    /**
     * @access private
     * @var array stack that contains viewport size objects
     */           
    
    var viewportSizeStack = new Array();
    
    /**
     * @access private
     * @var bool property that indicates whether to save cookies to the file or not
     * 
     * @see addCookie();
     */       
    
    var persistCookies = true;
    
    /**
     * @access private
     * @var string path to the modules directory
     */      
    
    var modulesPath = '';
    
    /**
     * @access private
     * @var bool indicates whether sandbox debug mode is on or off
     */      
    
    var debugSandbox = false;
    
    /**
     * @access private
     * @var int default viewport width
     */      
    
    var viewportWidth = 1024;
    
    /**
     * @access private
     * @var int default viewport height
     */      
    
    var viewportHeight = 768;
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    /**
     * Method that configures current service.
     *
     * This method is default configuration method and will be called each time regardless of configureService() overloaded 
     * (priveleged) method. This method accepts and sets default options for the service.
     *
     * @access private
     *
     * @param object configObj object that contains default configuration options.
     * 
     * @throws string    
     *
     */      
    
    function configureService(configObj)
    {       
        if (typeof configObj != 'object') {
            return;
        }

        if (configObj.persistCookies != undefined) {
            obj.setPersistCookies(configObj.persistCookies);
        }    
        
        if (configObj.modulesPath != undefined) {
            obj.setModulesPath(configObj.modulesPath);
        }
        
        if (configObj.libraryPath != undefined) {
            if (typeof configObj.libraryPath != 'string') {
                throw '"libraryPath" parameter must be string';
            }
            
            if (fileUtils.isPathReadable(configObj.libraryPath)) {
                curPage.libraryPath = fileUtils.addSeparator(configObj.libraryPath);
            } else {
                throw '"libraryPath" is not readable: "' + configObj.libraryPath + '"';
            }
        }
        
        if (configObj.debugSandbox != undefined) {
            obj.setDebugSandbox(configObj.debugSandbox);
        }
        
        if (configObj.viewportWidth != undefined) {
            obj.setViewportWidth(configObj.viewportWidth);
        }
        
        if (configObj.viewportHeight != undefined) {
            obj.setViewportHeight(configObj.viewportHeight);
        }
        
        // set viewport size
        curPage.viewportSize = {width: viewportWidth, height: viewportHeight};
    }
       
    /**
     * Method that pushes deferred object of the operation to the stack.
     *
     * Simple method that pushes deferred object of the operation to the stack.
     *
     * @access private
     *
     * @param object usrDeferred deferred object
     * 
     * @throws string    
     *
     */      
    
    function pushOpDef(usrDeferred)
    {
        if (usrDeferred instanceof deferred.constFunc == false) {
            throw 'Passed parameter is not deferred object';
        }
        
        opDefStack.push(usrDeferred);
    }
    
    /**
     * Method that pulls deferred object of the operation from the stack.
     *
     * Simple method that pulls deferred object of the operation from the stack.
     *
     * @access private
     *
     * @return object first deferred object from the stack.
     * 
     */      
    
    function popOpDef()
    {
        return opDefStack.pop();
    }
    
    /**
     * Method that pushes operation function to the stack.
     *
     * Simple method that pushes operation function to the stack.
     *
     * @access private
     *
     * @param function func operation function
     * 
     * @throws string 
     *
     */    
    
    function pushOpFunc(func)
    {
        if (typeof func != 'function') {
            throw 'Passed operation is not a function';
        }
        
        opFuncStack.push(func);
    }
    
    /**
     * Method that pulls operation function from the stack.
     *
     * Simple method that pulls operation function from the stack.
     *
     * @access private
     *
     * @return object first operation function from the stack.
     * 
     */    
    
    function popOpFunc()
    {
        return opFuncStack.pop();
    }
    
    /**
     * Method that pushes operation function arguments to the stack.
     *
     * Simple method that pushes operation function arguments to the stack.
     *
     * @access private
     *
     * @param array args arguments for the operation function
     *
     */     
    
    function pushOpArgs(args)
    {
        opFuncArgsStack.push(args);
    }
    
    /**
     * Method that pulls operation function arguments from the stack.
     *
     * Simple method that pulls operation function arguments from the stack.
     *
     * @access private
     *
     * @return array of operation function arguments.
     * 
     */      
    
    function popOpArgs()
    {
        return opFuncArgsStack.pop();
    }
        
    /**
     * Method that executes first operation from the stack.
     *
     * If previous operation is finished and there is operation on the stack - it will be executed. When the operation finished 
     * this method will be called again.
     *
     * @access private
     * 
     */     
    
    function execOp()
    {
        if (opDefStack.length > 0 && isOpFinish == true) {               
            var def = popOpDef();
            var func = popOpFunc();
            var args = popOpArgs();

            var funcDef = func.apply(obj, args);
            isOpFinish = false;

            funcDef.done(function(){  
                def.resolve.apply(def, arguments);
                
                isOpFinish = true;
                execOp();
            });
            
            funcDef.fail(function(){               
                def.reject.apply(def, arguments);
                isOpFinish = true;
                
                execOp();
            });            
        }
    }
    
    /* Pirvate core methods ends here */
    
    /* Private event handlers starts here */
    
    /**
     * PhantomJS event handler method that is called when the address URL is changed.
     *
     * Method saves new URL to the internal variable for later use. If there is a callback function on the 'urlChangeFuncStack' it
     * will be executed.
     *
     * @access private
     * 
     * @param string targetUrl current page URL
     * 
     * @see getCurPageURL()
     * @see pushURLChangeFunc()
     * @see popURLChangeFunc()
     * 
     */      
    
    curPage.onUrlChanged = function(targetUrl) {
        curPageURL = targetUrl; 
           
        // sandbox debug mode
        if (debugSandbox == true) {             
            var tmpLibraryPath = curPage.libraryPath;
        
            curPage.libraryPath = obj.getModulesPath();
             
            if (!curPage.injectJs('sandbox/debug.js')) {
                throw 'Cannot inject sandbox debug package';
            }
            
            curPage.libraryPath = tmpLibraryPath;
            
            curPage.evaluate(function() {
                Bogey.debug.bindShowMarkOnClick();               
            }); 
        }
          
        // check callback function stack
        if (urlChangeFuncStack.length > 0) {
            obj.popURLChangeFunc()(targetUrl);
        }
    };    
        
    /**
     * PhantomJS event handler method that is called when the page is loaded.
     *
     * If there is a callback function on the 'pageLoadFuncStack' it will be executed.
     *
     * @access private
     * 
     * @param string status of the page
     * 
     * @see pushPageLoadFunc()
     * @see popURLChangeFunc()
     * 
     */     
    
    curPage.onLoadFinished = function(status) {       
        if (pageLoadFuncStack.length > 0) {
            obj.popURLChangeFunc()(status);
        }
    };
    
    /* Pirvate event handlers ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Method that configures current service.
     *
     * Every new service must overload this method to configure only necessary options.
     *
     * @access privileged
     *
     * @param object configObj object with configuration options
     *
     */     
    
    this.configureService = function(configObj) {
        if (typeof configObj != 'object') {
            return;
        }
    }      

    /**
     * Method that logs service execution process.
     *
     * Method creates response object, stringify it and passes it to the console.log() method. 
     *
     * @access privileged
     * 
     * @param string url of the current page
     * @param string status of the operation, can take following values: starting, processing, finishing
     * @param string pageStatus status of the page, can take following values: fail, success
     * @param string operationStatus status of the sub operation (or step), can take following values: success, fail and unknown
     * @param string description additional descriptnio that will be logged
     * 
     */     
    
    this.logProcess = function(url, status, pageStatus, operationStatus, description)
    {
        var resp = logmessage.create(serviceName, url, status, pageStatus, operationStatus, description);
        console.log(JSON.stringify(resp)); 
    }
    
    /**
     * Method that starts an operation.
     *
     * Method accepts operation function and pushes it (and its arguments) to the stack, as well as a deferred object for it.
     * After that method calls execOp() method.
     *
     * @access privileged
     * 
     * @param function func operation function
     * @param array arguments for the current operation function
     * 
     * @return object deferred object.
     * 
     * @see execOp()
     * 
     */       
    
    this.startOp = function()
    {        
        var def = new deferred.create();
        var args = new Array();
        var i = 0;
        
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        pushOpDef(def);
        pushOpFunc(arguments[0]);
        pushOpArgs(args);
        
        execOp();
                
        return def;
    }
    
    /**
     * Method that pushes 'onURLchange' callback function to the stack.
     *
     * Simple method that pushes 'onURLchange' callback function to the stack.
     *
     * @access privileged
     *
     * @param function func callback function
     * 
     * @throws string 
     *
     */    
    
    this.pushURLChangeFunc = function(func)
    {
        if (typeof func != 'function') {
            throw 'Passed operation is not a function';
        }
        
        urlChangeFuncStack.push(func);
    }  
 
    /**
     * Method that pulls 'onURLchange' callback function from the stack.
     *
     * Simple method that pulls 'onURLchange' callback function from the stack.
     *
     * @access privileged
     *
     * @return object first 'onURLchange' callback function from the stack.
     * 
     */      
    
    this.popURLChangeFunc = function()
    {
        return urlChangeFuncStack.pop();
    } 
    
    /**
     * Method that pushes 'onPageLoad' callback function to the stack.
     *
     * Simple method that pushes 'onPageLoad' callback function to the stack.
     *
     * @access privileged
     *
     * @param function func callback function
     * 
     * @throws string 
     *
     */       

    this.pushPageLoadFunc = function(func)
    {
        if (typeof func != 'function') {
            throw 'Passed operation is not a function';
        }
        
        pageLoadFuncStack.push(func);
    }  
    
    /**
     * Method that pulls 'onPageLoad' callback function from the stack.
     *
     * Simple method that pulls 'onPageLoad' callback function from the stack.
     *
     * @access privileged
     *
     * @return object first 'onPageLoad' callback function from the stack.
     * 
     */      
    
    this.popURLChangeFunc = function()
    {
        return pageLoadFuncStack.pop();
    }  
    
    /**
     * Method that pushes viewport size object to the stack.
     *
     * Simple method that pushes viewport size object to the stack.
     *
     * @access privileged
     *
     * @param object sizeObj size object
     * 
     * @throws string 
     *
     */      
    
    this.pushViewportSize = function(sizeObj)
    {
        if (typeof sizeObj != 'object') {
            throw 'Viewport size must be passed as object';
        }
            
        viewportSizeStack.push(sizeObj);
    }
    
    /**
     * Method that pulls viewport size object from the stack.
     *
     * Simple method that pulls viewport size object from the stack.
     *
     * @access privileged
     *
     * @return object viewport size object.
     * 
     */      

    this.popViewportSize = function()
    {
        return viewportSizeStack.pop();
    }
        
    /**
     * Method that renders page (or part of the page) into the image file.
     *
     * Method accepts a bunch of optional parameters used to tune image snapshot process.
     *
     * @access privileged
     * 
     * @param string format (extension) of the file
     * @param string name of the file
     * @param string path to the image or path to the directory where image will be saved
     * @param int width of the snapshot
     * @param int height of the snapshot
     * @param int delay after which snapshot will be taken
     * 
     * @return object deferred object.
     * 
     */     
    
    this.takeSnapshot = function(format, name, path, width, height, delay)
    {        
        var imgFormat = 'png'; 
        var imgName = 'untitled';
        var dirPath = '';
        var curDelay = 0;
        
        var def = deferred.create();
        
        try {
            if (format !== undefined) {
                imgFormat = fileUtils.checkImgExt(format); 
            }
        
            if (name !== undefined) {
                imgName = fileUtils.checkImgName(name);
            }
        
            if (path !== undefined && fileUtils.isPathWritable(path)) {
                var dirPath = fileUtils.addSeparator(path)
            }
        } catch (e) {
            def.reject(e);
        }
        
        if (width !== undefined && (typeof width != 'number' || width <= 0)) {  
            def.reject('Snapshot width must be numeric and greater than zero');
        }
                 
        if (height !== undefined && (typeof height != 'number' || height <= 0)) {
            def.reject('Snapshot height must be numeric and greater than zero');
        }     
         
        if (delay !== undefined) {
            if (typeof delay != 'number' || delay < 0) {
                def.reject('Snapshot delay must be numeric and greater than zero');
            } else {
                curDelay = delay;
            }
        }
                
        var curPage = obj.getPage();
        
        if (width !== undefined && height !== undefined) {
            obj.pushViewportSize(curPage.viewportSize);       
            curPage.viewportSize = {'width': width, 'height': height};         
        }        
        
        setTimeout(function() {
            curPage.render(dirPath + imgName + '.' + imgFormat);
            
            if (width !== undefined && height !== undefined) {
                curPage.viewportSize = obj.popViewportSize();
            }
            
            def.resolve(dirPath + imgName + '.' + imgFormat);
        }, curDelay);
        
        return def;
    }
    
    /**
     * Method that generates service error object.
     *
     * Simple method that generates service error object.
     *
     * @access privileged
     * 
     * @param int code of the error
     * @param string message of the error
     *
     * @return object service erorr.
     * 
     * @throws string 
     * 
     */       
    
    this.createErrorObject = function(code, message) 
    {
        return srError.create(code, message);
    }
     
    /**
     * Method that persists cookie to the file.
     *
     * Cookie is saved if 'persistCookies' option is set to true.
     *
     * @access privileged
     * 
     * @param object usrCookie cookie object
     * 
     * @throws string 
     * 
     */   
    
    this.addCookie = function(usrCookie)
    { 
        if (obj.getPersistCookies() == false) {
            return;
        }
        
        if (typeof usrCookie != 'object') {
            throw 'Cookie is not an object';
        }
        
         phantom.addCookie(usrCookie);
    }   
    
    /**
     * Method that persists cookies to the file.
     *
     * Cookies is saved if 'persistCookies' option is set to true.
     *
     * @access privileged
     * 
     * @param array usrCookies array of cookie objects
     * 
     * @throws string 
     * 
     */     
    
    this.addCookies = function(usrCookies)
    {
        if (obj.getPersistCookies() == false) {
            return;
        }        
        
        if (typeof usrCookies != 'object') {
            throw 'Cookies is not array';
        }
        
        var cookie = null;

        for (cookie in usrCookies) {
            obj.addCookie(usrCookies[cookie]);
        }
    }
    
    /**
     * Method that merges provided data with "dummy" schema.
     *
     * Provided data must be presented as array of objects, where each objects field must have same counterpart in the schema.
     *
     * @access privileged
     * 
     * @param object schema "dummy" schema
     * @param array data array of objects
     * 
     * @return object schema merged with provided data.
     * 
     * @throws string 
     * 
     */     
    
    this.mergeDataAndDummySchema = function(schema, data)
    {
        if (typeof schema != 'object') {
            '"Dummy" schema must be object';
        }
        
        if (typeof data != 'object') {
            'Data is not represented as object';
        }
        
        var key = null;
        var subKey = null;
        
        var i = 0;
        
        for (key in schema) {
            if (data[i] == undefined) {
                break;
            }

            for (subKey in data[i]) {
                if (schema[key][subKey] != undefined) {
                    schema[key][subKey] = data[i][subKey];
                }
            }
            
            i++;
        }
        
        return schema;
    }
    
    /**
     * Method that validates page against defined schema.
     *
     * Method injects file with validator class (and other necessary files) into the current page, injects user defined schema and 
     * validates page against this schema while in sandbox mode.
     *
     * @access privileged
     * 
     * @param string schmePath path to the current schema
     * @param string serviceNamespace namespace of the current service in sandbox mode
     * @param string schemaNamespace namespace of the current schema in sandbox mode
     * @param string format of the output data
     * @param array additionalScripts array of strings which points to the additional files which will be injected
     * 
     * @throws string 
     * 
     * @return object deferred object.
     * 
     */      
    
    this.validatePageBySchema = function(schmePath, serviceNamespace, schemaNamespace, format, additionalScripts)
    {
        var def = deferred.create();  
        
        // validation
        if (typeof schmePath != 'string') {
            throw 'Invalid path to schema file';
        }
 
        if (typeof schemaNamespace != 'string') {
            throw 'Invalid service namespace type'
        } 
 
        if (typeof schemaNamespace != 'string') {
            throw 'Invalid schema namespace type'
        }
        
        var curPage = obj.getPage();
        var tmpLibraryPath = curPage.libraryPath;
        
        curPage.libraryPath = obj.getModulesPath();
                  
        // inject validator class
        if (!curPage.injectJs('sandbox/schemavalidator.js')) {
            throw 'Cannot inject schema validator class';
        }

        // inject additional scripts
        if (additionalScripts != undefined) {
            if (typeof additionalScripts != 'object') {
                throw 'Additional scripts files must be provided as array';
            }
            
            var script = null;
            
            for (script in additionalScripts) {
                if (typeof additionalScripts[script] != 'string') {
                    throw 'Additional script file name must be string';
                }

                if (!curPage.injectJs(additionalScripts[script])) {
                    throw 'Cannot inject: "' + additionalScripts[script] + '"';
                }                
            }
        } 

        // inject schema
        if (!curPage.injectJs(schmePath)) {
            throw 'Cannot inject: "' + schmePath + '"';
        }

        curPage.libraryPath = tmpLibraryPath;

        // evalute
        var result = JSON.parse(curPage.evaluate(function(service, schema, format) {
            try {                
                var validator = new Bogey.SchemaValidator(Bogey[service]['schemas'][schema], format);

                return JSON.stringify(validator.checkElementsBySchema());    
            } catch(e) {
                return JSON.stringify({error: true, message: e});
            }
                    
        }, serviceNamespace, schemaNamespace, format)); 
        
        if (result.error != undefined && result.error == true) {
            def.reject(obj.createErrorObject(2, result.message));
        } else {
            def.resolve(result);
        }
        
        return def;
    }
    
    /**
     * Method that validates page against defined schema.
     *
     * Method injects file with validator class (and other necessary files) into the current page, injects user defined schema 
     * and validates page against this schema while in sandbox mode. Note that this method uses combined validator/dummy 
     * schema and can enter sandbox mode multiple times. This method is more versatile than validatePageBySchema().
     *
     * @access privileged
     * 
     * @param object schema validator/dummy combined schema
     * 
     * @throws string 
     * 
     * @return object deferred object.
     * 
     */      
    
    this.validatePageByDummySchema = function(schema)
    {
        var def = deferred.create();
        var curPage = obj.getPage();
        
        var tmpLibraryPath = curPage.libraryPath;
        var format = 'raw';
        
        var script = null;
        
        if (typeof schema != 'object') {
            throw 'Schema must be object';
        }
        
        if (typeof schema.sandbox_schema != 'object') {
            throw 'Invalid "sandbox_schema" property';
        }
        
        if (typeof schema.format != undefined) {
            if (typeof schema.format != 'string') {
                throw 'Invalid format parameter in sandbox/dummy schema';
            }
            
            format = schema.format.toLowerCase();
        }
        
        curPage.libraryPath = obj.getModulesPath();
        
        // inject validator class
        if (!curPage.injectJs('sandbox/schemavalidator.js')) {
            throw 'Cannot inject schema validator class';
        }   
        
        // inject additional scripts 
        if (schema.scripts != undefined) {
            if (typeof schema.scripts != 'object') {
                throw 'Additional scripts files must be provided as array';
            }
            
            for (script in schema.scripts) {
                if (typeof schema.scripts[script] != 'string') {
                    throw 'Additional script file name must be string';
                }

                if (!curPage.injectJs(schema.scripts[script])) {
                    throw 'Cannot inject: "' + schema.scripts[script] + '"';
                }                
            }                  
        }
        
        curPage.libraryPath = tmpLibraryPath;
                         
        // evalute page
        var result = JSON.parse(curPage.evaluate(function(schema, format) {
            try {     
                alert(schema);
                schema = JSON.parse(schema);
                
                var validator = new Bogey.SchemaValidator(schema, format);

                return JSON.stringify(validator.checkElementsBySchema());    
            } catch(e) {
                return JSON.stringify({error: true, message: e});
            }
                    
        }, JSON.stringify(schema.sandbox_schema), format));         
        
        if (result.error != undefined && result.error == true) {
            def.reject(obj.createErrorObject(2, result.message));
        } else {
            def.resolve(result);
        }        
        
        return def;
    }
    
    /**
     * Method that runs "dummy" schema.
     *
     * Dummy object simulates user interaction with the page (i.e. click, fill input text) and the provided schema contains order (and names) of the 
     * operations which will be performed.
     *
     * @access privileged
     * 
     * @param object schema operation schema
     * 
     * @throws string 
     * 
     * @return object deferred object.
     * 
     */        
        
    this.runDummySchema = function(schema)
    {
        if (typeof schema != 'object') {
            throw 'Schema for "dummy" must be object';
        }
              
        return dummy.create(obj).runSchema(schema);
    }
        
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
        
    /**
     * Method that returns current service name.
     *
     * Simple method that returns current service name.
     *
     * @access privileged
     * 
     * @return string service name.
     * 
     */     

    this.getServiceName = function()
    {
        return serviceName;
    }    
    
    /**
     * Method that returns current page object.
     *
     * Simple method that returns current page object.
     *
     * @access privileged
     * 
     * @return object page object.
     * 
     */      
    
    this.getPage = function()
    {
        return curPage;
    }
    
    /**
     * Method that returns current page URL.
     *
     * Simple method that returns current page URL.
     *
     * @access privileged
     * 
     * @return string page URL.
     * 
     */      
    
    this.getCurPageURL = function()
    {
        return curPageURL;
    }
    
    /**
     * Method that returns 'persistCookies' option value.
     *
     * This option tells service whether to save or not to save cookies to the file.
     *
     * @access privileged
     * 
     * @return bool option value.
     * 
     * @see addCookie();
     * 
     */    
    
    this.getPersistCookies = function()
    {
        return persistCookies;
    }
        
    /**
     * Method that returns 'modulesPaths' option value.
     *
     * Method returns current path to modules directory.
     *
     * @access privileged
     * 
     * @return string path to modules directory.
     * 
     */       
    
    this.getModulesPath = function()
    {
        return modulesPath;
    }
    
    /**
     * Method that returns 'debugSandbox' option value.
     *
     * Method returns value which indicates whether sandbox debug mode on or off.
     *
     * @access privileged
     * 
     * @return bool value for the debug mode.
     * 
     */    
    
    this.getDebugSandbox = function()
    {
        return debugSandbox
    }    
    
    /**
     * Method that returns current viewport width.
     *
     * Simple method that returns current viewport width.
     *
     * @access privileged
     * 
     * @return int viewport width.
     * 
     */     
    
    this.getViewportWidth = function()
    {
        return viewportWidth;
    }
      
    /**
     * Method that returns current viewport height.
     *
     * Simple method that returns current viewport height.
     *
     * @access privileged
     * 
     * @return int viewport height.
     * 
     */       
    
    this.getViewportHeight = function()
    {
        return viewportHeight;
    }
          
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
        
    /**
     * Method that sets current service name.
     *
     * Simple method that sets current service name.
     *
     * @access privileged
     * 
     * @param string usrServiceName service name
     * 
     * @throws string 
     * 
     */       
    
    this.setServiceName = function(usrServiceName)
    {
        if (typeof usrServiceName != 'string') {
            throw 'Service name is not a string';
        }
        
        if (usrServiceName.length <= 0) {
            throw 'Service name length cannot be zero';
        }
        
        serviceName = usrServiceName;        
    }
    
    /**
     * Method that sets current service 'persistCookies' option value.
     *
     * This option tells service whether to save or not to save cookies to the file.
     *
     * @access privileged
     * 
     * @param bool usrPersistCookies option value
     * 
     * @throws string 
     * 
     * @see addCookie();
     * 
     */     
    
    this.setPersistCookies = function(usrPersistCookies)
    {
        if (typeof usrPersistCookies != 'boolean') {
            throw '"persistCookies" option must be boolean';
        }
        
        persistCookies = usrPersistCookies;

        // delete cookies file if present
        if (persistCookies == false) {
            var key = null;
               
            for (key in args) {   
                if (args[key].indexOf('--cookies-file=') != -1) {  
                    fileUtils.deleteIfExist(args[key].substr(15));
                }
            }
        }
    }
    
    /**
     * Method that sets current path to modules directory.
     *
     * Simple method that sets current path to modules directory.
     *
     * @access privileged
     * 
     * @param string usrModulesPath path to modules directory
     * 
     * @throws string 
     * 
     */     
    
    this.setModulesPath = function(usrModulesPath)
    {
        if (typeof usrModulesPath != 'string') {
            throw '"modulesPath" must be string';
        }
              
        fileUtils.isPathReadable(usrModulesPath);
        curPage.libraryPath = fileUtils.addSeparator(usrModulesPath);
        
        modulesPath = usrModulesPath;
    }
    
    /**
     * Method that turns on or off sandbox debug mode.
     *
     * Method that sets parameter value which indicates whether sandbox debug mode is on or off.
     *
     * @access privileged
     * 
     * @param bool usrDebugSandbox value for the debug mode
     * 
     * @throws string 
     * 
     */      
    
    this.setDebugSandbox = function(usrDebugSandbox)
    {
        if (typeof usrDebugSandbox != 'boolean') {
            throw '"debugSandbox" must be bool';
        }
        
        debugSandbox = usrDebugSandbox;

        
        if (debugSandbox == false) {
            curPage.onAlert = function(msg) {
                console.log('Page alert: ' + msg);
            };
        } else {
            curPage.onAlert = undefined;
        }
    }
    
    /**
     * Method that sets current viewport width.
     *
     * Simple method that sets current viewport width.
     *
     * @access privileged
     * 
     * @param int usrWidth width of the viewport
     * 
     * @throws string 
     * 
     */       
    
    this.setViewportWidth = function(usrWidth)
    {
        if (typeof usrWidth != 'number') {
            throw 'Viewport width must be number';
        }
        
        if (usrWidth < 0) {
            throw 'Viewport width must be equal or greater than zero';
        }
               
        viewportWidth = usrWidth; 
        curPage.viewportSize = {width: viewportWidth, height: viewportHeight};    
    }
    
    /**
     * Method that sets current viewport height.
     *
     * Simple method that sets current viewport height.
     *
     * @access privileged
     * 
     * @param int usrHeight height of the viewport
     * 
     * @throws string 
     * 
     */     
    
    this.setViewportHeight = function(usrHeight)
    {
        if (typeof usrHeight != 'number') {
            throw 'Viewport height must be number';
        }
        
        if (usrHeight < 0) {
            throw 'Viewport height must be equal or greater than zero';
        }
        
        viewportHeight = usrHeight;
        curPage.viewportSize = {width: viewportWidth, height: viewportHeight}; 
    }
  
    /* Privileged set methods ends here */  

    this.setServiceName(usrServiceName);
    
    // configure service
    configureService(configObj);
    this.configureService(configObj);
}

exports.constFunc = Service;
exports.create = function create(configObj, serviceName) {
    "use strict";
    
    return new Service(configObj, serviceName);
};