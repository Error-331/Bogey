var antigate = require('../modules/antigate/antigate');
var yandexMail = require('../modules/yandex/mail');

var curAntigate = antigate.create({
    'systemKey':'bfd936a2bd18bb817df7e95d3621a7c8',
    'phrase': 0,
    'regsense': 0,
    'numeric': 0,
    'calc': 0,
    'minLen': 0,
    'maxLen': 0,
    'isRussian': 1,
    'maxBid': 0,
    'softId': '',
    'headerAcao': 0
});

var curYandexMail = yandexMail.create();

curYandexMail.extractRegPageCaptcha('captchas', 'test', 'jpeg').done(function(){
    curAntigate.uploadImage('captchas/test.jpeg').done(function(id){
        curAntigate.checkCaptchaStatus(id).done(function(captcha){
            console.log('Captcha is:' + captcha);
            phantom.exit();
        }).fail(function(){
            phantom.exit();
        });
    }).fail(function(){
        phantom.exit();
    });
}).fail(function(){
    phantom.exit();
});