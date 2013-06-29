// Modules include
var deferred = require('../async/deferred');
var service = require('../core/service');
var fileutils = require('../utils/fileutils');

var Antigate = function(configObj)
{ 
    service.constFunc.call(this, configObj, 'antigate');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;
        
    /**
     * @access private
     * @var string URL to which common requests will be made
     */      

    var restURL = 'http://antigate.com/res.php';
    
    /**
     * @access private
     * @var string URL to which captcha image will be uploaded
     */      
    
    var uploadURL = 'http://antigate.com/in.php';
    
    /**
     * @access private
     * @var string path to the HTML file with captcha-image upload form
     */      
    
    var uploadFormPath = '../modules/antigate/html/antigate_upload_form.html';
    
    /**
     * @access private
     * @var integer timeout in milliseconds after which captcha upload process will be canceled
     */          
    
    var uploadImageOpTimeout = 5000;
    
    /**
     * @access private
     * @var integer timeout in milliseconds after which balanc checking operation will be canceled
     */       
    
    var checkBalanceTimeout = 2000;
    
    /**
     * @access private
     * @var integer timeout in milliseconds after which captcha checking operation will be canceled
     */       
    
    var checkCaptchaTimeout = 2000;
    
    /**
     * @access private
     * @var integer number of tries after which captcha checking operation will be canceled
     */       
    
    var checkCaptchaTries = 8;
    
    /**
     * @access private
     * @var integer delay in milliseconds before each captcha check try 
     */     
    
    var checkCaptchaDelay = 7000;
    
    /**
     * @access private
     * @var string API key
     */        
    
    var systemKey = '';      
    
    /**
     * @access private
     * @var integer indicates whether captcha consist of one word or multiple
     */     
    
    var phraseParam = 0;
    
    /**
     * @access private
     * @var integer indicates whether captcha is case sensitive or not
     */     
    
    var regsenseParam = 0;
    
    /**
     * @access private
     * @var integer indicates whether captcha consist entirely of numbers or not
     */      
    
    var numericParam = 0;
    
    /**
     * @access private
     * @var integer indicates whether captcha presume mathematical operation or not
     */        
    
    var calcParam = 0;
    
    /**
     * @access private
     * @var integer minimum captcha text length
     */      
    
    var minLenParam = 0;
    
    /**
     * @access private
     * @var integer maximum captcha text length
     */       
  
    var maxLenParam = 0;
    
    /**
     * @access private
     * @var integer indicates whether captcha contains only russian letters or not
     */       
    
    var isRussianParam = 0;
    
    /**
     * @access private
     * @var integer bid value
     */     
    
    var maxBidParam = 0;
    
    /**
     * @access private
     * @var string software id
     */     
    
    var softIdParam = '';
    
    /**
     * @access private
     * @var integer indicates whether antigate service will send 'Access-Control-Allow-Origin: *' header in response to most requests
     */     
    
    var headerAcaoParam = 0;
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    /**
     * Method that implements 'checkBalance' operation.
     *
     * Method makes request to the antigate service for balance status. API key must be set prior to executing this method.
     *
     * @access private
     *
     * @return object deferred object
     *
     */      
        
    function checkBalance()
    {        
        var def = new deferred.create();
        var curPage = this.getPage();
        var url = restURL + '?key=' + this.getSystemKey() + '&action=getbalance';
        
        var re = /^[0-9]+\.[0-9]+/;
                
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Checking balance status...'); 
        
        // API key check
        if (this.getSystemKey().length <= 0) {
            this.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot check balance - API key is not set...');   
            
            def.reject();
            return def;
        }            
        
        // reject if timeout
        setTimeout(function(){
            if (!def.isDone()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Balance check takes too long...');
                def.reject();
            }
        }, checkBalanceTimeout);        

        curPage.open(url, function(status) {
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'processing', status, 'success', 'Parsing balance response...');
                               
                var evalResult = curPage.evaluate(function(){ 
                    return document.body.innerText;            
                });

                if (re.test(document.body.innerText)) {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Balance check successful...');                                      
                    def.resolve(evalResult); 
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Response: "' + evalResult + '"');                                                  
                    def.reject(evalResult); 
                }
         
            } else {
                this.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot check balance...');                                           
                def.reject();
            }        
        });
        
        
        return def;          
    }
    
    /**
     * Method that implements 'checkCaptchaStatus' operation.
     *
     * Method makes request to the antigate service for captcha status. API key must be set prior to executing this method.
     *
     * @access private
     * 
     * @param string id of the captcha that must be checked
     *
     * @return object deferred object
     *
     */     
    
    function checkCaptchaStatus(id)
    {        
        var def = new deferred.create();
        var curPage = this.getPage();
        var url = restURL + '?key=' + this.getSystemKey() + '&action=get&id=' + id;        
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting captcha check process...');
        
        // API key check
        if (this.getSystemKey().length <= 0) {
            this.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot get captcha result - API key is not set...');   
            
            def.reject();
            return def;
        }            
        
        // check id
        if (typeof id != 'string' || id.length <= 0) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Captcha id is not valid...');
            def.reject();
            return def;
        }
        
        // trying to check captcha result
        var tries = 0;     
        var response = 0;
        
        var re = /^OK\|/;
        
        var checkFunc = function(){                           
            tries += 1;
            obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Captcha check try - ' + tries);
            
            // send request to antigate
            curPage.open(url, function(status) {
                if (status == 'success'){
                    obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Received response from Antigate...');
                    
                    // parsing response
                    response = curPage.evaluate(function(){
                        return document.body.innerText;
                    });
                                        
                    if (re.test(response)) {            
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Captcha successfully parsed...');
                        def.resolve(response.substr(response.indexOf('|') + 1));
                        return;                       
                    } else if (response.indexOf('CAPCHA_NOT_READY') != -1) {
                        obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Captcha is not parsed yet...');
                    } else if (response.indexOf('ERROR_KEY_DOES_NOT_EXIST') != -1) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Captcha key ('+ id +') does not exist...');
                        def.reject('ERROR_KEY_DOES_NOT_EXIST');
                        return;                        
                    } else if (response.indexOf('ERROR_NO_SUCH_CAPCHA_ID') != -1) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Captcha key ('+ id +') does not exist...');
                        def.reject('ERROR_NO_SUCH_CAPCHA_ID'); 
                        return;                        
                    } else if (response.indexOf('ERROR_WRONG_ID_FORMAT') != -1) {  
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Captcha key ('+ id +') has wrong format...');
                        def.reject('ERROR_WRONG_ID_FORMAT');
                        return; 
                    } else if (response.indexOf('ERROR_CAPTCHA_UNSOLVABLE') != -1) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Captcha is unsolvable...');
                        def.reject('ERROR_CAPTCHA_UNSOLVABLE'); 
                        return;                                               
                    } else {
                        obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Unidentified error...');
                    }   
                    
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Cannot receive response from Antigate...');
                } 
                
                // cannot get captcha result, exceeded number of tries
                if (tries >= checkCaptchaTries) {           
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot get captcha result, exceeded number of tries...');
                    def.reject();    
                    return;
                } 
                
                // initiate check after delay
                setTimeout(checkFunc, checkCaptchaDelay);   
            });         
        }        
        
        checkFunc();             
        return def;
    }
    
    /**
     * Method that implements 'uploadImage' operation.
     *
     * Method uploads captcha image to the antigate service. API key must be set prior to executing this method.
     *
     * @access private
     * 
     * @param string imagePath path to the captcha image
     *
     * @return object deferred object
     *
     */       
     
    function uploadImage(imagePath) 
    {
        var def = new deferred.create();
        var curPage = this.getPage();
        
        var response = '';
        var id = '';
        var re = /^OK\|[0-9]+/;
        
        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting captcha uploading process...');
        
        // API key check
        if (this.getSystemKey().length <= 0) {
            this.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot upload captcha - API key is not set...');   
            
            def.reject();
            return def;
        }            
        
        // check image path
        try {
            fileutils.isValidImage(imagePath);
            fileutils.isReadable(uploadFormPath);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', e);
            def.reject();
            return def;
        }
        
        obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', 'Opening local form file...');
        
        curPage.open(uploadFormPath, function(status) {
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Succesfully open local form file...');
                
                // set image to upload
                curPage.uploadFile('input[name=file]', imagePath);
                
                // page evalute
                curPage.evaluate(function(systemKey, phraseParam, regsenseParam, numericParam, calcParam, minLenParam, maxLenParam, isRussianParam, maxBidParam, softIdParam, headerAcaoParam) {
                    var evt = document.createEvent("MouseEvents"); 
                    
                    var inpts = document.getElementsByTagName('input');
                    var form = document.getElementById('mainForm');
                    
                    var elm = null;
                    var i = 0;
                    
                    // set values
                    for (i = 0; i < inpts.length; i++) {
                        switch(inpts[i].name) {
                            case 'key':
                                inpts[i].value = systemKey;
                                break;
                            case 'phrase':
                                inpts[i].value = phraseParam;
                                break;                          
                            case 'regsense':
                                inpts[i].value = regsenseParam;
                                break;
                            case 'numeric':
                                inpts[i].value = numericParam;
                                break;
                            case 'calc':
                                inpts[i].value = calcParam;
                                break;
                            case 'min_len':
                                inpts[i].value = minLenParam;
                                break;
                            case 'max_len':
                                inpts[i].value = maxLenParam;
                                break;
                            case 'is_russian':
                                inpts[i].value = isRussianParam;
                                break;   
                            case 'header_acao':
                                inpts[i].value = headerAcaoParam;
                                break;                                  
                        }

                    }
                    
                    // create elements
                    if (maxBidParam != 0) {
                        elm = document.createElement("input");
                        elm.name = 'max_bid';
                        elm.type = 'hidden';
                        elm.value = maxBidParam;
                        
                        form.appendChild(elm);
                    }    
                    
                    if (softIdParam != '') {
                        elm = document.createElement("input");
                        elm.name = 'soft_id';
                        elm.type = 'hidden';
                        elm.value = softIdParam;
                        
                        form.appendChild(elm);
                    }                      
                                                            
                    // send form
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById('submitBtn').dispatchEvent(evt);                   
                }, systemKey, phraseParam, regsenseParam, numericParam, calcParam, minLenParam, maxLenParam, isRussianParam, maxBidParam, softIdParam, headerAcaoParam);
                
                // reject if timeout
                setTimeout(function(){
                    if (!def.isDone()) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Uploading takes too long...');
                        def.reject();
                    }
                }, uploadImageOpTimeout);

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
                            
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Response: "' + response + '"');
                            def.resolve(id);                            
                        } else {
                            obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Response: "' + response + '"');
                            def.reject(response);
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
        
        obj.setPhraseParam(configObj.phrase);
        obj.setRegsenseParam(configObj.regsense);
        obj.setNumericParam(configObj.numeric);
        obj.setCalcParam(configObj.calc);
        obj.setMinLenParam(configObj.minLen);
        obj.setMaxLenParam(configObj.maxLen)
        obj.setIsRussianParam(configObj.isRussian);
        obj.setMaxBidParam(configObj.maxBid);
        obj.setSoftIdParam(configObj.softId);
        obj.setHeaderAcaoParam(configObj.headerAcao);         
    }  

    /**
     * Method that launches 'checkBalance' operation.
     *
     * Method will push 'checkBalance' operation to the stack if another operation was executed previously.
     *
     * @access privileged
     *
     * @return object deferred object
     *
     */  
    
    this.checkBalance = function() 
    { 
        try {        
            return this.startOp(checkBalance);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "checkBalance"...');
        }
    };
    
    /**
     * Method that launches 'checkCaptchaStatus' operation.
     *
     * Method will push 'checkCaptchaStatus' operation to the stack if another operation was executed previously.
     *
     * @access privileged
     * 
     * @param string id of the captcha that must be checked
     *
     * @return object deferred object
     *
     */      
      
    this.checkCaptchaStatus = function(id)
    {
        try {        
            return this.startOp(checkCaptchaStatus, id);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "checkBalance"...');
        }           
    }  
    
    /**
     * Method that launches 'uploadImage' operation.
     *
     * Method will push 'uploadImage' operation to the stack if another operation was executed previously.
     *
     * @access privileged
     * 
     * @param string imagePath path to the captcha image
     *
     * @return object deferred object
     *
     */      
    
    this.uploadImage = function(imagePath)
    {
        try {
            return this.startOp(uploadImage, imagePath);  
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "uploadImage"...');
        }
    }
    
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
    
    /**
     * Method that returns 'phrase' parameter value.
     *
     * Simple method that returns 'phrase' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether captcha consist of one word or multiple.
     * 
     */      
    
    this.getPhraseParam = function()
    {
        return phraseParam;
    }   
    
    /**
     * Method that returns 'regsense' parameter value.
     *
     * Simple method that returns 'regsense' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether captcha is case sensitive or not
     * 
     */      
    
    this.getRegsenseParam = function()
    {
        return regsenseParam; 
    }      
    
    /**
     * Method that returns 'numeric' parameter value.
     *
     * Simple method that returns 'numeric' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether captcha consist entirely of numbers or not
     * 
     */      
    
    this.getNumericParam = function()
    {
        return numericParam;
    }      
    
    /**
     * Method that returns 'calc' parameter value.
     *
     * Simple method that returns 'calc' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether captcha presume mathematical operation or not
     * 
     */      
    
    this.getCalcParam = function()
    {
        return calcParam;
    }    
    
    /**
     * Method that returns 'min_len' parameter value.
     *
     * Simple method that returns 'min_len' parameter value.
     *
     * @access privileged
     * 
     * @return integer minimum captcha text length
     * 
     */      
    
    this.getMinLenParam = function()
    {
        return minLenParam;
    }     
  
    /**
     * Method that returns 'max_len' parameter value.
     *
     * Simple method that returns 'max_len' parameter value.
     *
     * @access privileged
     * 
     * @return integer maximum captcha text length
     * 
     */      
    
    this.getMaxLenParam = function()
    {
        return maxLenParam;
    }        

    /**
     * Method that returns 'is_russian' parameter value.
     *
     * Simple method that returns 'is_russian' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether captcha contains only russian letters or not
     * 
     */      
    
    this.getIsRussianParam = function()
    {
        return isRussianParam;
    }      
    
    /**
     * Method that returns 'max_bid' parameter value.
     *
     * Simple method that returns 'max_bid' parameter value.
     *
     * @access privileged
     * 
     * @return integer bid value
     * 
     */      
    
    this.getMaxBidParam = function()
    {
        return maxBidParam; 
    }   

    /**
     * Method that returns 'soft_id' parameter value.
     *
     * Simple method that returns 'soft_id' parameter value.
     *
     * @access privileged
     * 
     * @return string software id
     * 
     */      
    
    this.getSoftIdParam = function()
    {
        return softIdParam; 
    }  

    /**
     * Method that returns 'header_acao' parameter value.
     *
     * Simple method that returns 'header_acao' parameter value.
     *
     * @access privileged
     * 
     * @return integer indicates whether antigate service will send 'Access-Control-Allow-Origin: *' header in response to most requests
     * 
     */      
    
    this.getHeaderAcaoParam = function()
    {
        return headerAcaoParam;
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
     
    /**
     * Method that sets 'phrase' parameter value.
     *
     * Simple method that sets 'phrase' parameter value. If 0 is passed - captcha consist of one word, if 1 is passed - captcha consist
     * multiple words.
     *
     * @access privileged
     * 
     * @param integer phrase indicates whether captcha consist of one word or multiple.
     * 
     * @throws string
     * 
     */      
    
    this.setPhraseParam = function(phrase)
    {
        if (typeof phrase != 'number') {
            throw '"phrase" parameter must be numeric';
        }
        
        if (phrase > 0) {
            phraseParam = 1;
        } else {
            phraseParam = 0;
        }           
    } 

    /**
     * Method that sets 'regsense' parameter value.
     *
     * Simple method that sets 'regsense' parameter value. If 0 is passed - captcha is case insensitive, if 1 is passed - captcha 
     * is case sensitive.
     *
     * @access privileged
     * 
     * @param integer regsense indicates whether captcha is case sensitive or not.
     * 
     * @throws string
     * 
     */      
    
    this.setRegsenseParam = function(regsense)
    {
        if (typeof regsense != 'number') {
            throw '"regsense" parameter must be numeric';
        }
        
        if (regsense > 0) {
            regsenseParam = 1;
        } else {
            regsenseParam = 0;
        }           
    }
     
    /**
     * Method that sets 'numeric' parameter value.
     *
     * Simple method that sets 'numeric' parameter value. If 0 is passed - captcha may contain letters as well as numbers, 
     * if 1 is passed - captcha contains only numbers, if 2 is passed - captcha contains only letters.
     *
     * @access privileged
     * 
     * @param integer numeric indicates whether captcha consist entirely of numbers or not
     * 
     * @throws string
     * 
     */      
    
    this.setNumericParam = function(numeric)
    {
        if (typeof numeric != 'number') {
            throw '"numeric" parameter must be numeric';
        }
        
        if (numeric <= 0) {
            numericParam = 0;
        } else if (numeric == 1) {
            numericParam = 1;
        } else {
            numericParam = 2;
        }           
    }  
    
    /**
     * Method that sets 'calc' parameter value.
     *
     * Simple method that sets 'calc' parameter value. If 0 is passed - captcha does not contain any numeric operations, 
     * if 1 is passed - captcha contains a numeric operation.
     *
     * @access privileged
     * 
     * @param integer calc indicates whether captcha presume mathematical operation or not
     * 
     * @throws string
     * 
     */      
    
    this.setCalcParam = function(calc)
    {
        if (typeof calc != 'number') {
            throw '"calc" parameter must be numeric';
        }
        
        if (calc <= 0) {
            calcParam = 0;
        } else {
            calcParam = 1;
        }         
    }  
    
    /**
     * Method that sets 'min_len' parameter value.
     *
     * Simple method that sets 'min_len' parameter value. If 0 is passed - minimal length of the captcha may vary, if passed value 
     * is greater then 0 and less than 20 - minimal length of the captcha must adhere to this value.
     *
     * @access privileged
     * 
     * @param integer minLen minimum captcha text length
     * 
     * @throws string
     * 
     */      
  
    this.setMinLenParam = function(minLen)
    {
        if (typeof minLen != 'number') {
            throw '"min_len" parameter must be numeric';
        }
        
        if (minLen <= 0) {
            minLenParam = 0;
        } else if (minLen > 0 && minLen <= 20){
            minLenParam = minLen;
        } else {
            minLenParam = 20;
        }         
    }   
    
    /**
     * Method that sets 'max_len' parameter value.
     *
     * Simple method that sets 'max_len' parameter value. If 0 is passed - maximal length of the captcha may vary, if passed value 
     * is greater then 0 and less than 20 - maximal length of the captcha must adhere to this value.
     *
     * @access privileged
     * 
     * @param integer maxLen maximum captcha text length
     * 
     * @throws string
     * 
     */      
  
    this.setMaxLenParam = function(maxLen)
    {
        if (typeof maxLen != 'number') {
            throw '"max_len" parameter must be numeric';
        }
        
        if (maxLen <= 0) {
            maxLenParam = 0;
        } else if (maxLen > 0 && maxLen <= 20){
            maxLenParam = maxLen;
        } else {
            maxLenParam = 20;
        }         
    }     
       
    /**
     * Method that sets 'is_russian' parameter value.
     *
     * Simple method that sets 'is_russian' parameter value. If 0 is passed - no special actions is taken, if 1 is passed - will 
     * be assumed that captcha contains russian letters.
     *
     * @access privileged
     * 
     * @param integer isRussian indicates whether captcha contains only russian letters or not
     * 
     * @throws string
     * 
     */      
    
    this.setIsRussianParam = function(isRussian)
    {
        if (typeof isRussian != 'number') {
            throw '"is_russian" parameter must be numeric';
        }
        
        if (isRussian <= 0) {
            isRussianParam = 0;
        } else {
            isRussianParam = 1;
        }         
    }     
    
    /**
     * Method that sets 'max_bid' parameter value.
     *
     * Simple method that sets 'max_bid' parameter value. Passed parameter must range from 0.001 to 0.1 in order to take effect. 
     * Zero value can be passed to restrict use this parameter in requests.
     *
     * @access privileged
     * 
     * @param integer bid value    
     * 
     * @throws string
     * 
     */      
    
    this.setMaxBidParam = function(bid)
    {
        if (typeof bid != 'number') {
            throw '"max_bid" parameter must be numeric';
        }
        
        if (bid <= 0) {
            maxBidParam = 0;
        } else if (bid > 0 && bid < 0.001) {
            maxBidParam = 0.001;
        } else if (bid >= 0.001 && bid <= 0.1 ) {
            maxBidParam = bid;
        } else if (bid > 0.1) {
            maxBidParam = 0.1;
        }         
    }   


    /**
     * Method that sets 'soft_id' parameter value.
     *
     * Simple method that sets 'soft_id' parameter value. Passing empty string to this parameter will prevent of using software id
     * parameter in requests;
     *
     * @access privileged
     * 
     * @param string softId software id  
     * 
     * @throws string
     * 
     */      
    
    this.setSoftIdParam = function(softId)
    {
        if (typeof softId != 'string') {
            throw '"soft_id" parameter must be string';
        }
        
        softIdParam = softId;
    } 
    
    /**
     * Method that sets 'header_acao' parameter value.
     *
     * Simple method that sets 'header_acao' parameter value. If 0 is passed - no special headers will be send in response to the
     * request to antigate service, if 1 is passed - 'Access-Control-Allow-Origin: *' will be send.
     *
     * @access privileged
     * 
     * @param integer headerAcao indicates whether antigate service will send 'Access-Control-Allow-Origin: *' header in response to most requests
     * 
     * @throws string
     * 
     */      
    
    this.setHeaderAcaoParam = function(headerAcao)
    {
        if (typeof headerAcao != 'number') {
            throw '"header_acao" parameter must be numeric';
        }
        
        if (headerAcao <= 0) {
            headerAcaoParam = 0;
        } else {
            headerAcaoParam = 1;
        }         
    }    

    /* Privileged set methods ends here */  

    this.configureService(configObj);
}

exports.create = function create(configObj) {
    "use strict";
    
    Antigate.prototype = service.create(configObj, 'antigate');
    return new Antigate(configObj, 'antigate');
};