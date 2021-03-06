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
 * @package Bogey
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
var stringUtils = require('../utils/stringutils');
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
     * @var object current scenario (if any)
     */     
    
    var scenario;
        
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
     * @var string current page name
     */          
    
    var curPageName = 'unknown';
    
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
     * @var array stack of callback functions which can be called when a new child window (but not deeper descendant windows) is created by the page
     */     
    
    var pageCreatedFuncStack = new Array();

    /**
     * @access private
     * @var array of objects that stores deferred object and process id of the sandbox function being executed
     */

    var sandboxFuncDefStack = new Array();
    
    /**
     * @access private
     * @var string current page URL
     */       
    
    var curPageURL = curPage.url;
    
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
    
    /**
     * @access private
     * @var bool property that indicates whether current object must relogin to the service every time it is started
     */      
    
    var reloginOnStart = false;  
  
    /**
     * @access private
     * @var int possible ping in milliseconds
     */  

    var ping = 0;
    
    /**
     * @access private
     * @var string name of the directory where all the logging snapshots will be stored
     */     
    
    var logSnapDir;

    /**
     * @access private
     * @var bool property that indicates whether to make screenshot on every log message or not
     */

    var snapshotOnLog = false;

    /**
     * @access private
     * @var int default timeout in milliseconds for validatePageBySchemaUntilRec() method
     */

    var validatePageBySchemaUntilRecTimeout = 10000;

    /**
     * @access private
     * @var int default interval in milliseconds before each iteration in validatePageBySchemaUntilRec() method
     */

    var validatePageBySchemaUntilRecInterval = 1000;

    /**
     * @access private
     * @var array of paths to all sandbox scripts of the current framework
     */

    var bogeySandboxScriptsList = [
            'sandbox/debug.js',
            'sandbox/async/promise.js',
            'sandbox/async/deferred.js',
            'sandbox/schemavalidator.js',
            'sandbox/utils.js'
    ];
    
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

        if (configObj.scenario !== undefined) {
            obj.setScenario(configObj.scenario);
        }

        if (configObj.persistCookies !== undefined) {
            obj.setPersistCookies(configObj.persistCookies);
        }

        if (configObj.modulesPath !== undefined) {
            obj.setModulesPath(configObj.modulesPath);
        } else {
            obj.setModulesPath(fileUtils.getModulesDir());
        }

        if (configObj.libraryPath !== undefined) {
            if (typeof configObj.libraryPath != 'string') {
                throw '"libraryPath" parameter must be string';
            }
            
            if (fileUtils.isPathReadable(configObj.libraryPath)) {
                curPage.libraryPath = fileUtils.addSeparator(configObj.libraryPath);
            } else {
                throw '"libraryPath" is not readable: "' + configObj.libraryPath + '"';
            }
        }
        
        if (configObj.debugSandbox !== undefined) {
            obj.setDebugSandbox(configObj.debugSandbox);
        }
        
        if (configObj.viewportWidth !== undefined) {
            obj.setViewportWidth(configObj.viewportWidth);
        }
        
        if (configObj.viewportHeight !== undefined) {
            obj.setViewportHeight(configObj.viewportHeight);
        }
        
        if (configObj.reloginOnStart !== undefined) {
            obj.setReloginOnStart(configObj.reloginOnStart);
        }      
        
        if (configObj.ping !== undefined) {
            obj.setPing(configObj.ping);     
        }
        
        if (configObj.logsnapdir !== undefined){
            obj.setLogSnapDir(configObj.logsnapdir);
        }

        if (configObj.snapshotOnLog !== undefined){
            obj.setSnapshotOnLog(configObj.snapshotOnLog);
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
     * Method that stores object that contains deferred object and process id of the sandbox function being executed.
     *
     * @access private
     *
     * @param object usrDef deferred object
     * @param string usrProcId id of the process
     *
     * @throws string
     *
     */

    function pushSandBoxFuncDeferred(usrDef, usrProcId)
    {
        if (!(usrDef instanceof deferred.constFunc)) {
            throw 'Invalid deferred object of the sandbox process';
        }

        if (typeof usrProcId !== 'string' || usrProcId.length === 0) {
            throw 'Invalid sandbox process ID';
        }

        sandboxFuncDefStack.push({
            id: usrProcId,
            def: usrDef
        });
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
    /**
     * Method injects script to the current page.
     *
     * @access private
     *
     * @param string path to the script
     *
     * @throws string
     *
     */

    function injectScript(script)
    {
        var curPage = obj.getPage();
        var tmpLibraryPath = curPage.libraryPath;

        curPage.libraryPath = obj.getModulesPath();

        if (!curPage.injectJs(script)) {
            curPage.libraryPath = tmpLibraryPath;
            throw 'Cannot inject: "' + script + '"';
        }

        curPage.libraryPath = tmpLibraryPath;
    }

    /**
     * Method injects additional scripts to the current page.
     *
     * User can inject all the sandbox scripts of the current framework if the 'bogey_all' value is passed.
     *
     * @access private
     *
     * @param string|array additionalScripts array of paths to scripts or single path to the script or special keyword ('bogey_all')
     *
     * @throws string
     *
     */

    function injectScripts(additionalScripts)
    {
        var script = null;

        if (additionalScripts !== undefined) {
            if (typeof additionalScripts === 'string') {
                additionalScripts = [additionalScripts];
            }

            if (typeof additionalScripts !== 'object') {
                throw 'Additional scripts files must be provided as array';
            }

            for (script in additionalScripts) {
                if (typeof additionalScripts[script] !== 'string') {
                    throw 'Additional script file name must be string';
                }

                // check for special keywords
                switch (additionalScripts[script].toLowerCase()) {
                    case 'bogey_all':
                        for (var i in bogeySandboxScriptsList) {
                            injectScript(bogeySandboxScriptsList[i]);
                        }

                        break;
                    default:
                        injectScript(additionalScripts[script]);
                        break;
                }
            }
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
     * @throws string
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
    
    /**
     * PhantomJS event handler method that is called when a new child window is created by the page.
     *
     * If there is a callback function on the 'pageCreatedFuncStack' it will be executed.
     *
     * @access private
     * 
     * @param object new page
     * 
     * @see pushPageCreatedFunc()
     * @see popPageCreatedFunc()
     * 
     */      
    
    curPage.onPageCreated = function(page) {
        if (pageCreatedFuncStack.length > 0) {
            obj.popPageCreatedFunc()(page);
        }
    }

    /**
     * PhantomJS event handler method that is called when the server is called from sandbox.
     *
     * Method will try to find the process deferred object and reject/resolve it based on data received from the sandbox.
     *
     * @access private
     *
     * @param object data sent from the sandbox
     *
     * @see pushSandBoxFuncDeferred()
     *
     */

    curPage.onCallback = function(data) {
        var stackVal;

        for (var i = 0; i < sandboxFuncDefStack.length; i++) {
            if (data.id === sandboxFuncDefStack[i].id) {
                stackVal = sandboxFuncDefStack[i];
                sandboxFuncDefStack.splice(i, 1);

                if (data.error === true) {
                    stackVal.def.reject(obj.createErrorObject(6, data.message));
                } else {
                    stackVal.def.resolve(data.data);
                }

                break;
            }
        }
    }
    
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
        if (snapshotOnLog === true) {
            obj.takeSnapshot('jpeg', description.replace(/\ /gi, "_"), obj.getLogSnapDir());
        }

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
     * Method that pushes 'onPageCreated' callback function to the stack.
     *
     * Simple method that pushes 'onPageCreated' callback function to the stack.
     *
     * @access privileged
     *
     * @param function func callback function
     * 
     * @throws string 
     *
     */     
    
    this.pushPageCreatedFunc = function(func)
    {
        if (typeof func != 'function') {
            throw 'Passed operation is not a function';
        }
        
        pageCreatedFuncStack.push(func);        
    }
    
    /**
     * Method that pulls 'onPageCreated' callback function from the stack.
     *
     * Simple method that pulls 'onPageCreated' callback function from the stack.
     *
     * @access privileged
     *
     * @return object first 'onPageCreated' callback function from the stack.
     * 
     */       
    
    this.popPageCreatedFunc = function()
    {
        return pageCreatedFuncStack.pop();
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
     * Method accepts a bunch of optional parameters used to tune image snapshot process. If delay is set to '0' the screenshot will be taken immediately.
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

        var renderCallback = function() {
            curPage.render(dirPath + imgName + '.' + imgFormat);

            if (width !== undefined && height !== undefined) {
                curPage.viewportSize = obj.popViewportSize();
            }

            def.resolve(dirPath + imgName + '.' + imgFormat);
        };
        
        try {
            if (format !== undefined) {
                imgFormat = fileUtils.checkImgExt(format); 
            }
        
            if (name !== undefined) {
                imgName = fileUtils.checkImgName(name);
            }
            
            if (path === undefined || (typeof path == 'string' && path.length == 0)) {
                dirPath = '';
            } else {
                if (fileUtils.isPathWritable(path)) {                   
                    dirPath = fileUtils.addSeparator(path);
                }                                                   
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

        if (curDelay === 0) {
            renderCallback();
        } else {
            setTimeout(renderCallback, curDelay);
        }
        
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
     * @param array|string additionalScripts array of strings which points to the additional files which will be injected
     *
     * @return object promise.
     * 
     */      
    
    this.validatePageBySchema = function(schmePath, serviceNamespace, schemaNamespace, format, additionalScripts)
    {
        var def = deferred.create();  
        
        // validation
        if (typeof schmePath != 'string') {
            def.reject(obj.createErrorObject(5, 'Invalid path to schema file'));
            return def.promise();
        }
 
        if (typeof schemaNamespace != 'string') {
            def.reject(obj.createErrorObject(5, 'Invalid service namespace type'));
            return def.promise();
        } 
 
        if (typeof schemaNamespace != 'string') {
            def.reject(obj.createErrorObject(5, 'Invalid schema namespace type'));
            return def.promise();
        }
        
        var curPage = obj.getPage();

        // inject additional scripts
        try {
            injectScript('sandbox/schemavalidator.js');
            injectScripts(additionalScripts);
            injectScript(schmePath);
        } catch(error) {
            def.reject(obj.createErrorObject(5, error));
            return def.promise();
        }

        // evalute
        var result = JSON.parse(curPage.evaluate(function(service, schema, format) {
            try {
                schema = schema.split('.');

                var schemaObj = Bogey[service]['schemas'][schema[0]];

                for (var i = 1; i < schema.length; i++) {
                    schemaObj = schemaObj[schema[i]]
                }

                var validator = new Bogey.SchemaValidator(schemaObj, format);

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
        
        return def.promise();
    }

    /**
     * Method that recursively validates page against defined schema.
     *
     * Method will recursively validate the page until the page will be valid or until timeout (useful for onepage sites).
     *
     * @access privileged
     *
     * @param string schmePath path to the current schema
     * @param string serviceNamespace namespace of the current service in sandbox mode
     * @param string schemaNamespace namespace of the current schema in sandbox mode
     * @param string format of the output data
     * @param array|string additionalScripts array of strings which points to the additional files which will be injected
     * @param int timeout for the validation purpose (if not set - default timeout will be used)
     * @param int interval between each iteration of the validation purpose (if not set - default interval will be used)
     *
     * @return object promise.
     *
     */

    this.validatePageBySchemaUntilRec = function(schmePath, serviceNamespace, schemaNamespace, format, additionalScripts, timeout, interval)
    {
        var def = deferred.create();

        var intrevalInd;

        var curTimeout;
        var curInterval;

        var callbackFunc = function(curInt){
            intrevalInd = setTimeout(function(){
                obj.validatePageBySchema(schmePath, serviceNamespace, schemaNamespace, format, additionalScripts).done(function(result){
                    def.resolve(result);
                }).fail(function(error){
                    callbackFunc(curInterval);
                });
            }, curInt);
        }

        // validation
        if (timeout !== undefined) {
            if (typeof timeout !== 'number') {
                def.reject(obj.createErrorObject(5, 'Timeout is not a number'));
                return def.promise();
            }

            curTimeout = timeout;
        } else {
            curTimeout = validatePageBySchemaUntilRecTimeout;
        }

        if (interval !== undefined) {
            if (typeof interval !== 'number') {
                def.reject(obj.createErrorObject(5, 'Interval is not a number'));
                return def.promise();
            }

            curInterval = interval;
        } else {
            curInterval = validatePageBySchemaUntilRecInterval;
        }

        // reject if timeout
        setTimeout(function(){
            if (intrevalInd !== undefined) {
                clearTimeout(intrevalInd);
            }

            if (!def.isProcessed()) {
                def.reject(obj.createErrorObject(1, 'Timeout of recursive validation by schema'));
            }
        }, curTimeout);

        callbackFunc(0);

        return def.promise();
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

        // inject additional scripts
        try {
            injectScript('sandbox/schemavalidator.js');
            injectScripts(schema.scripts);
        } catch(error) {
            def.reject(obj.createErrorObject(5, error));
            return def.promise();
        }

        // evalute page
        var result = JSON.parse(curPage.evaluate(function(schema, format) {
            try {     
                schema = JSON.parse(schema);
                
                var validator = new Bogey.SchemaValidator(schema, format);

                return JSON.stringify(validator.checkElementsBySchema());    
            } catch(e) {
                return JSON.stringify({error: true, message: e});
            }
                    
        }, JSON.stringify(schema.sandbox_schema), format));         
        
        if (result.error != undefined && result.error == true) {
            console.log(JSON.stringify(result));
            def.reject(obj.createErrorObject(2, result.message));
        } else {
            def.resolve(result);
        }        
        
        return def.promise();
    }

    /**
     * Method that asynchronously executes function in sandbox.
     *
     * @access privileged
     *
     * @param function usrFunc function to execute
     * @param array|string additionalScripts additional scripts that will be injected to the sandbox
     *
     * @throws string
     *
     * @return object promise.
     *
     */

    this.executeSandboxFunc = function(usrFunc, additionalScripts)
    {
        var def = deferred.create();

        // validation
        if (typeof usrFunc !== 'function') {
            def.reject(obj.createErrorObject(5, 'Invalid sandbox function'));
        }

        if (additionalScripts === undefined) {
            additionalScripts = 'bogey_all';
        }

        // inject scripts
        try {
            injectScripts(additionalScripts);
        } catch(error) {
            def.reject(obj.createErrorObject(5, error));
        }

        // create id
        var procId = stringUtils.genRandStringRec(5);

        // store process data
        pushSandBoxFuncDeferred(def, procId);

        // evalute page
        curPage.evaluate(function(func, curId) {
            try {
                var res = func();

                if (res instanceof Bogey.async.classes.Promise || res instanceof Bogey.async.classes.Deferred) {
                    res.done(function(usrData){
                        window.callPhantom({
                            error: false,
                            data: usrData,
                            id: curId
                        });
                    }).fail(function(error){
                        window.callPhantom({
                            error: true,
                            message: error,
                            id: curId
                        });
                    });
                } else {
                    window.callPhantom({
                        error: false,
                        data: res,
                        id: curId
                    });
                }
            } catch(e) {
                window.callPhantom({
                    error: true,
                    message: e,
                    id: curId
                });
            }

        }, usrFunc, procId);

        return def.promise();
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
     * @param array dummy schema variables
     *  
     * @return object deferred object.
     * 
     * @throws string 
     * 
     */        
        
    this.runDummySchema = function(schema, variables)
    {
        if (typeof schema != 'object') {
            throw 'Schema for "dummy" must be object';
        }
        
        var dummyObj = dummy.create(obj);
        var key = '';
              
        if (variables !== undefined) {
            if (typeof variables != 'object') {
                throw 'Variables for dummy schema must presented as array';
            }

            for (key in variables) {
                dummyObj.addDummySchemaVar(key, variables[key]);
            }
        } 
             
        return dummyObj.runSchema(schema);
    }
    
    /**
     * Fetches value of the input element from the current page using a supplied query selector.
     *
     * Object evaluates current page and passes a query selector to it. On page script seeks for the element and returns its value.
     *
     * @access privileged
     * 
     * @param string query selector
     *  
     * @return string|null value.
     * 
     * @throws string 
     * 
     */     
    
    this.fetchInputValue = function(sel)
    {
        if (sel === undefined) {
            throw 'Query for the input element is not set';
        }
        
        if (typeof sel !== 'string') {
            throw 'Query for the input element must be string';
        }
        
        
        // evalute page
        return curPage.evaluate(function(usrSel, format) {
            var selRes = document.querySelectorAll(usrSel);     
            
            if (selRes. length <= 0) {
                return;
            } else {
                return selRes.item(0).value;
            }
        }, sel);           
    }

    /**
     * Method that opens page by its URL.
     *
     * @access privileged
     *
     * @param string url of the page
     *
     * @return object promise.
     *
     */

    this.openPage = function(url)
    {
        var def = deferred.create();
        var curPage = obj.getPage();

        var URLpattern = /^(https?|ftp|file):\/\/.+$/;

        // check for type
        if (typeof url !== 'string') {
            def.reject(this.createErrorObject(5, '"URL" parameter must be string'));
            return def.promise();
        }

        // check for length
        if (url.length === 0) {
            def.reject(this.createErrorObject(5, '"URL" parameter length must be greater than zero'));
            return def.promise();
        }

        // validate URL
        if (!URLpattern.test(url)) {
            def.reject(this.createErrorObject(5, '"URL" is invalid'));
            return def.promise();
        }

        if (url[url.length - 1] !== '/') {
            url += '/';
        }

        curPage.open(url, function(status) {
            if (status === 'success') {
                def.resolve();
            } else {
                def.reject(obj.createErrorObject(3, 'Page cannot be opened'));
            }
        });

        return def.promise();
    }

    /**
     * Method that opens page by the provided path (relative to the current domain).
     *
     * @access privileged
     *
     * @param string path part of the URL
     *
     * @return object promise.
     *
     */

    this.openPageRel = function(path)
    {
        var def = deferred.create();
        var curPage = obj.getPage();

        var hostPattern = /^[a-z][a-z0-9+\-.]*:\/\/([a-z0-9\-._~%!$&'()*+,;=]+@)?([a-z0-9\-._~%]+|\[[a-f0-9:.]+\]|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])(:[0-9]+)?(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?(\?[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-z0-9\-._~%!$&'()*+,;=:@/?]*)?$/;
        var matchRes;

        // check for type
        if (typeof path !== 'string') {
            def.reject(this.createErrorObject(5, '"Path" parameter must be string'));
            return def.promise();
        }

        // check for length
        if (path.length === 0) {
            def.reject(this.createErrorObject(5, '"Path" parameter length must be greater than zero'));
            return def.promise();
        }

        if (curPage.url === 'about:blank') {
            def.reject(this.createErrorObject(5, 'No domain found'));
            return def.promise();
        }

        matchRes = curPage.url.match(hostPattern);

        if (matchRes === null || matchRes.length === 0) {
            def.reject(this.createErrorObject(5, 'No domain found'));
            return def.promise();
        }

        if (matchRes[0][matchRes[0].length - 1] !== '/') {
            matchRes[0] += '/';
        }

        matchRes[0] += path;

        this.openPage(matchRes[0]).done(function(){
            def.resolve();
        }).fail(function(error){
            def.reject(error);
        });

        return def.promise();
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
     * Method that returns current page name.
     *
     * Simple method that returns current page name.
     *
     * @access privileged
     * 
     * @return string page name.
     * 
     */        
    
    this.getCurPageName = function()
    {
        return curPageName;
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
     * Method that returns current scenario.
     *
     * Simple method that returns current scenario.
     *
     * @access privileged
     * 
     * @return object scenario.
     * 
     */      
    
    this.getScenario = function()
    {
        return scenario;
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
    
    /**
     * Method that returns value of the property that indicates whether current object must relogin to the service every time it is started.
     *
     * Simple method that returns value of the property that indicates whether current object must relogin to the service every 
     * time it is started.
     *
     * @access privileged
     * 
     * @return bool value of the 'reloginOnStart' property.
     * 
     */      
    
    this.getReloginOnStart = function()
    {
        return reloginOnStart;
    }
    
    /**
     * Method that returns value of the current ping in milliseconds.
     *
     * Simple method that returns value of the current ping in milliseconds.
     *
     * @access privileged
     * 
     * @return int value of the ping in milliseconds.
     * 
     */    
    
    this.getPing = function()
    {
        return ping;
    }

    /**
     * Returns directory where logging snapshots will be stored.
     *
     * Simple method that returns directory where logging snapshots will be stored.
     *
     * @access privileged
     *
     * @return string relative path to directory.
     * 
     */    
    
    this.getLogSnapDir = function()
    {
        return logSnapDir;
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
     * Method that sets current page object.
     *
     * Simple method that sets current page object.
     *
     * @access privileged
     * 
     * @param object page new page
     * 
     * @see configureService();
     * 
     */      
    
    this.setPage = function(page)
    {
        if (typeof page != 'object') {
            throw 'New page must be of type object';
        }
        
        page.onUrlChanged = curPage.onUrlChanged;     
        page.onLoadFinished = curPage.onLoadFinished;
        page.onPageCreated = curPage.onPageCreated;
                
        page.viewportSize = curPage.viewportSize;   
        page.libraryPath = curPage.libraryPath;
            
        page.onAlert = curPage.onAlert;
        page.onConsoleMessage = curPage.onConsoleMessage;
            
        curPage = page;
    }    
    
    /**
     * Method that sets current page name.
     *
     * Simple method that sets current page name.
     *
     * @access privileged
     * 
     * @param string usrPageName page name
     * 
     * @throws string 
     * 
     */      
    
    this.setCurPageName = function(usrPageName)
    {
        if (typeof usrPageName != 'string') {
            throw 'Page name is not a string';
        }
        
        if (usrPageName.length <= 0) {
            throw 'Page name length cannot be zero';            
        }
        
        curPageName = usrPageName;
    }
    
    /**
     * Method that sets current scenario.
     *
     * Simple method that sets current scenario.
     *
     * @access privileged
     * 
     * @param string usrScenario scenario
     * 
     * @throws string 
     * 
     */       
    
    this.setScenario = function(usrScenario)
    {
        if (typeof usrScenario != 'object') {
            throw 'Scenario must be object';
        }

        scenario = usrScenario;
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
         
        usrModulesPath = fileUtils.getAbsolutePath(usrModulesPath);
         
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
 
        if (debugSandbox == true) {
            curPage.onAlert = function(msg) {
                console.log('Page alert: ' + msg);
            };
            
            curPage.onConsoleMessage = function(msg) {
                console.log('Page console: ' + msg);
            };
        } else {
            curPage.onAlert = undefined;
            curPage.onConsoleMessage = undefined;
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
    
    /**
     * Method that sets value for the property that indicates whether current object must relogin to the service every time it is started.
     *
     * Simple method that sets value for the property that indicates whether current object must relogin to the service every 
     * time it is started.
     *
     * @access privileged
     * 
     * @param bool usrRelogin value for the property
     * 
     * @throws string 
     * 
     */     
   
    this.setReloginOnStart = function(usrRelogin)
    {
        if (typeof usrRelogin != 'boolean') {
            throw 'Property "reloginOnStart" must be boolean';
        }
        
        reloginOnStart = usrRelogin;
    } 
    
    /**
     * Method that sets value for the possible ping.
     *
     * Simple method that sets value for the possible ping.
     *
     * @access privileged
     * 
     * @param int usrPing ping in milliseconds
     * 
     * @throws string 
     * 
     */    
    
    this.setPing = function(usrPing)
    {
        if (typeof usrPing != 'number') {
            throw 'Property "ping" must be number';
        }
        
        ping = usrPing;
    }
    
    /**
     * Sets directory where logging snapshots will be stored.
     *
     * Simple method that sets directory where logging snapshots will be stored.
     *
     * @access privileged
     *
     * @param string usrDir relative path to the directory
     * 
     * @throws string 
     * 
     */    
    
    this.setLogSnapDir = function(usrDir)
    {
        if (typeof usrDir != 'string') {
            throw 'Property "logSnapDir" must be string';
        }        
        
        logSnapDir = usrDir;
    }

    /**
     * Sets parameter that indicates whether to take screenshot on every log message.
     *
     * @access privileged
     *
     * @param boolean usrVal true or false
     *
     * @throws string
     *
     */


    this.setSnapshotOnLog = function(usrVal)
    {
        if (typeof usrVal != 'boolean') {
            throw 'Property "snapshotOnLog" must be boolean';
        }

        snapshotOnLog = usrVal;
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