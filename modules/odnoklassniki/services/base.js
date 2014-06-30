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
     * @var int timeout (in milliseconds) for operation which is responsible for opening group page of the service
     */

    var openGroupTimeout = 10000;
   
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
     * @var int timeout (in milliseconds) for operation which is responsible for fetching users IDs from the group
     */

    var fetchGroupUsersIdsTimeout = 600000;
    
    /**
     * @access private
     * @var string login for odnoklassniki
     */      
    
    var serviceLogin = '';
    
    /**
     * @access private
     * @var string password for odnoklassniki
     */       

    var servicePassword = '';
        
    /* Private members ends here */
      
    /* Private core methods starts here */ 
    
    /**
     * Method that is responsible for opening main page of the service.
     *
     * Simple method that tries to open main page of the service.
     *
     * @access private
     *
     * @return object operation promise.
     */       
                   
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
                if (status === 'success' && !def.isProcessed()) {
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

    /**
     * Method that is responsible for group page of the service.
     *
     * Simple method that tries to open group page of the service.
     *
     * @access private
     *
     * @param int|string pathId group ID or group path
     *
     * @return object operation promise.
     */

    function openGroupPage(pathId)
    {
        var curPage = obj.getPage();
        var def = deferred.create();

        var path;

        // check params
        if (typeof pathId !== 'string' && typeof pathId !== 'number') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Invalid group ID or path...');
            def.reject(obj.createErrorObject(5, 'Option check error'));

            return def.promise();
        }

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening group page...');

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening group page takes too long...');
                def.reject(obj.createErrorObject(1, 'Group page timeout'));
            }
        }, openGroupTimeout);

        logIn().done(function(){
            if (typeof pathId === 'string') {
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Opening group page by URL...');
                path = pathId;
            } else {
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Opening group page by ID...');
                path = '/group/' + pathId
            }

            obj.openPageRel(pathId).done(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Page opened...');

                result = obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/group/main.js', 'odnoklassniki', 'group.main', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Group page opened successfully...');
                    def.resolve(result);
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open group page...');
                    def.reject(error);
                });
            }).fail(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'fail', 'Cannot open group page...');
                def.reject(obj.createErrorObject(3, 'Cannot open group page'));
            });
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot open group page...');
            def.reject(obj.createErrorObject(3, 'Cannot open group page'));
        });

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
        
        var result = null;

        // check if any page is open
        if (curURL == '' || curURL == 'about:blank') {
            obj.openMainPage().done(function(){
                // parse toolbar
                result = obj.validatePageBySchema('odnoklassniki/schemas/sandbox/validation/maintoolbar.js', 'odnoklassniki', 'mainToolbar', 'plain-objects', ['sandbox/utils.js']).done(function(result){
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
           if (obj.getReloginOnStart() === true) {
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

    function fetchAvailableGroupUsersIds(pathId)
    {
        var curPage = obj.getPage();
        var def = deferred.create();

        var curPing = obj.getPing();

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Fetching users IDs of the group takes too long...');
                def.reject(obj.createErrorObject(1, 'Login timeout'));
            }
        }, fetchGroupUsersIdsTimeout + curPing);

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting process of fetching user IDs of the group...');

        openGroupPage(pathId).done(function(){
            obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Trying to open users page...');

            // run dummy schema (click 'All members' button)
            var schema = require('../schemas/dummy/group/clickshowgroupmembers').schema;
            obj.runDummySchema(schema).done(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', '"dummy" schema successfully processed...');

                obj.validatePageBySchemaUntilRec('odnoklassniki/schemas/sandbox/validation/group/memberslist.js', 'odnoklassniki', 'group.memberList', 'plain-objects', ['sandbox/utils.js']).done(function(){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Members list page successfully opened...');

                    schema = require('../schemas/dummy/group/fetchmembersids').schema;
                    obj.runDummySchema(schema).done(function(data){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Members list successfully retrieved...');
                        def.resolve(data);
                    }).fail(function(err){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot retreive members list...');
                        def.reject(err);
                    });

                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open members list page...');
                    def.reject(obj.createErrorObject(error));
                });


            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot run "dummy" schema for "click show group members"...');
                def.reject(obj.createErrorObject(4, error));
            });


        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot fetch user IDs of the group...');
            def.reject(error);
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
                        schemaVars['gender'] = 100;
                        break;
                    case 'female':
                        schemaVars['gender'] = 200;
                        break;
                    case 'any':
                        schemaVars['gender'] = 300;
                        break;
                    default:
                        def.reject(obj.createErrorObject(5, 'Criteria gender is invalid'));  
                        break;
                }       
schemaVars['gender'] = {'left': 500, 'top': 0};
                obj.runDummySchema(schema, schemaVars).done(function(){                             
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');   
                    
                    
                    
                    
                    obj.takeSnapshot('jpeg', 'test', '', 1024, 768, 1000);
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

        if (configObj.serviceLogin !== undefined) {
            this.setServiceLogin(configObj.serviceLogin);
        }

        if (configObj.servicePassword !== undefined) {
            this.setServicePassword(configObj.servicePassword);
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
    
    /**
     * Operation method that starts (or puts to the stack) operation 'openMainPage'.
     *
     * Method that starts operation that tries to open main page of the service.
     *
     * @access privileged
     *
     * @return object operation promise.
     *
     */      
    
    this.openMainPage = function()
    {
        try {
            return obj.startOp(openMainPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openMainPage"...');
        }           
    }

    /**
     * Operation method that starts (or puts to the stack) operation 'openGroupPage'.
     *
     * Method that starts operation that tries to open group page of the service.
     *
     * @access privileged
     *
     * @param int|string pathId group ID or group path
     *
     * @return object operation promise.
     *
     */

    this.openGroupPage = function(pathId)
    {
        try {
            return obj.startOp(openGroupPage, pathId);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openGroupPage...');
        }
    }

    /**
     * Operation method that starts (or puts to the stack) operation 'fetchGroupUsersIds'.
     *
     * Method that starts operation that tries to fetch IDs of the users of the specific group (until service limit is reached).
     *
     * @access privileged
     *
     * @param int|string pathId group ID or group path
     *
     * @return object operation promise.
     *
     */

    this.fetchAvailableGroupUsersIds = function(pathId)
    {
        try {
            return obj.startOp(fetchAvailableGroupUsersIds, pathId);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "fetchGroupUsersIds...');
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
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */

    /**
     * Method that sets login for current service.
     *
     * @access privileged
     *
     * @param string usrLogin login string
     *
     * @throws string
     *
     */

    this.setServiceLogin = function(usrLogin)
    {
        if (typeof usrLogin !== 'string') {
            throw 'Service login must be string';
        }

        serviceLogin = usrLogin;
    }

    /**
     * Method that sets password for current service.
     *
     * @access privileged
     *
     * @param string usrPassword password string
     *
     * @throws string
     *
     */

    this.setServicePassword = function(usrPassword)
    {
        if (typeof usrPassword !== 'string') {
            throw 'Service password must be string';
        }

        servicePassword = usrPassword;
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