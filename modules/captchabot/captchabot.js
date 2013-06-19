// Modules include
var page = require('webpage');
var response = require('../io/response');
var deferred = require('../async/deferred');

var captchabot = function(usrSystemKey)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;
    
    var rpcURL = 'http://captchabot.com/rpc/xml.php';

    var moduleName = 'captchabot';

    var curPage = page.create();
     
    var systemKey = '';
    
    /**
     * @access private
     * @var string previous status of the page, can take following values: success, fail, unknown
     */      
    
    var prevPageStatus = 'unknown'
    
    /* Private members starts here */
    
    /* Private event handlers starts here */
    
    function onMainPageJump(status, def)
    {
        if (status == 'success') {
            var resp = response.create(moduleName, curPageURL, 'starting', status, 'unknown', 'Main page opened successfully...');
            console.log(JSON.stringify(resp));   
                        
            def.resolve();
        } else {
            var resp = response.create(moduleName, curPageURL, 'finishing', status, 'unknown', 'Fail to open main page...');
            console.log(JSON.stringify(resp));     
            
            def.reject();
        }
    }
    
    /* Private event handles ends here */
    
    /* Private (phantomJS) event handlers starts here */
    /* Private (phantomJS) event handlers ends here */
    
    /* Privileged core methods starts here */
        
    this.checkBalance = function() {    
        var def = new deferred.create();
        
        var data = '<methodCall>\
                    <methodName>ocr_server::balance</methodName>\
                    <params>\
                    <param><string>system_key</string></param>\
                    <param><string>'+systemKey+'</string></param>\
                    </params>\
                    </methodCall>';
        
        var resp = response.create(moduleName, rpcURL, 'starting', 'unknown', 'unknown', 'Checking balance status...');
        console.log(JSON.stringify(resp));  
                
        curPage.open(rpcURL, 'post', data, function (status) {
            if (status == 'success') {
                resp = response.create(moduleName, rpcURL, 'processing', status, 'success', 'Parsing balance response...');
                console.log(JSON.stringify(resp));  
                               
                var evalResult = curPage.evaluate(function(){
                    var params = document.getElementsByTagName('param');
                            
                    if (params.length == 1) {                              
                        var intVal = document.getElementsByTagName('int');
                                 
                        if (intVal.length != 0) {
                            intVal =  parseInt(intVal.item(0).textContent);
                                    
                            if (intVal == 401) {
                                return {'is_error': true, desc: "Server error: " + intVal};
                            } else if (intVal == 402) {
                                return {'is_error': true, desc: "Not enough cash: " + intVal};
                            } else {
                                return {'is_error': true, desc: "Unknown error: " + intVal};
                            }
                        } else {
                                        
                        }
                                
                    } else {
                                
                    }
                });

                if (evalResult.is_error == true) {
                    console.log(evalResult.value);
                }

                def.resolve(curPage.content);     
            } else {
                resp = response.create(moduleName, rpcURL, 'finishing', status, 'fail', 'Cannot check balance...');
                console.log(JSON.stringify(resp));                
                               
                def.reject();
            }        
        });
        
        return def;
    };
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    this.setSystemKey = function(usrSystemKey)
    {
        if (typeof systemKey != 'string') {
            throw 'System key is not a string'
        }
        
        systemKey = usrSystemKey;
    }
    
    /* Privileged set methods ends here */  
    
    this.setSystemKey(usrSystemKey);
}

/* Public members starts here */
/* Public members ends here */

exports.create = function create(systemKey) {
    "use strict";
    
    return new captchabot(systemKey);
};