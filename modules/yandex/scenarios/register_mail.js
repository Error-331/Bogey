// Modules include
var scenario = require('../../core/scenario');

var yandexMail = require('../services/mail');
var antigate = require('../../antigate/services/antigate');

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
        
        if (options.optionIndex != undefined) {
            options.optionIndex = parseInt(options.optionIndex);
        }
        
        options.scenario = obj;
        
        curYandexMail = yandexMail.create(options);
        curYandexMail.registerMailAccount(options);
        


        options['isRussian'] = 0;
        options['maxBid'] = 0;
        options['softId'] = '';
        options['headerAcao'] = 0;
        
        curAntigate = antigate.create(options);
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

    }      
        
    /* Privileged core methods ends here */
    
    /* Priveleged event handlers starts here */
    
    this.onParseCaptchaByPath = function(path)
    {
        curAntigate.uploadImage(path).done(function(id){
            curAntigate.checkCaptchaStatus(id).done(function(captcha){
                console.log('Captcha is:' + captcha);
                phantom.exit();
            }).fail(function(){
                phantom.exit();
            });
        }).fail(function(){
            phantom.exit();
        });
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