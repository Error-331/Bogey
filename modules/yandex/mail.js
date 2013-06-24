// Modules include
var service = require('../core/service');
var deferred = require('../async/deferred');
var sandboxutils = require('../utils/sandboxutils');

var Mail = function(usrSystemKey)
{
    service.constFunc.call(this, usrSystemKey, 'yandex_mail');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;    
    
    var mainPageURL = 'http://mail.yandex.ru/';
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    function openMainPage()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        obj.logProcess(mainPageURL, 'starting', 'unknown', 'unknown', 'Opening main page...'); 
        curPage.open(mainPageURL, function(status) {
            if (status == 'success') {
                obj.logProcess(mainPageURL, 'finishing', status, 'success', 'Main page successfuly opened...'); 
                def.resolve();
            } else {
                obj.logProcess(mainPageURL, 'finishing', status, 'fail', 'Cannot open main page...'); 
                def.reject();
            }           
        });
        
        return def;
    }
    
    function openRegPage()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        obj.logProcess('', 'starting', 'unknown', 'unknown', 'Opening registration page...'); 
        if (obj.getCurPageURL() != mainPageURL) {
            obj.openMainPage().done(function(){

               curPage.evaluate(function() {
                    var evt = document.createEvent("MouseEvents");      

                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    setTimeout(function(){
                        document.getElementsByClassName("b-big-button")[0].dispatchEvent(evt);

                    }, 4000);

                });

                obj.pushURLChangeFunc(function(){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Click a "registration" link on main page...');  
                    
                    if (obj.getCurPageURL().indexOf("https://passport.yandex.ru/passport?mode=simplereg") == 0) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Registration page successfuly opened...'); 
                        def.resolve();
                    }  else {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page...'); 
                        def.reject();
                    }                    
                });
                
            }).fail(function(){
                obj.logProcess('', 'finishing', 'fail', 'fail', 'Cannot open registration page...'); 
                def.reject();
            });
        }
          
        return def;
    }
    
    /* Private core methods ends here */
    
    /* Privileged core methods starts here */
    
    this.openMainPage = function()
    {
        return this.startOp(openMainPage);
    }    
    
    this.openRegPage = function()
    {
        return this.startOp(openRegPage);
    }
    
    /* Privileged core methods ends here */
}

exports.constFunc = Mail;
exports.create = function create(systemKey) {
    "use strict";
    
    Mail.prototype = service.create(systemKey, 'yandex_mail');
    return new Mail(systemKey, 'yandex_mail');
};