// Modules include
var deferred = require('../async/deferred');
var service = require('../core/service');
var fileutils = require('../utils/fileutils');

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
    var uploadFormPath = '../modules/antigate/html/antigate_upload_form.html';
    
    var uploadImageOpDelay = 3000;
    
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
                obj.logProcess(obj.getCurPageURL(), 'processing', status, 'success', 'Parsing balance response...');
                               
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
        
        var response = '';
        var id = '';
        var re = /^OK\|[0-9]+/;
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting captcha uploading process...');
        
        try {
            fileutils.isValidImage(imagePath);
            fileutils.isReadable(uploadFormPath);
        } catch(e) {
            console.log(e);
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', e);
            def.reject();
            return def;
        }
        
        obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Opening local form file...');
        
        curPage.open(uploadFormPath, function(status) {
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Succesfully open local form file...');
                
                // page preparation and submit
                curPage.uploadFile('input[name=file]', imagePath);
                curPage.evaluate(function(key) {
                    var evt = document.createEvent("MouseEvents"); 
                    
                    document.getElementsByName('key')[0].value = key;
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById('submitBtn').dispatchEvent(evt);                   
                }, obj.getSystemKey());

                // delay
                setTimeout(function(){
                    if (!def.isDone()) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Uploading takes too long...');
                        def.reject();
                    }
                },uploadImageOpDelay)

                // on new page load
                obj.pushPageLoadFunc(function(status){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Click a "submit" button...'); 
                    if (obj.getCurPageURL().indexOf(uploadURL) == 0 && status == 'success') {
                        obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Checking response...');
                        
                        response = curPage.evaluate(function(){
                            return document.body.innerText;
                        });
                        
                        if (re.test(response)) {
                            id = response.substr(response.indexOf('|') + 1);
                            response = response.substr(response.indexOf('|') + 1);
                            
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Response: "' + response + '"');
                            def.resolve(id);                            
                        } else {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Response: "' + response + '"');
                            def.reject();
                        } 
                    } else {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Upload fail...');
                        def.reject();
                    }
                });                
                
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open local form file...');
                def.reject();
                return def;
            }           
        });        
        
        return def;
    }
    
    /* Private core methods ends here */
    
    /* Privileged core methods starts here */
    
    this.checkBalance = function() 
    { 
        try {        
            return this.startOp(checkBalance);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "checkBalance"...');
        }
    };
    
    this.uploadImage = function(imagePath)
    {
        try {
            return this.startOp(uploadImage, imagePath);  
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "uploadImage"...');
        }
    }
    
    /* Privileged core methods ends here */
}

exports.create = function create(systemKey) {
    "use strict";
    
    Antigate.prototype = service.create(systemKey, 'antigate');
    return new Antigate(systemKey, 'antigate');
};