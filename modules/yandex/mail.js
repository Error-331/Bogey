var Mail = function(configObj)
{ 
    service.constFunc.call(this, configObj, 'yandex_mail');
        
    /* Private core methods starts here */      
    
    function logOut()
    {
        var curPage = this.getPage();
        var def = deferred.create();
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isDone()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Logout takes too long...');
                def.reject();
            }
        }, logOutTimeout);           
        
        def.resolve();
        
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
                    
                    // reject if timeout
                    setTimeout(function(){
                        if (!def.isDone()) {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening registration page takes too long...');
                            def.reject();
                        }
                    }, openRegPageTimeout + mainPageMainLinkClickDelay);                       

                    curPage.evaluate(function(clickDelay) {
                        var evt = document.createEvent("MouseEvents");      

                        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        setTimeout(function(){
                            document.getElementsByClassName("b-big-button")[0].dispatchEvent(evt);
                        }, clickDelay);
                    }, mainPageMainLinkClickDelay);

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
    
    function extractRegPageCaptcha(path, name, ext)
    {    
        var curPage = this.getPage();
        var def = deferred.create();
        var res = '';
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Trying to extract captcha from registration page...');    
        obj.openRegPage().done(function(){        
            
            // reject if timeout
            setTimeout(function(){
                if (!def.isDone()) {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Extracting captcha image takes too long...');
                    def.reject();
                }
            }, extractRegPageCaptchaTimeout);             
            
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
                curPage.clipRect = {top: captchaCoords.top, left: captchaCoords.left, width: captchaCoords.width, height: captchaCoords.height};
                
                try {                            
                    res = obj.takeSnapshot(ext, name, path); 
                } catch(e) {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', e); 
                    def.reject();
                }               
        
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Captcha image successfully extracted: "' + res + '"'); 
                def.resolve(res);   
            } 
        }).fail(function(){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Cannot extract captcha from registration page...'); 
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
    
    this.configureService = function(configObj) {
        if (typeof configObj != 'object') {
            return;
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
    
    this.openRegPage = function()
    {
        try {
            return this.startOp(openRegPage);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "openRegPage"...');
        }          
    }
    
    this.extractRegPageCaptcha = function(path, name, ext)
    {
        try {
            return this.startOp(extractRegPageCaptcha, path, name, ext);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "extractRegPageCaptcha"...');
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