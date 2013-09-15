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
 * Module captchabot is a part of PhantomJS framework - Bogey.
 *
 * @package Bogey
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Modules for Captchabot service (http://captchabot.com/).
 *
 * @subpackage captchabot
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Captchabot class.
 *
 * Following code represents a wrapper class for Captchabot service.
 *
 * @subpackage Captchabot
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

// Modules include
var deferred = require('../async/deferred');
var service = require('../core/service');

var Captchabot = function(configObj)
{
    service.constFunc.call(this, configObj, 'captchabot');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;
    
    /**
     * @access private
     * @var string API key
     */        
    
    var systemKey = '';    
    
    var rpcURL = 'http://captchabot.com/rpc/xml.php';
           
    /* Private members starts here */
    
    /* Private core methods starts here */
              
    function checkIfResponseError(opName)
    {
        var params = document.getElementsByTagName('param');
        var name = document.getElementsByTagName('name');
        
        if (params.length == 1 && name.length == 0) {                              
            var intVal = document.getElementsByTagName('int');
                                 
            if (intVal.length != 0) {
                intVal =  parseInt(intVal.item(0).textContent);
                                    
                if (intVal == 402) {
                    return {'is_error': true, desc: "Server error: " + intVal};
                } else if (intVal == 401) {
                    return {'is_error': true, desc: "Not enough cash: " + intVal};
                } else {
                    return {'is_error': true, desc: "Unknown error: " + intVal};
                }
            } else {
                return {'is_error': true, desc: "Unknown error"};          
            }                              
        } else {
            if (typeof opName != 'string' || opName.length < 0) {
                return {'is_error': true, desc: "Invalid operation name"}; 
            }
        
            var name = document.getElementsByTagName('name');
            opName = opName.toLowerCase();
        
            if (name.length == 0) {
                return {'is_error': true, desc: "Invalid operation name"}; 
            }
        
            name = name.item(0).textContent.toLowerCase();      
            if (opName != name) {
                return {'is_error': true, desc: "Invalid operation name"}; 
            }
        
            return {'is_error': false, desc: ""};          
        }        
    }
    
    /* Private core methods ends here */
    
    /* Private event handlers starts here */    
    /* Private event handles ends here */
    
    /* Private (phantomJS) event handlers starts here */
    /* Private (phantomJS) event handlers ends here */
        
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
        
        obj.setSystemKey(configObj.systemKey);
    }  

    this.checkBalance = function() {    
        var def = new deferred.create();
        var curPage = this.getPage();

        var data = '<methodCall>\
                    <methodName>ocr_server::balance</methodName>\
                    <params>\
                    <param><string>system_key</string></param>\
                    <param><string>'+this.getSystemKey()+'</string></param>\
                    </params>\
                    </methodCall>';
        
        this.logProcess(rpcURL, 'starting', 'unknown', 'unknown', 'Checking balance status...'); 
                
        curPage.open(rpcURL, 'post', data, function(status) {
            if (status == 'success') {
                obj.logProcess(rpcURL, 'processing', status, 'success', 'Parsing balance response...');
                               
                var evalResult = curPage.evaluate(function(checkIfResponseError){                                 
                    var result =  checkIfResponseError('balance');
                    if (result.is_error == true) {
                        return result;
                    } else {
                        var double = document.getElementsByTagName('double');
                        
                        if (double.length == 0) {
                            return {'is_error': true, desc: "'Double' parameter is not present"}; 
                        }
                        
                        return double.item(0).textContent;
                    }
                }, checkIfResponseError);

                if (evalResult.is_error == true) {
                    obj.logProcess(rpcURL, 'finishing', status, 'fail', evalResult.desc);                                                  
                    def.reject(evalResult); 
                } else {
                    obj.logProcess(rpcURL, 'finishing', status, 'success', 'Balance check successful...');                                      
                    def.resolve(evalResult); 
                }

                    
            } else {
                this.logProcess(rpcURL, 'finishing', status, 'fail', 'Cannot check balance...');                                           
                def.reject();
            }        
        });
        
        return def;
    };
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current API key.
     *
     * Simple method that returns current API key.
     *
     * @access privileged
     * 
     * @return string API key.
     * 
     */      
    
    this.getSystemKey = function()
    {
        return systemKey;
    }    
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    /**
     * Method that sets current API key.
     *
     * Simple method that sets current API key.
     *
     * @access privileged
     * 
     * @param string usrSystemKey current API key
     * 
     * @throws string 
     * 
     */     
    
    this.setSystemKey = function(usrSystemKey)
    {
        if (typeof usrSystemKey != 'string') {
            throw 'System key is not a string'
        }
        
        systemKey = usrSystemKey;
    }
      
    /* Privileged set methods ends here */
    
    this.configureService(configObj);
}

/* Public members starts here */
/* Public members ends here */

exports.create = function create(configObj) {
    "use strict";
    
    Captchabot.prototype = service.create(configObj, 'captchabot');
    return new Captchabot(configObj, 'captchabot');
};