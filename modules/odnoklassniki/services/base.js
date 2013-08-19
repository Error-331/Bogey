// Modules include
var service = require('../../core/service');
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
    
    /**
     * @access private
     * @var string main URL of the service
     */        
    
    var mainPageURL = 'http://www.odnoklassniki.ru/';
    
    /**
     * @access private
     * @var int login operation timeout in milliseconds
     */      
    
    var logInTimeout = 16000;
    
    /**
     * @access private
     * @var int logout operation timeout in milliseconds
     */       
    
    var logOutTimeout = 10000;
    
    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for opening main page of the service
     */          
    
    var openMainPageTimeout = 5000; 
   
    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for opening main login page of the service
     */       
    
    var openLoginPageTimeout = 3000;
    
    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for searching people by criteria
     */     
    
    var searchPeopleByCriteriaTimeout = 300000;
    
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
    
    /**
     * @access private
     * @var bool property that indicates whether current object must relogin to odnoklassniki every time it is started
     */      
    
    var reloginOnStart = false;
    
    /* Private members ends here */
      
    /* Private core methods starts here */ 
                   
    function openMainPage()
    {
        var curPage = obj.getPage();
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
                if (status == 'success' && !def.isProcessed()) {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Main page successfuly opened...'); 
                    def.resolve();
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open main page...'); 
                    def.reject(obj.createErrorObject(3, 'Main page cannot be opened'));
                }           
            });                                  
        }
                
        return def.promise();
    }    

    function openLoginPage()
    {
        var curPage = obj.getPage();
        var def = deferred.create();
                
        var parseLoginFormLoc = function()
        {
            obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/mainloginform.js', 'odnoklassniki', 'mainLoginForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){
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
        
        return def.promise();
    }
    
    /**
     * Method that starts checks whether current object logged in to odnoklassniki or not.
     *
     * Current uses schema to parse main page and to find out evidence that the current object logged in to odnoklassniki or not.
     *
     * @access privileged
     * 
     * @return object promise.
     * 
     */    
       
    function isLogedIn()
    {
        var def = deferred.create();  
        var curURL = obj.getCurPageURL();

        // check if any page is open
        if (curURL == '' || curURL == 'about:blank') {
            obj.openMainPage().done(function(){
                // parse toolbar
                obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/maintoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects').done(function(result){
                    def.resolve(result);
                }).fail(function(error){
                    def.reject(error);
                });                                
            }).fail(function(error){
                def.reject(error);
            });
        } else {
            // parse toolbar
            result = obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/toptoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                def.resolve(result);
            }).fail(function(error){
                def.reject(error);
            });           
        }
        
        return def.promise();
    }   
     
    function logOut()
    {
        var curPage = obj.getPage();
        var def = deferred.create();   
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Logout takes too long...');
                def.reject(obj.createErrorObject(1, 'Logout timeout'));
            }
        }, logOutTimeout);   
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting logout process...');
        
        // checking top toolbar
        obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/toptoolbar.js', 'odnoklassniki', 'topToolbar', 'plain-objects', ['sandbox/utils.js']).done(function(result){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Top toolbar found, trying to log out...');
                      
            // page change callback
            obj.pushPageLoadFunc(function(status){                   
                if (status == 'success') {
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking if are logged out...');
                    obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/mainloginform.js', 'odnoklassniki', 'mainLoginForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){                          
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Main login form found, logged out...');

                        // add cookies
                        obj.addCookies(curPage.cookies);
                        def.resolve(result);                           
                    }).fail(function(error){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Main login form not found, not logged out...');
                        def.reject(error);                             
                    });     
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while redirecting after logout...');
                    def.reject(obj.createErrorObject(3, 'Error while redirecting after logout'));
                }                                   
            });            
            
            // prepare dummy schema (click logout button)
            var schema = require('../schemas/dummy/clicklogout').schema;
            schema = obj.mergeDataAndDummySchema(schema, result);  
            
            // run dummy schema (click logout button)
            obj.runDummySchema(schema).done(function(){                             
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');      
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema for logout...');
                def.reject(obj.createErrorObject(4, error));
            });              
        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot find top toolbar...');
            def.reject(error);            
        });
        
        return def.promise();
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
                
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting login process...'); 
        
        var enterLogin = function()
        {
            obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/mainloginform.js', 'odnoklassniki', 'mainLoginForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                // page change callback
                obj.pushPageLoadFunc(function(status){                   
                    if (status == 'success') {
                        obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking if are logged in...');
                        obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/maintoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects').done(function(result){                          
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
                
                // run dummy schema (enter login and password)
                var schema = require('../schemas/dummy/fillmainloginform').schema;
                
                result[0].text = serviceLogin;
                result[1].text = servicePassword;
                
                schema = obj.mergeDataAndDummySchema(schema, result);
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Running "dummy" schema for login form...');
                        
                obj.runDummySchema(schema).done(function(){  
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...'); 
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema for login form...');
                    def.reject(obj.createErrorObject(4, error));
                });
                
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot find login form...');
                def.reject(error);      
            });               
        }            
                
        // check if already loged in
        isLogedIn().done(function(result){
           obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Already loged in...');  
           
           // check reloginOnStart
           if (reloginOnStart === true) {
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Already loged in, trying to logout...'); 
               
                // trying to logout
                logOut().done(function(){                
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
           } else {
               obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Already loged in...');
               
               // add cookies
               obj.addCookies(curPage.cookies);
               def.resolve(result);   
           }                        
        }).fail(function(error){
            if (typeof error == 'object' && (error.code == 3 || error.code == 1)) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot login, error while checking login status...');               
                def.reject(error);
                
                return def.promise();
            }
                       
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
        
        return def.promise();
    }
    
    function searchPeopleByCriteria(criteria)
    {
        var curPage = obj.getPage();
        var def = deferred.create();         
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Search people by criteria takes too long...');
                def.reject(obj.createErrorObject(1, 'Login timeout'));
            }
        }, searchPeopleByCriteriaTimeout);              
                
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting search people by criteria process...');         
       
        // check criteria
        if (typeof criteria != 'object') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Criteria is not set...');
            def.reject(obj.createErrorObject(5, 'Criteria is not set'));    
            
            return def.promise();
        }
               
        // check if already loged in
        logIn().done(function(){
            openMainPage().done(function(){
                           
                // click 'search new friends' button
                var schema = require('../schemas/dummy/clicksearchnewfriends').schema;
                var schemaVars = new Array();
                
                // prepare criteria (gender)
                if (criteria.gender === undefined) {
                    criteria.gender == 'any';
                }
        
                if (typeof criteria.gender == 'string') {
                    criteria.gender = criteria.gender.toLowerCase();
                }
        
                switch(criteria.gender) {
                    case 'male':
                        schemaVars['gender'] = 1;
                    case 'female':
                        schemaVars['gender'] = 2;
                    case 'any':
                        schemaVars['gender'] = 0;
                        break;
                    default:
                        def.reject(obj.createErrorObject(5, 'Criteria gender is invalid'));  
                    break;
                }       
                
                obj.runDummySchema(schema, criteria).done(function(){                             
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');   
                    
                    
                    
                    
                    obj.takeSnapshot('jpeg', 'test', '', 1024, 768, 6000);
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema for "click search new friends"...');
                    def.reject(obj.createErrorObject(4, error));
                });           
          
           }).fail(function(error){
               obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot search people by criteria...');
               def.reject(error);
           });       
       }).fail(function(error){
           obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot search people by criteria...');
           def.reject(error);
       });

        return def.promise();
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
        
        if (configObj.reloginOnStart != undefined) {
            obj.setReloginOnStart(configObj.reloginOnStart);
        }
    } 
    
    this.logIn = function()
    {
        try {
            return obj.startOp(logIn);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "logIn"...');
        }        
    }     
    
    this.logOut = function()
    {
        try {
            return obj.startOp(logOut);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "logOut"...');
        }        
    }    
    
    this.openMainPage = function()
    {
        try {
            return obj.startOp(openMainPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openMainPage"...');
        }           
    }   

    /**
     * Method that starts operation 'searchPeopleByCriteria'.
     *
     * Current method puts operation 'searchPeopleByCriteria' on operation stack.
     *
     * @access privileged
     * 
     * @param object criteria of the search
     * 
     * @return object deferred object.
     * 
     */

    this.searchPeopleByCriteria = function(criteria)
    {
        try {
            return obj.startOp(searchPeopleByCriteria, criteria);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "searchPeopleByCriteria"...');
        }
    }
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns value of the property that indicates whether current object must relogin to odnoklassniki every time it is started.
     *
     * Simple method that returns value of the property that indicates whether current object must relogin to odnoklassniki every 
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
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
   
    /**
     * Method that sets value for the property that indicates whether current object must relogin to odnoklassniki every time it is started.
     *
     * Simple method that sets value for the property that indicates whether current object must relogin to odnoklassniki every 
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
    
    /* Privileged set methods ends here */    
    
    this.configureService(configObj);
}

exports.constFunc = Base;
exports.create = function create(configObj) {
    "use strict";
    //obj.takeSnapshot('jpeg', 'test', '', 1024, 768);
    Base.prototype = service.create(configObj, 'odnoklassniki_base');
    return new Base(configObj, 'odnoklassniki_base');
};          