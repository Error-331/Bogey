// Modules include
var service = require('../../core/service');
var dummy = require('../../core/dummy');
var deferred = require('../../async/deferred');

var Base = function(configObj)
{ 
    service.constFunc.call(this, configObj, 'odnoklassniki_base');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;    
    
    var mainPageURL = 'http://www.odnoklassniki.ru/';
    
    var logInTimeout = 8000;
    var logOutTimeout = 6000;
    var openMainPageTimeout = 3000; 
    var openLoginPageTimeout = 3000;
    
    /**
     * @access private
     * @var string login for odnoklassniki
     */      
    
    var serviceLogin = 'SergeySel331';
    
    /**
     * @access private
     * @var string password for odnoklassniki
     */       

    var servicePassword = 'sad213CXZ';
    
    /* Private members ends here */
      
    /* Private core methods starts here */ 
                   
    function openMainPage()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening main page takes too long...');
                def.reject(obj.createErrorObject(1, 'Main page open timeout'));
            }
        }, openMainPageTimeout);      
                
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening main page...'); 
        
        // check if main page is already open
        if (obj.getCurPageURL() == mainPageURL) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Main page already opened...'); 
            def.resolve();
        } else {         
            // open main page
            curPage.open(mainPageURL, function(status) {
                if (status == 'success') {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Main page successfuly opened...'); 
                    def.resolve();
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open main page...'); 
                    def.reject(obj.createErrorObject(3, 'Main page cannot be opened'));
                }           
            });                                  
        }
                
        return def;
    }    

    function openLoginPage()
    {
        var curPage = obj.getPage();
        var def = deferred.create();
                
        var parseLoginFormLoc = function()
        {
            obj.validatePageBySchema('odnoklassniki/schemas/mainloginform.js', 'odnoklassniki', 'mainLoginForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Login page already opened...'); 
                def.resolve(result);
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot find login form...'); 
                def.reject(error);
            });                      
        }
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening login page takes too long...');
                def.reject(obj.createErrorObject(1, 'Cannot open login page'));
            }
        }, openLoginPageTimeout);          
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening login page...');    
        
        // check if main page is already open
        if (obj.getCurPageURL() == mainPageURL) {
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Parsing login form...'); 

            // check if login form is present
            parseLoginFormLoc();
        } else {   
            openMainPage().done(function(){    
                // check if login form is present
                parseLoginFormLoc();
            }).fail(function(){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open login form...'); 
                def.reject(obj.createErrorObject(3, 'Cannot open login page'));                
            });       
        }
        
        return def;
    }
       
    function isLogedIn()
    {
        var def = deferred.create();  
        
        // check if any page is open
        if (obj.getCurPageURL() == '') {
            obj.openMainPage().done(function(){
                // parse toolbar
                obj.validatePageBySchema('odnoklassniki/schemas/maintoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects').done(function(result){
                    def.resolve(result);
                }).fail(function(error){
                    def.reject(error);
                });                                
            }).fail(function(error){
                def.reject(error);
            });
        } else {
            // parse toolbar
            result = obj.validatePageBySchema('odnoklassniki/schemas/toptoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects').done(function(result){
                def.resolve(result);
            }).fail(function(error){
                def.reject(error);
            });           
        }
        
        return def;
    }   
     
    function logOut()
    {
        var curPage = obj.getPage();
        var def = deferred.create();  
        
        
        return def;
    }
    
    
    function logIn()
    {
        var curPage = obj.getPage();
        var def = deferred.create(); 
                      
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Login takes too long...');
                def.reject(obj.createErrorObject(1, 'Login timeout'));
            }
        }, logInTimeout);              
        
        var enterLogin = function()
        {
            obj.validatePageBySchema('odnoklassniki/schemas/mainloginform.js', 'odnoklassniki', 'mainLoginForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                // page change callback
                obj.pushPageLoadFunc(function(status){                   
                    if (status == 'success') {
                        obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking if are logged in...');
                        obj.validatePageBySchema('odnoklassniki/schemas/maintoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects').done(function(result){                          
                            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Main toolbar found, logged in...');

                            // add cookies
                            obj.addCookies(curPage.cookies);
                            def.resolve(result);                           
                        }).fail(function(error){
                            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Main toolbar not found, not logged in...');
                            def.reject(error);                             
                        });                                           
                    } else {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while redirecting after login...');
                        def.reject(obj.createErrorObject(3, 'Error while redirecting after login'));
                    }                                   
                });
                
                // prepare viewport
                obj.pushViewportSize(curPage.viewportSize); 
                curPage.viewportSize = {width: 800, height: 600};
                    
                // enter login and password
                var curDummy = dummy.create(curPage);
                var subResult = result.slice(0, 2);

                subResult[0].text = serviceLogin;
                subResult[1].text = servicePassword;

                curDummy.fillTextInputBunch(subResult);
                result[2].top = result[2].top + 10;
                result[2].left= result[2].left + 10;
                curDummy.click(result[2]);
                    
                // restore viewport
                curPage.viewportSize = obj.popViewportSize();                  
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot find login form...');
                def.reject(error);      
            });               
        }        
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting login process...'); 
                
        // check if already loged in
        isLogedIn().done(function(){
           obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Already loged in, trying to logout...'); 
        
            // trying to logout
            logOut().done(function(){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot login...');
                
                // open login page
                openLoginPage().done(function(){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Entering login data...');
                    enterLogin();
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot login...');
                    def.reject(error);
                });                               
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot login...');     
                def.reject(error);
            });
        
           // def.resolve();
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Not logged in, trying to login...');
            
            // open login page
            openLoginPage().done(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Entering login data...');
                enterLogin();
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot login...');
                def.reject(error);
            });
        });
        
        return def;
    }
        
    /* Private core methods ends here */
    
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
    
    this.configureService = function(configObj) 
    {
        if (typeof configObj != 'object') {
            return;
        }
    } 
    
    this.logIn = function()
    {
        try {
            return this.startOp(logIn);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "logIn"...');
        }        
    }     
    
    this.logOut = function()
    {
        try {
            return this.startOp(logOut);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "logOut"...');
        }        
    }    
    
    this.openMainPage = function()
    {
        try {
            return this.startOp(openMainPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openMainPage"...');
        }           
    }       
    
    /* Privileged core methods ends here */

    this.configureService(configObj);
}

exports.constFunc = Base;
exports.create = function create(configObj) {
    "use strict";
    //obj.takeSnapshot('jpeg', 'test', '/', 1024, 768);
    Base.prototype = service.create(configObj, 'odnoklassniki_base');
    return new Base(configObj, 'odnoklassniki_base');
};          