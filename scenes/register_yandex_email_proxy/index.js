var ym = require('../../modules/yandex/services/mail').create({
    'viewportWidth': 1024,
    'viewportHeight': 768,
    
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomjs_scripts/modules/',
    
    // odnoklassniki configs
    'reloginOnStart': true
});

ym.registerMailAccount();