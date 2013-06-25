var antigate = require('../modules/antigate/antigate');
var yandexMail = require('../modules/yandex/mail');

var curAntigate = antigate.create('bfd936a2bd18bb817df7e95d3621a7c8');
var curYandexMail = yandexMail.create('');

curYandexMail.extractRegPageCaptcha('', 'test').done(function(){
    
}).fail(function(){
    phantom.exit();
});

//curAntigate.checkBalance().done(function(val){
  //  console.log(val);
//})

//curCaptBot = captchabot.create('8f7fc1c96990c14cc3ebdbf752405140');
//var def = curCaptBot.checkBalance();

/*
curYandexMail.extractRegPageCaptcha().done(function(){
    //phantomjs.exit();
}).fail(function(){
    //phantomjs.exit();
});*/

