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
 * Module mail is a part of PhantomJS framework - Bogey.
 *
 * @package Phantasm
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Modules for Yandex service (http://www.yandex.ru).
 *
 * @subpackage yandex
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Services that are working with yandex (http://www.yandex.ru).
 *
 * @subpackage services
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Mail class.
 *
 * Following code represents a wrapper class for Yandex-mail service.
 *
 * @subpackage Mail
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * 
 */

// Modules include
var service = require('../../core/service');
var deferred = require('../../async/deferred');

var Mail = function(configObj)
{ 
    service.constFunc.call(this, configObj, 'yandex_mail');
    
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
    
    var mainPageURL = 'http://mail.yandex.ru/';
        
    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for opening main page of the service
     */      
    
    var openMainPageTimeout = 5000;
    
    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for opening registration page of the service
     */          
    
    var openRegPageTimeout = 10000;
    
    /**
     * @access private
     * @var int logout operation timeout in milliseconds
     */       
    
    var logOutTimeout = 10000;   
    
    /**
     * @access private
     * @var int user mail registration operation timeout in milliseconds
     */           
    
    var registerMailAccountTimeout = 60000
      
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
        var curPageName = obj.getCurPageName();
        
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
        if (obj.getCurPageURL() == mainPageURL || curPageName == 'mainPage') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Main page already opened...'); 
            
            this.setCurPageName('mainPage');
            def.resolve();
        } else {         
            // open main page
            curPage.open(mainPageURL, function(status) {
                if (status == 'success' && !def.isProcessed()) {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Main page successfuly opened...'); 
                    
                    obj.setCurPageName('mainPage');
                    def.resolve();
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open main page...'); 
                    def.reject(obj.createErrorObject(3, 'Main page cannot be opened'));
                }           
            });                                  
        }
                
        return def.promise();
    }    
    
    function openRegPage()
    {
        var curPage = obj.getPage();      
        var curPageName = obj.getCurPageName();
        
        var def = deferred.create();  
         
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening registration page takes too long...');
                def.reject(obj.createErrorObject(1, 'Registration page open timeout'));
            }
        }, openRegPageTimeout);      
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening registration page...'); 
        
        // check if the registration page is already open
        if (curPageName == 'regPage') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Registration page is already loaded...');
            def.resolve();
            return def.promise();
        }
        
        // check if we already logged in
        isLogedIn().done(function(){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Already loged in, trying to logout...'); 
            
            // trying to logout
            logOut().done(function(){                
                // open main page
                openMainPage().done(function(){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'success', 'Registration page successfully loaded...');
                    def.resolve();
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page...');
                    def.reject(error);
                });                               
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page...');     
                def.reject(error);
            });                        
        }).fail(function(error){
            if (typeof error == 'object' && (error.code == 3 || error.code == 1)) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page, error while checking login status...');               
                def.reject(error);
                
                return def.promise();
            }
                       
            // page change callback
            obj.pushPageLoadFunc(function(status){      
                if (status == 'success') {
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking registration page...');
                    obj.validatePageBySchema('yandex/schemas/sandbox/mail/validation/regform.js', 'yandex', 'regForm', 'plain-objects', ['sandbox/utils.js']).done(function(result){                          
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Registration page valid...');
                        obj.setCurPageName('regPage');
                        
                        def.resolve(result);      
                    }).fail(function(error){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Invalid registration page...');
                        def.reject(error);                             
                    });                                           
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while redirecting to registration page...');
                    def.reject(obj.createErrorObject(3, 'Error while redirecting to registration page'));
                }                                          
            });                       
                       
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Not logged in, trying to open registration page...');      
            
            // run dummy schema (click logout button)
            var schema = require('../schemas/dummy/mail/clickmakeemail').schema;

            obj.runDummySchema(schema).done(function(){                             
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking for additional overlay...');
                
                
                // if additional overlay is open - click the button
                schema = require('../schemas/dummy/mail/clickmakeemailoverlay').schema;
                obj.runDummySchema(schema).done(function(){ 
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Additional overlay found...');
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'No additional overlay found...');
                });
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema for "click make email"...');
                def.reject(obj.createErrorObject(4, error));
            });  
            
            obj.takeSnapshot('jpeg', 'test', '', 1024, 768, 5000);
            
        });    
        
        return def.promise();
    }
    
    /**
     * Method that starts checks whether current object logged in to mail.yandex or not.
     *
     * Current uses schema to parse main page and to find out evidence that the current object logged in to mail.yandex or not.
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
        
        var validate = function() {
            // parse toolbar
            result = obj.validatePageBySchema('yandex/schemas/sandbox/mail/validation/mailtoptoolbar.js', 'yandex', 'mailTopToolbar', 'plain-objects', ['sandbox/utils.js']).done(function(result){
                def.resolve(result);
            }).fail(function(error){
                def.reject(error);
            });              
        }

        // check if any page is open
        if (curURL == '' || curURL == 'about:blank') {
            openMainPage().done(function(){
                validate();                           
            }).fail(function(error){
                def.reject(error);
            });
        } else {
            validate();         
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
        obj.validatePageBySchema('yandex/schemas/sandbox/validation/mailtoptoolbar.js', 'yandex', 'mailTopToolbar', 'plain-objects', ['sandbox/utils.js']).done(function(result){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Top toolbar found, trying to log out...');
                      
            // page change callback
            obj.pushPageLoadFunc(function(status){                   
                if (status == 'success') {
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Checking if are logged out...');
                    
                    isLogedIn().done(function(){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'We still loged in...');
                        def.reject();
                    }).fail(function(error){
                        if (typeof error == 'object' && (error.code == 3 || error.code == 1)) {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot logout, error while checking login status...');               
                            def.reject(error);
                
                            return def.promise();
                        }
                       
                        obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'success', 'Not logged in, logout successful...');   
                        def.resolve();                       
                    });
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while redirecting after logout...');
                    def.reject(obj.createErrorObject(3, 'Error while redirecting after logout'));
                }                                   
            });   
            
            // run dummy schema (click logout button)
            var schema = require('../schemas/dummy/mail/clicklogout').schema;
            obj.runDummySchema(schema).done(function(){                             
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');   

            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema for "click logout"...');
                def.reject(obj.createErrorObject(4, error));
            });                                 
        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot find top toolbar...');
            def.reject(error);            
        });
        
        return def.promise();
    }    
    
    function registerMailAccount(usrAccout)
    {
        var def = deferred.create();  
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Mail account registration takes too long...');
                def.reject(obj.createErrorObject(1, 'Logout timeout'));
            }
        }, registerMailAccountTimeout);   
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting mail account registration process...'); 
        
        // open registration page
        openRegPage().done(function(){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Entering account data...');
       
            // enter account data
            var schema = require('../schemas/dummy/mail/enterregdata').schema;

            obj.runDummySchema(schema).done(function(){                             
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', '"dummy" schema successfully processed...');
                obj.takeSnapshot('jpeg', 'test', '', 1024, 768, 4000);
            }).fail(function(error){
                console.log(error);
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema (registration data)...');
                def.reject(obj.createErrorObject(4, error));
            });   
                       
        }).fail(function(error) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot register new mail account...');
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
    }  
    
    /**
     * Operation method that starts (or puts to the stack) operation 'openMainPage'.
     *
     * Method that starts operation that tries to open main page of the service.
     *
     * @access privileged
     *
     * @return object operation promise.
     */      
       
    this.openMainPage = function()
    {
        try {
            return obj.startOp(openMainPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openMainPage"...');
        }           
    }  
    
    this.openRegPage = function()
    {
        try {
            return obj.startOp(openRegPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openRegPage"...');
        }            
    }
    
    this.registerMailAccount = function(usrAccount)
    {
        try {
            return obj.startOp(registerMailAccount, usrAccount);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "registerMailAccount"...');
        }          
    }
    
    /* Privileged core methods ends here */
    
    this.configureService(configObj);
}

exports.constFunc = Mail;
exports.create = function create(configObj) {
    "use strict";
    Mail.prototype = service.create(configObj, 'yandex_mail');
    return new Mail(configObj, 'yandex_mail');
};   