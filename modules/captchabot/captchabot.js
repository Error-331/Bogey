// Modules include
var page = require('webpage');

var captchabot = function()
{
    /* Private members starts here */
    
    var mainPageURL = 'http://captchabot.com/rpc/xml.php';

    var curPage = page.create();
    var curPageURL = '';    
    
    /* Private members starts here */
    
    /* Private event handlers starts here */
    
    curPage.onUrlChanged = function(targetUrl) {
        curPageURL = targetUrl; 
    };

    curPage.onLoadFinished = function(status) {
        switch(curPageURL) {
            case mainPageURL:
                break;
            default:
                break;
        }
    };    
    
    /* Private event handlers ends here */
    
    /* Privileged core methods starts here */
    
    this.openMainPage = function () {
        curPage.open(mainPageURL, function() {          
        });
    };
    
    /* Privileged core methods ends here */
}

/* Public members starts here */
/* Public members ends here */

exports.captchabot = captchabot;