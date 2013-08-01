// Modules include
var service = require('../../core/service');
var deferred = require('../../async/deferred');
var sandboxutils = require('../../utils/sandboxutils');

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
    
    var logInTimeout = 6000;
    var logOutTimeout = 6000;
    var openMainPageTimeout = 3000; 
    
    /* Private members ends here */
      
    /* Private core methods starts here */  
    
    function openMainPage()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isDone()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening main page takes too long...');
                def.reject();
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
                    def.reject();
                }           
            });                                  
        }
                
        return def;
    }    
    
    
    function logOut()
    {
        var curPage = obj.getPage();
        var def = deferred.create();  
        
        def.resolve();
        
        return def;
    }
    
    function logIn()
    {
        var curPage = obj.getPage();
        var def = deferred.create();
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening login page...');    
        obj.logOut().done(function() {                               

            // open main page
            obj.openMainPage().done(function(){
                
                // reject if timeout
                setTimeout(function(){
                    if (!def.isDone()) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Login takes too long...');
                        def.reject();
                    }
                }, logInTimeout); 
                                              
                // check login page and do the actual login
                var result = curPage.evaluate(function(trimFunc, findOffsetFunc, showMarkFunc) {
                    // check loginPanel
                    var offset = new Array();
                    var logPanelElm = document.getElementById('loginPanel');
                    
                    if (logPanelElm === null) {
                        return false;
                    }
                    
                    // check h2
                    var h2 = logPanelElm.getElementsByTagName('h2');
                    
                    if (h2.length <= 0) {
                        return false;
                    }
                    
                    try {
                        h2 = trimFunc(h2[0].innerHTML);
                        if (h2 != 'Log in') {
                            return false;
                        }
                    } catch(e) {
                        return false;
                    }
                    
                    // check email input
                    var inpt = logPanelElm.querySelector('#field_email');
                    
                    if (inpt === null) {
                        return false;
                    }
                    
                    offset.push(findOffsetFunc(inpt));
                    
                    // check password input
                    inpt = logPanelElm.querySelector('#field_password');
                    
                    if (inpt === null) {
                        return false;
                    }
                    
                    offset.push(findOffsetFunc(inpt));
                    document.onclick=function(){showMarkFunc(offset[1].top + 20 + 'px', offset[1].left + 20 + 'px');};
                  
                    // check submit input
                    inpt = logPanelElm.querySelector('#hook_FormButton_button_go');
                    
                    if (inpt === null) {
                        return false;
                    }
                    
                    offset.push(findOffsetFunc(inpt));                    
                    
                    return JSON.stringify(offset);
                }, sandboxutils.trim, sandboxutils.findOffset, sandboxutils.showMark);
                
                if (result !== false) {
                    result = JSON.parse(result);
                    
                    //curPage.sendEvent('mousepress', result[0].top + 10, result[0].left + 10, 'left');
                    //curPage.sendEvent('keypress', 'a', null, null);
                    
                    curPage.settings.javascriptEnabled = true;
                    curPage.settings.loadImages = true;
                    curPage.clipRect = { top: 0, left: 0, width: 1024, height: 1024 };
                    curPage.viewportSize = { width: 1024, height: 1024 };

                    
                    
                    curPage.sendEvent('click', result[1].top + 10, result[1].top + 10, 'left');
                    curPage.sendEvent('keypress', 'c', null, null);                    
               
                    obj.takeSnapshot('jpeg', 'test', '/', 1024, 768); 
                    
   
                    
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Invalid login page...'); 
                    def.reject();                       
                }                             
            }).fail(function(){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open login page...'); 
                def.reject();                
            });   
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open login page...'); 
            def.reject();
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
    
    Base.prototype = service.create(configObj, 'odnoklassniki_base');
    return new Base(configObj, 'odnoklassniki_base');
};