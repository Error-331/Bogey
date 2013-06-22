// Modules include
var deferred = require('../async/deferred');
var service = require('../core/service');

var Captchabot = function(usrSystemKey)
{
    service.constFunc.call(this, usrSystemKey, 'captchabot');

    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;
    
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
                
        curPage.open(rpcURL, 'post', data, function (status) {
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
    /* Privileged get methods ends here */
}

/* Public members starts here */
/* Public members ends here */

exports.create = function create(systemKey) {
    "use strict";
    
    Captchabot.prototype = service.create(systemKey, 'captchabot');
    return new Captchabot(systemKey, 'captchabot');
};