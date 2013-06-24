//var antigate = require('../modules/antigate/antigate');
var yandexMail = require('../modules/yandex/mail');

curYandexMail = yandexMail.create('');
curYandexMail.openRegPage();

//curCaptBot = captchabot.create('8f7fc1c96990c14cc3ebdbf752405140');
//var def = curCaptBot.checkBalance();

//def.done(function(data){console.log(data);});

//phantom.cookiesEnabled = true;

//curAntigateBot = antigate.create('');
//
//
//var def = curAntigateBot.checkBalance();

//def.done(function(data){console.log(data);});
/* Page event handler methods starts here */

/* Page event handler methods ends here */

/* Core functions starts here */

/* Core functions ends here */

/* Page jump handler functions starts here */

/*
// https://passport.yandex.ru/...
function onMailRegisterPageJump(status)
{
    var resp = response.create('yandex', curPageURL, 'processing', status, 'unknown', 'Parsing page with captcha...');
    console.log(JSON.stringify(resp));     
     
    if (status == 'success') {
        
        var captcha = curPage.evaluate(function (findOffset) {                               
            var img = document.getElementsByClassName("captcha-img");                      
            return findOffset(img[0]);
        }, sandboxutils.findOffset);
        
        
        curPage.clipRect = {top: captcha.top, left: captcha.left, width: captcha.width, height: captcha.height};
        curPage.render("test.png");
        
        resp = response.create('yandex', curPageURL, 'finishing', status, 'success', 'Successfully saved captcha image...');
        console.log(JSON.stringify(resp));  
        phantom.exit();  
    } else {
        resp = response.create('yandex', curPageURL, 'finishing', status, 'fail', 'Captcha page is not loading...');
        console.log(JSON.stringify(resp));  
        phantom.exit();
    }   
}

function onUndefinedURLJump(status)
{
    var resp = response.create('yandex', curPageURL, 'finishing', status, 'unknown', 'Undefined page...');
    console.log(JSON.stringify(resp));     
    phantom.exit();  
}*/

/* Page jump handler functions ends here */
/*
curPage.settings.userAgent = 'WebKit/534.46 Mobile/9A405 Safari/7534.48.3';
curPage.open('http://mail.yandex.ru/', function() {
});*/