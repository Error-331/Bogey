// Modules include
var page = require('webpage');

var response = require('../io/response');
var deferred = require('../async/deferred');

var fileUtils = require('../utils/fileutils');

var Service = function(usrSystemKey, usrServiceName)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;     
    
    /**
     * @access private
     * @var string API key
     */        
    
    var systemKey = '';
    
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
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
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
                def.reject();
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
        var resp = response.create(serviceName, url, status, pageStatus, operationStatus, description);
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
     * Method that renders page (or part of the page) to the image file.
     *
     * Method can accep to sets of parameters: if only a full path to the image is given or if path to the image directory is given, as well as image name and
     * file extension.
     *
     * @access privileged
     * 
     * @param string full path to the image or path to the directory where image will be saved
     * @param string name of the file
     * @param string extenstion of the file
     * 
     * @throws string 
     *
     * @return string full path to the rendered page.
     * 
     */     
        
    this.renderPageToImage = function()
    {        
        var path = '';
        var ext = '';
        var name = '';
        var curPage = null;
        
        if (arguments.length == 1) {
            // Full path is given
            path = fileUtils.extractPath(arguments[0]);
            ext = fileUtils.extractExtension(arguments[0]);
            
            if (fileUtils.isPathWritable(path) === false) {
                throw 'Path is not writable';
            }
            
            ext = fileUtils.checkImgExt(ext);
            obj.getPage().render(path);
            return path;
        } else if (arguments.length == 3) {
            // Path, image name and image extension is given
            path = arguments[0];
            name = arguments[1];
            ext = arguments[2];
            
            if (fileUtils.isPathWritable(path) === false) {
                throw 'Path is not writable';
            }  

            name = fileUtils.checkImgName(name);
            ext = fileUtils.checkImgExt(ext);
            path = fileUtils.addSeparator(path)  + name + '.' + ext;
            
            obj.getPage().render(path);
            return path;
        } else {
            throw 'Invalid parameters set';
        }
    }
        
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current API key.
     *
     * Simple method that returns current API key.
     *
     * @access privileged
     * 
     * @return string API key.
     * 
     */      
    
    this.getSystemKey = function()
    {
        return systemKey;
    }
    
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
        
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    /**
     * Method that sets current API key.
     *
     * Simple method that sets current API key.
     *
     * @access privileged
     * 
     * @param string usrSystemKey current API key
     * 
     * @throws string 
     * 
     */     
    
    this.setSystemKey = function(usrSystemKey)
    {
        if (typeof usrSystemKey != 'string') {
            throw 'System key is not a string'
        }
        
        systemKey = usrSystemKey;
    }
    
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
    
    /* Privileged set methods ends here */  
    
    this.setSystemKey(usrSystemKey); 
    this.setServiceName(usrServiceName);
}

exports.constFunc = Service;
exports.create = function create(systemKey, moduleName) {
    "use strict";
    
    return new Service(systemKey, moduleName);
};