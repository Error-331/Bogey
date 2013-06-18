// Modules include
var page = require('webpage');
var response = require('../io/response');

var captchabot = function()
{
    /* Private members starts here */
    
    var mainPageURL = 'http://captchabot.com/rpc/xml.php';

    var moduleName = 'captchabot';

    var curPage = page.create();
    var curPageURL = '';    
    
    /* Private members starts here */
    
    /* Private event handlers starts here */
    
    function onMainPageJump(status)
    {
        if (status == 'success') {
            var resp = new response.response(moduleName, curPageURL, 'starting', status, 'unknown', 'Main page opened successfully...');
            console.log(JSON.stringify(resp));              
        } else {
            var resp = new response.response(moduleName, curPageURL, 'starting', status, 'unknown', 'Fail to open main page...');
            console.log(JSON.stringify(resp));              
        }
    }
    
    /* Private event handles ends here */
    
    /* Private (phantomJS) event handlers starts here */
    
    curPage.onUrlChanged = function(targetUrl) {
        curPageURL = targetUrl; 
    };

    curPage.onLoadFinished = function(status) {
        switch(curPageURL) {
            case mainPageURL:
                onMainPageJump(status);
                break;
            default:
                break;
        }
    };    
    
    /* Private (phantomJS) event handlers ends here */
    
    /* Privileged core methods starts here */
    
    this.openMainPage = function () {
        curPage.open(mainPageURL, function() {          
        });
    };
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    /* Privileged set methods ends here */    
}

/* Public members starts here */
/* Public members ends here */

exports.captchabot = captchabot;