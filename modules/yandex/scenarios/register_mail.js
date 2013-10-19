// Modules include
var scenario = require('../../core/scenario');
var deferred = require('../../async/deferred');

var yandexMail = require('../services/mail');
var antigate = require('../../antigate/services/antigate');

var fileUtils = require('../../utils/fileutils');

var RegisterMail = function()
{ 
    //scenario.constFunc.call(this, 'register_mail');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    var curYandexMail;
    
    var curAntigate;
                
    /* Private members ends here */
    
    /* Private core methods starts here */        
    /* Private core methods ends here */
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */    
    /* Private set methods ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Method that starts current scenario.
     *
     * Method extracts arguments from the command line and uses them to check proxy server.
     *
     * @access privileged
     * 
     */      
    
    this.start = function() 
    {      
        var options = obj.getOptions();
        var yanSnapDir;
        
        if (options.optionIndex != undefined) {
            options.optionIndex = parseInt(options.optionIndex);
        }
        
        options.scenario = obj;
        
        options.ping = parseInt(options.ping);
        options.logsnapdir = 'snapshots' + fileUtils.getDirSeparator() + Date.now();
        
        curAntigate = antigate.create(options);
        curYandexMail = yandexMail.create(options);
         
        yanSnapDir = curYandexMail.getLogSnapDir();
         
        curYandexMail.registerMailAccount(options).done(function(data){           
            curYandexMail.takeSnapshot('jpeg', 'scenario_resolve', yanSnapDir, 1024, 768).always(function(){
                data.snapDir = yanSnapDir;
                
                obj.sendResponse(data);
                obj.stop();
            });
        }).fail(function(err){          
            curYandexMail.takeSnapshot('jpeg', 'scenario_reject', yanSnapDir, 1024, 768).always(function(){
                err.snapDir = yanSnapDir;
                
                obj.sendErrorResponse(err);
                obj.stop();
            });
        });
    }  
    
    /**
     * Method that stops current scenario.
     *
     * Method sends response based on the information stored in the current object and calls phantom.exit().
     *
     * @access privileged
     * 
     */    
    
    this.stop = function() 
    {
        phantom.exit();
    }      
        
    /* Privileged core methods ends here */
    
    /* Priveleged event handlers starts here */
    
    this.onParseCaptchaByPath = function(path)
    {
        var def = deferred.create();
        
        curAntigate.uploadImage(path).done(function(id){
            curAntigate.checkCaptchaStatus(id).done(function(captcha){
               def.resolve(captcha);
            }).fail(function(err){
                def.reject(err);
            });
        }).fail(function(err){
            def.reject(err);
        });
        
        return def.promise();
    }
    
    /* Privileged event handlers ends here */
      
    /* Privileged get methods starts here */      
    /* Privileged get methods ends here */
};

exports.create = function create() {
    "use strict";
    
    RegisterMail.prototype = scenario.create('register_mail');
    return new RegisterMail('register_mail');
};  