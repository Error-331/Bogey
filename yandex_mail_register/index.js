var page = require('webpage');
var curPage = page.create();
var curPageURL = '';

/* Page event handler methods starts here */

curPage.onUrlChanged = function(targetUrl) {
    curPageURL = targetUrl;
    console.log('New URL: ' + targetUrl);
};

/* Page event handler methods ends here */

/* Page jump handler functions starts here */

// http://mail.yandex.ru/
function onMainMailPageJump(status)
{
    var response = {
        'step': 1,
        'url': curPageURL,
        'page_status': status,
        'operation_status': false,
        'operation_desc': ''
    };
    
    if (status == 'success') {
        var link = curPage.evaluate(function() {
            return document.getElementsByClassName("b-big-button")[0].href;
        });

        if (typeof link != 'string' && link.length < 0) {
            response.operation_desc = 'Cannot find link to mail registration'
            
            console.log(JSON.stringify(response));
            phantom.exit();
        }
        
        curPage.open(link, onMailRegisterPageJump);        
    } else {
        
        console.log(JSON.stringify(response));
        phantom.exit();
    }
}

// https://passport.yandex.ru/...
function onMailRegisterPageJump(status)
{
    var response = {
        'url': curPageURL,
        'page_status': status,
        'operation_status': false,
        'operation_desc': ''
    };   
      
    if (status == 'success') {
        
        var captcha = curPage.evaluate(function () {
            
            function getOffset(obj) 
            {
                var obj2 = obj;
                var curtop = 0;
                var curleft = 0;
                
                if (document.getElementById || document.all) {
                    do  {
                        curleft += obj.offsetLeft - obj.scrollLeft;
                        curtop += obj.offsetTop - obj.scrollTop;
                        
                        obj = obj.offsetParent;
                        obj2 = obj2.parentNode;
                        
                        while (obj2 != obj) {
                            curleft -= obj2.scrollLeft;
                            curtop -= obj2.scrollTop;
                            obj2 = obj2.parentNode;
                        }
                    } while (obj.offsetParent)
                } else if (document.layers) {
                    curtop += obj.y;
                    curleft += obj.x;
                }

            return { top: curtop, left: curleft };
            }
                        
            var img = document.getElementsByClassName("captcha-img");
            
            var offset = getOffset(img[0]);
            offset.width = img[0].offsetWidth;
            offset.height = img[0].offsetHeight;
            
            return offset;
        });
        
        
        curPage.clipRect = {top: captcha.top, left: captcha.left, width: captcha.width, height: captcha.height};
        curPage.render("test.png");
        
        response.operation_status = true;
        console.log(JSON.stringify(response));
        phantom.exit();  
    } else {
        console.log(JSON.stringify(response));
        phantom.exit();
    }   
}

/* Page jump handler functions ends here */

curPage.settings.userAgent = 'WebKit/534.46 Mobile/9A405 Safari/7534.48.3';
curPage.open('http://mail.yandex.ru/', onMainMailPageJump);