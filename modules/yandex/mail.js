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
    
    function logOut()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        def.resolve();
        
        return def;
    }
    
    function openMainPage()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening main page...'); 
        curPage.open(mainPageURL, function(status) {
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Main page successfuly opened...'); 
                def.resolve();
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open main page...'); 
                def.reject();
            }           
        });
        
        return def;
    }
    
    function openRegPage()
    {
        var curPage = obj.getPage();
        var def = deferred.create();
                    
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening registration page...');          
        obj.logOut().done(function() {
            if (obj.getCurPageURL() != mainPageURL) {
                obj.openMainPage().done(function(){

                    curPage.evaluate(function() {
                        var evt = document.createEvent("MouseEvents");      

                        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        setTimeout(function(){
                            document.getElementsByClassName("b-big-button")[0].dispatchEvent(evt);
                        }, 3000);
                    });

                    obj.pushPageLoadFunc(function(status){
                        obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Click a "registration" link on main page...');  

                        if (obj.getCurPageURL().indexOf("https://passport.yandex.ru/passport?mode=simplereg") == 0 && status == 'success') {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Registration page successfuly opened...'); 
                            def.resolve();
                        }  else {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open registration page...'); 
                            def.reject();
                        }                    
                    });
                
                }).fail(function(){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page...'); 
                    def.reject();
                });
            }         
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot open registration page...'); 
            def.reject();
        });
         
        return def;
    }
    
    function extractRegPageCaptcha(savePath, fileName)
    {    
        var curPage = this.getPage();
        var def = deferred.create();
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Trying to extract captcha from registration page...');    
        obj.openRegPage().done(function(){        
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Extracting captcha image position...');    
            
            // getting coordinates of the image (captcha)
            var captchaCoords = curPage.evaluate(function (findOffset) {                               
                var img = document.getElementById("captcha-img");  
                if (img === null) {
                    return false;
                } else {
                    return findOffset(img);
                }
            }, sandboxutils.findOffset);

            if (typeof captchaCoords != 'object') {             
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot extract captcha image position...'); 
                def.reject();
            } else {                
                // saving captcha
                if (savePath === undefined) {
                    savePath = '';
                }

                if (typeof savePath != 'string') {
                    throw 'Invalid "savePath"';
                }
        
                if (typeof fileName != 'string' || fileName.length == 0) {
                    throw 'Invalid "savePath"';
                }
                
                curPage.clipRect = {top: captchaCoords.top, left: captchaCoords.left, width: captchaCoords.width, height: captchaCoords.height};
                curPage.render(savePath + fileName + ".png");
        
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Captcha image successfully extracted...'); 
                def.resolve();   
            } 
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot extract captcha from registration page...'); 
            def.reject();
        });
        
        
        return def;    
    }
    
    /* Private core methods ends here */
    
    /* Privileged core methods starts here */
    
    this.logOut = function()
    {
        return this.startOp(logOut);
    }    
    
    this.openMainPage = function()
    {
        return this.startOp(openMainPage);
    }    
    
    this.openRegPage = function()
    {
        return this.startOp(openRegPage);
    }
    
    this.extractRegPageCaptcha = function(savePath, fileName)
    {
        return this.startOp(extractRegPageCaptcha, savePath, fileName);
    }
    
    /* Privileged core methods ends here */
}

exports.constFunc = Mail;
exports.create = function create(systemKey) {
    "use strict";
    
    Mail.prototype = service.create(systemKey, 'yandex_mail');
    return new Mail(systemKey, 'yandex_mail');
};