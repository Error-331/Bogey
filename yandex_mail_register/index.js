//var antigate = require('../modules/antigate/antigate');
var yandexMail = require('../modules/yandex/mail');

curYandexMail = yandexMail.create('');
curYandexMail.extractRegPageCaptcha().done(function(){
    //phantomjs.exit();
}).fail(function(){
    //phantomjs.exit();
});

//curCaptBot = captchabot.create('8f7fc1c96990c14cc3ebdbf752405140');
//var def = curCaptBot.checkBalance();