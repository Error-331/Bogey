// Modules include
var deferred = require('../async/deferred');
var service = require('../core/service');

var Antigate = function(usrSystemKey)
{
    service.constFunc.call(this, usrSystemKey, 'antigate');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;
    
    var restURL = 'http://antigate.com/res.php';
    var uploadURL = 'http://antigate.com/in.php';
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    function checkBalance()
    {
        var def = new deferred.create();
        var curPage = this.getPage();
        var url = restURL + '?key=' + this.getSystemKey() + '&action=getbalance';
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Checking balance status...'); 

        curPage.open(url, function(status) {
            if (status == 'success') {
                obj.logProcess(url, 'processing', status, 'success', 'Parsing balance response...');
                               
                var evalResult = curPage.evaluate(function(){   
                    if (document.body.innerText.length < 0) {
                        return {'is_error': true, desc: "Response is empty"}; 
                    }
                    
                    var re = /^[0-9]+\.[0-9]+/;
                    
                    if (re.test(document.body.innerText)) {
                        return parseFloat(document.body.innerText);
                    } else {
                        return {'is_error': true, desc: "Incorrect response"};
                    }                  
                });

                if (evalResult.is_error == true) {
                    obj.logProcess(url, 'finishing', status, 'fail', evalResult.desc);                                                  
                    def.reject(evalResult); 
                } else {
                    obj.logProcess(url, 'finishing', status, 'success', 'Balance check successful...');                                      
                    def.resolve(evalResult); 
                }
         
            } else {
                this.logProcess(url, 'finishing', status, 'fail', 'Cannot check balance...');                                           
                def.reject();
            }        
        });
        
        
        return def;          
    }
    
    function uploadImage(imagePath) 
    {
        var def = new deferred.create();
        var curPage = this.getPage();
        
        if (typeof imagePath != 'string' || imagePath.length < 0) {
            throw 'Invalid "imagePath"';
        }
        
        return def;
    }
    
    /* Private core methods ends here */
    
    /* Privileged core methods starts here */
    
    this.checkBalance = function() 
    { 
        return this.startOp(checkBalance);
    };
    
    this.uploadImage = function(imagePath)
    {
        return this.startOp(uploadImage, imagePath);
    }
    
    /* Privileged core methods ends here */
}

exports.create = function create(systemKey) {
    "use strict";
    
    Antigate.prototype = service.create(systemKey, 'antigate');
    return new Antigate(systemKey, 'antigate');
};